from fastapi import FastAPI, UploadFile, File, Form
import easyocr
import shutil
import google.generativeai as genai
import os
import json
from datetime import date # <--- NEW IMPORT for date math
from dotenv import load_dotenv

# Import your modules
from agent.bot import PharmaAgent 
from calendar_service import add_checkup_event # <--- NEW IMPORT for Calendar

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
    
    # Get today's date so Gemini can calculate "Next week" or "In 7 days"
    today_str = date.today().isoformat() 
    
    prompt = f"""
    You are a medical assistant. Today is {today_str}.
    
    Analyze this prescription text: "{raw_text}"
    
    Extract data into strict JSON format. 
    Do not add markdown formatting like ```json. Just return the raw JSON string.
    
    Keys required:
    - medicines: list of objects with "name", "dosage", "frequency"
    - tests: list of strings (e.g. "X-Ray", "Blood Test")
    
    # INSTRUCTION: If text says 'Review in 7 days' or similar, calculate the exact date starting from {today_str}.
    # Return strictly in "YYYY-MM-DD" format. If no date mentioned, return null.
    - next_visit: "YYYY-MM-DD" or null
    """
    try:
        response = model.generate_content(prompt)
        # Clean potential markdown
        clean_json = response.text.replace("```json", "").replace("```", "").strip()
        return json.loads(clean_json)
    except Exception as e:
        print(f"AI PARSING ERROR: {e}")
        return {"error": "AI Parsing Failed", "medicines": [], "next_visit": None}

@app.post("/process-prescription")
async def process_prescription(
    file: UploadFile = File(...),
    priority: str = Form("price")  # Accepts "price" or "delivery"
):
    temp_filename = f"temp_{file.filename}"
    with open(temp_filename, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    try:
        # 1. OCR (The Eyes)
        print(f"Processing image: {file.filename} with Priority: {priority.upper()}")
        ocr_result = reader.readtext(temp_filename, detail=0)
        
        # 2. AI Processing (The Brain)
        structured_data = parse_with_ai(ocr_result)
        
        # --- NEW: CALENDAR INTEGRATION ---
        calendar_status = None
        if structured_data.get("next_visit"):
            print(f"📅 Found Checkup Date: {structured_data['next_visit']}")
            # Creates the event in Google Calendar
            calendar_status = add_checkup_event(structured_data['next_visit'], "Doctor Follow-up")
        else:
            print("📅 No next visit date found in prescription.")

        # 3. AGENT EXECUTION (The Hands)
        agent_report = []
        
        if "medicines" in structured_data and len(structured_data["medicines"]) > 0:
            print(f"Found {len(structured_data['medicines'])} medicines. Launching Agent...")
            
            try:
                bot = PharmaAgent()
                
                # Pass the user's priority to the bot
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

        # 4. Final Response
        return {
            "status": "success",
            "priority_used": priority,
            "structured_data": structured_data,
            "calendar_event": calendar_status, # <--- Returns the event link to the user
            "agent_report": agent_report,
            "raw_ocr": ocr_result
        }
        
    finally:
        if os.path.exists(temp_filename):
            os.remove(temp_filename)