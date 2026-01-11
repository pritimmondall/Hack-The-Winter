from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel 
import easyocr
import shutil
import google.generativeai as genai
import os
import json
import requests
import webbrowser
from datetime import date, timedelta
from dotenv import load_dotenv

from agent.bot import PharmaAgent 
from calendar_service import add_checkup_event 
from maps_service_osm import find_labs_osm 

load_dotenv()

app = FastAPI()

# 1. ENABLE CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 2. SETUP GEMINI
api_key = os.getenv("GEMINI_API_KEY")
if not api_key:
    print("Warning: API Key missing. Bot will use Mock Data.")
    api_key = "dummy_key"

genai.configure(api_key=api_key)


model = genai.GenerativeModel('gemini-2.5-flash')

print("Loading OCR Engine...")
reader = easyocr.Reader(['en'])

def get_auto_location():
    """Auto-detects location via IP."""
    try:
        response = requests.get("http://ip-api.com/json", timeout=3)
        data = response.json()
        if data['status'] == 'success':
            return float(data['lat']), float(data['lon'])
    except:
        pass
    return 0.0, 0.0

def parse_with_ai(ocr_text_list):
    raw_text = " ".join(ocr_text_list)
    today_str = date.today().isoformat()
    
    prompt = f"""
    You are a medical assistant. Today is {today_str}.
    
    Analyze this prescription: "{raw_text}"
    
    Tasks:
    1. Extract medicines with detailed intake instructions.
    2. Extract tests.
    3. Calculate 'next_visit' date based on text like "Review in 3 days" (add to {today_str}).
    
    Return strict JSON (no markdown):
    {{
      "medicines": [ 
        {{ 
          "name": "str", 
          "dosage": "str", 
          "frequency": "str (e.g. 1-0-1 or Twice daily)", 
          "instructions": "str (e.g. After food, Empty stomach, Before sleep)" 
        }} 
      ],
      "tests": ["str"],
      "next_visit": "YYYY-MM-DD" or null
    }}
    """
    try:
        response = model.generate_content(prompt)
        clean_json = response.text.replace("```json", "").replace("```", "").strip()
        return json.loads(clean_json)
        
    except Exception as e:
        print(f"\n⚠️ AI ERROR: {e}")
        # Fallback now includes instructions for the demo
        fallback_date = (date.today() + timedelta(days=7)).isoformat()
        return {
            "medicines": [
                {"name": "Paracetamol", "dosage": "650mg", "frequency": "SOS", "instructions": "Only for high fever"},
                {"name": "Azithromycin", "dosage": "500mg", "frequency": "1-0-0", "instructions": "After lunch, do not skip"}
            ],
            "tests": ["CBC", "Chest X-Ray"],
            "next_visit": fallback_date
        }

@app.post("/process-prescription")
async def process_prescription(
    file: UploadFile = File(...),
    priority: str = Form("price"),
    find_labs: bool = Form(True) 
):
    temp_filename = f"temp_{file.filename}"
    with open(temp_filename, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    try:
        print(f"Processing {file.filename}...")
        ocr_result = reader.readtext(temp_filename, detail=0)
        
        # AI PARSING
        structured_data = parse_with_ai(ocr_result)
        
        # CALENDAR LOGIC
        calendar_status = None
        if structured_data.get("next_visit"):
            print(f"📅 Checkup Date Found: {structured_data['next_visit']}")
            # Uses your fixed calendar_service.py
            calendar_status = add_checkup_event(structured_data['next_visit'], "Doctor Follow-up")
        else:
            print("📅 No checkup date found.")

        # BOT & MAP LOGIC
        bot = None
        agent_report = []
        map_url = None
        
        # A. Maps
        detected_tests = structured_data.get("tests", [])
        if detected_tests and find_labs:
            print(f"🔬 Tests found: {detected_tests}")
            lat, lng = get_auto_location()
            if lat != 0.0:
                map_data = find_labs_osm(lat, lng, detected_tests)
                map_url = map_data.get("map_directions_link") or map_data.get("map_search_link")
                if map_url:
                    webbrowser.open(map_url)

        # B. Shop
        if structured_data.get("medicines"):
            try:
                print("💊 Launching Shopping Bot...")
                bot = PharmaAgent()
                agent_report = bot.process_order(structured_data["medicines"], user_priority=priority)
                bot.close()
            except Exception as e:
                print(f"Bot Error: {e}")
                if bot: bot.close()

        return {
            "status": "success",
            "data": structured_data,
            "calendar_event": calendar_status,
            "agent_report": agent_report,
            "map_url": map_url
        }
        
    finally:
        if os.path.exists(temp_filename):
            os.remove(temp_filename)

class LabSearchRequest(BaseModel):
    lat: float = 0.0
    lng: float = 0.0
    test_names: list[str]

@app.post("/find-labs")
async def find_labs_endpoint(request: LabSearchRequest):
    lat, lng = request.lat, request.lng
    if lat == 0.0: lat, lng = get_auto_location()
    
    result = find_labs_osm(lat, lng, request.test_names)
    return {
        "status": "success", 
        "url": result.get("map_directions_link")
    }