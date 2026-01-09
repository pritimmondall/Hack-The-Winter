from fastapi import FastAPI, UploadFile, File, Form
from pydantic import BaseModel # <--- NEW IMPORT
import easyocr
import shutil
import google.generativeai as genai
import os
import json
from datetime import date 
from dotenv import load_dotenv

# Import your modules
from agent.bot import PharmaAgent 
from calendar_service import add_checkup_event 
from maps_service_osm import find_labs_osm # <--- NEW IMPORT

load_dotenv()

app = FastAPI()

# --- 1. MODEL CONFIGURATION ---
api_key = os.getenv("GEMINI_API_KEY")
if not api_key:
    raise ValueError("CRITICAL: GEMINI_API_KEY is missing from .env file!")

genai.configure(api_key=api_key)

def get_working_model():
    """Automatically finds a model that actually works for this key."""
    print("Searching for available models...")
    try:
        for m in genai.list_models():
            if 'generateContent' in m.supported_generation_methods:
                if 'flash' in m.name:
                    print(f"--> SELECTED MODEL: {m.name}")
                    return genai.GenerativeModel(m.name)
        print("--> WARNING: No 'flash' model found, defaulting to 'gemini-pro'")
        return genai.GenerativeModel('gemini-pro')
    except Exception as e:
        print(f"--> ERROR listing models: {e}")
        return genai.GenerativeModel('gemini-1.5-flash')

model = get_working_model()

# Initialize OCR
print("Loading OCR Engine...")
reader = easyocr.Reader(['en'])

def parse_with_ai(ocr_text_list):
    """Sends raw text to Gemini to get structured JSON with date calculation."""
    raw_text = " ".join(ocr_text_list)
    today_str = date.today().isoformat() 
    
    prompt = f"""
    You are a medical assistant. Today is {today_str}.
    
    Analyze this prescription text: "{raw_text}"
    
    Extract data into strict JSON format. 
    Do not add markdown formatting like ```json. Just return the raw JSON string.
    
    Keys required:
    - medicines: list of objects with "name", "dosage", "frequency"
    - tests: list of strings (e.g. "X-Ray", "Blood Test", "MRI"). If none, return [].
    - next_visit: "YYYY-MM-DD" or null
    
    Text: {raw_text}
    """
    try:
        response = model.generate_content(prompt)
        clean_json = response.text.replace("```json", "").replace("```", "").strip()
        return json.loads(clean_json)
    except Exception as e:
        print(f"AI PARSING ERROR: {e}")
        return {"error": "AI Parsing Failed", "medicines": [], "tests": [], "next_visit": None}

# --- 2. MAIN PROCESSING ENDPOINT ---
@app.post("/process-prescription")
async def process_prescription(
    file: UploadFile = File(...),
    priority: str = Form("price") 
):
    temp_filename = f"temp_{file.filename}"
    with open(temp_filename, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    try:
        # 1. OCR
        print(f"Processing image: {file.filename} with Priority: {priority.upper()}")
        ocr_result = reader.readtext(temp_filename, detail=0)
        
        # 2. AI Processing
        structured_data = parse_with_ai(ocr_result)
        
        # 3. DETECT TESTS (New Feature)
        detected_tests = structured_data.get("tests", [])
        if detected_tests:
            print(f"🔬 Found Diagnostic Tests: {detected_tests}")

        # 4. CALENDAR LOGIC
        calendar_status = None
        if structured_data.get("next_visit"):
            print(f"📅 Found Checkup Date: {structured_data['next_visit']}")
            calendar_status = add_checkup_event(structured_data['next_visit'], "Doctor Follow-up")
        else:
            print("📅 No next visit date found.")

        # 5. AGENT EXECUTION (Buying Medicines)
        agent_report = []
        
        if "medicines" in structured_data and len(structured_data["medicines"]) > 0:
            print(f"Found {len(structured_data['medicines'])} medicines. Launching Agent...")
            try:
                bot = PharmaAgent()
                agent_report = bot.process_order(
                    structured_data["medicines"], 
                    user_priority=priority
                )
                bot.close()
            except Exception as e:
                print(f"AGENT FAILED: {e}")
                agent_report = [{"error": str(e), "status": "Agent Crashed"}]
        else:
            print("No medicines found to buy.")

        # 6. Final Response
        return {
            "status": "success",
            "priority_used": priority,
            "structured_data": structured_data,
            "tests_found": detected_tests, # <--- Frontend checks this. If not empty, ask user to find labs.
            "calendar_event": calendar_status,
            "agent_report": agent_report,
            "raw_ocr": ocr_result
        }
        
    finally:
        if os.path.exists(temp_filename):
            os.remove(temp_filename)

# --- 3. NEW LAB SEARCH ENDPOINT ---
class LabSearchRequest(BaseModel):
    lat: float
    lng: float
    test_names: list[str]

@app.post("/find-labs")
async def find_labs_endpoint(request: LabSearchRequest):
    """
    Called by Frontend (or You in Swagger) if 'tests_found' was not empty.
    """
    print(f"Searching OSM for labs near {request.lat}, {request.lng}")
    
    # Call the OSM Service
    result_data = find_labs_osm(request.lat, request.lng, request.test_names)
    
    return {
        "status": "success",
        "user_query": request.test_names,
        "labs": result_data["labs"],          # Detailed List
        "osm_url": result_data["map_view_link"] # <--- CLICK THIS IN SWAGGER RESPONSE
    }