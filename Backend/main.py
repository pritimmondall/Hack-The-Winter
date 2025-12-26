from fastapi import FastAPI, UploadFile, File
import easyocr
import shutil

app = FastAPI()

# Initialize the OCR Reader (loads the AI model into memory)
# This might take a moment to download the first time you run it.
reader = easyocr.Reader(['en']) 

@app.post("/upload-prescription")
async def upload_prescription(file: UploadFile = File(...)):
    # 1. Save the file temporarily
    temp_filename = f"temp_{file.filename}"
    with open(temp_filename, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # 2. Run OCR (The AI Magic)
    # detail=0 gives us just the text strings
    result_text = reader.readtext(temp_filename, detail=0)

    # 3. Return the raw text
    return {
        "status": "success", 
        "extracted_text": result_text 
    }