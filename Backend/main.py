from fastapi import FastAPI, UploadFile, File, Form
from pydantic import BaseModel 
import easyocr
import shutil
import google.generativeai as genai
import os
import json
import requests
import webbrowser  # <--- NEW IMPORT: To open real system browser
from datetime import date 
from dotenv import load_dotenv

# Import your modules
from agent.bot import PharmaAgent 
from calendar_service import add_checkup_event 
from maps_service_osm import find_labs_osm 

load_dotenv()

app = FastAPI()

# --- MODEL SETUP ---
api_key = os.getenv("GEMINI_API_KEY")
if not api_key:
    raise ValueError("CRITICAL: GEMINI_API_KEY is missing from .env file!")

genai.configure(api_key=api_key)

def get_working_model():
    print("Searching for available models...")
    try:
        for m in genai.list_models():
            if 'generateContent' in m.supported_generation_methods:
                if 'flash' in m.name:
                    return genai.GenerativeModel(m.name)
        return genai.GenerativeModel('gemini-pro')
    except Exception as e:
        return genai.GenerativeModel('gemini-1.5-flash')

model = get_working_model()
reader = easyocr.Reader(['en'])

# --- HELPER: AUTO-LOCATION ---
def get_auto_location():
    """Auto-detects location via IP."""
    try:
        response = requests.get("http://ip-api.com/json")
        data = response.json()
        if data['status'] == 'success':
            print(f"📍 Auto-Detected Location: {data['city']}, {data['country']}")
            return float(data['lat']), float(data['lon'])
    except Exception as e:
        print(f"Location detection failed: {e}")
    return 0.0, 0.0

# --- HELPER: AI PARSER ---
def parse_with_ai(ocr_text_list):
    raw_text = " ".join(ocr_text_list)
    today_str = date.today().isoformat() 
    prompt = f"""
    You are a medical assistant. Today is {today_str}.
    Analyze this prescription text: "{raw_text}"
    Extract data into strict JSON format. 
    
    Keys required:
    - medicines: list of objects with "name", "dosage", "frequency"
    - tests: list of strings (e.g. "X-Ray", "Blood Test"). If none, return [].
    - next_visit: "YYYY-MM-DD" or null
    """
    try:
        response = model.generate_content(prompt)
        clean_json = response.text.replace("```json", "").replace("```", "").strip()
        return json.loads(clean_json)
    except Exception as e:
        print(f"AI Error: {e}")
        return {"medicines": [], "tests": [], "next_visit": None}

# --- MAIN ENDPOINT ---
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
        # 1. OCR & AI
        print(f"Processing {file.filename}...")
        ocr_result = reader.readtext(temp_filename, detail=0)
        structured_data = parse_with_ai(ocr_result)
        
        # 2. CALENDAR
        calendar_status = None
        if structured_data.get("next_visit"):
            print(f"📅 Found Checkup Date: {structured_data['next_visit']}")
            calendar_status = add_checkup_event(structured_data['next_visit'], "Doctor Follow-up")

        # 3. HANDLE ACTIONS (Bot & Maps)
        bot = None
        agent_report = []
        map_url = None
        
        # A. OPEN MAPS (If tests found + Permission given)
        # We do this FIRST or INDEPENDENTLY so it opens in your real browser
        detected_tests = structured_data.get("tests", [])
        if detected_tests and find_labs:
            print(f"🔬 Tests found: {detected_tests}. Locating labs...")
            
            lat, lng = get_auto_location()
            
            if lat != 0.0:
                map_data = find_labs_osm(lat, lng, detected_tests)
                
                # Try Navigate Link -> Fallback to Search Link
                map_url = map_data.get("map_directions_link")
                if not map_url:
                    map_url = map_data.get("map_search_link")
                
                if map_url:
                    print(f"[SYSTEM] Opening Map in Real Browser: {map_url}")
                    # THE FIX: Use webbrowser to open in your actual OS browser
                    webbrowser.open(map_url)
            else:
                print("Could not auto-detect location for maps.")

        # B. BUY MEDICINES (The Bot)
        if structured_data.get("medicines"):
            try:
                print("💊 Launching Shopping Bot...")
                bot = PharmaAgent()
                agent_report = bot.process_order(structured_data["medicines"], user_priority=priority)
                
                # Close the bot when done (This won't close the Map now!)
                bot.close()
            except Exception as e:
                print(f"Bot Error: {e}")
                if bot: bot.close()

        return {
            "status": "success",
            "tests_found": structured_data.get("tests", []),
            "map_opened": map_url,
            "calendar_event": calendar_status,
            "agent_report": agent_report,
            "data": structured_data
        }
        
    finally:
        if os.path.exists(temp_filename):
            os.remove(temp_filename)

# --- DEBUG ENDPOINT ---
class LabSearchRequest(BaseModel):
    lat: float = 0.0
    lng: float = 0.0
    test_names: list[str]

@app.post("/find-labs")
async def find_labs_endpoint(request: LabSearchRequest):
    current_lat = request.lat
    current_lng = request.lng
    
    if current_lat == 0.0:
        current_lat, current_lng = get_auto_location()

    result_data = find_labs_osm(current_lat, current_lng, request.test_names)
    
    return {
        "status": "success",
        "location_used": {"lat": current_lat, "lng": current_lng},
        "view_map_url": result_data["map_search_link"],
        "navigate_now_url": result_data["map_directions_link"]
    }