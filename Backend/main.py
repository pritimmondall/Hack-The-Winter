from fastapi import FastAPI, UploadFile, File
import easyocr
import shutil
import google.generativeai as genai
import os
import json
from dotenv import load_dotenv

# --- NEW IMPORT: Import your Bot ---
# This assumes your folder structure is backend/agent/bot.py
from agent.bot import PharmaAgent 

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
    """Sends raw text to Gemini to get structured JSON."""
    raw_text = " ".join(ocr_text_list)
    prompt = f"""
    Extract medical data from this text into strict JSON.
    Do not add markdown formatting like ```json. Just return the raw JSON string.
    Keys required:
    - medicines: list of objects with "name", "dosage", "frequency"
    - tests: list of strings (e.g. "X-Ray", "Blood Test")
    - next_visit: "str" or null
    
    Text: {raw_text}
    """
    try:
        response = model.generate_content(prompt)
        # Clean potential markdown
        clean_json = response.text.replace("```json", "").replace("```", "").strip()
        return json.loads(clean_json)
    except Exception as e:
        print(f"AI PARSING ERROR: {e}")
        return {"error": "AI Parsing Failed", "medicines": []} # Return empty medicines on error

@app.post("/process-prescription")
async def process_prescription(file: UploadFile = File(...)):
    temp_filename = f"temp_{file.filename}"
    with open(temp_filename, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    try:
        # 1. OCR (The Eyes)
        print(f"Processing image: {file.filename}")
        ocr_result = reader.readtext(temp_filename, detail=0)
        
        # 2. AI Processing (The Brain)
        structured_data = parse_with_ai(ocr_result)
        
        # 3. AGENT EXECUTION (The Hands)
        agent_report = []
        
        # Only run the bot if we actually found medicines
        if "medicines" in structured_data and len(structured_data["medicines"]) > 0:
            print(f"Found {len(structured_data['medicines'])} medicines. Launching Agent...")
            
            try:
                # Initialize the Bot
                bot = PharmaAgent()
                
                # Run the shopping logic
                agent_report = bot.process_order(structured_data["medicines"])
                
                # Close the browser
                bot.close()
            except Exception as e:
                print(f"AGENT FAILED: {e}")
                agent_report = [{"error": str(e), "status": "Agent Crashed"}]
        else:
            print("No medicines found to buy.")

        # 4. Final Response
        return {
            "status": "success",
            "structured_data": structured_data,
            "agent_report": agent_report, # This contains the "Bought from Site A" details
            "raw_ocr": ocr_result
        }
        
    finally:
        # Cleanup temp file
        if os.path.exists(temp_filename):
            os.remove(temp_filename)