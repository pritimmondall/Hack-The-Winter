# Hack-The-Winter


# 🏥 MedVision: Autonomous Prescription Orchestrator

**MedVision** is an intelligent Model Context Protocol (MCP) server that automates the entire pharmacy workflow. It takes a doctor's prescription, digitizes it using AI, and uses autonomous agents to find the best medicine deals (optimizing for price or delivery speed) across multiple pharmacy vendors. It also schedules follow-up appointments automatically via Google Calendar.

----------------------------------------------------------------------------

## How MedVision Works

### 1. User Journey

    1. Upload Prescription: The user uploads a photo of their prescription via the frontend.
    2. Text Extraction: The backend uses OCR (EasyOCR) to extract text from the image.
    3. AI Analysis: Google Gemini AI parses the text, identifies medicines, and extracts relevant dates.
    4. Autonomous Shopping: An agent compares prices and delivery times across multiple pharmacy sites, then auto-checks out the best option.
    5. Order Confirmation: The backend logs the order and provides confirmation.
    6. Calendar Integration: If a follow-up date is detected, an event is automatically created in the user's Google Calendar.

### 2. System Architecture
    ```mermaid
    graph TD
        User[User / Frontend] -->|Upload Prescription| API[FastAPI Backend]
        API -->|Extract Text| OCR[EasyOCR Engine]
        OCR -->|Raw Text| LLM[Google Gemini AI]
        LLM -->|Structured JSON| Agent[Autonomous Bot Agent]
        subgraph "Agentic Workflow"
            Agent -->|Scrape Prices| SiteA[Pharmacy A]
            Agent -->|Scrape Prices| SiteB[Pharmacy B]
            Agent -->|Compare & Decide| Logic{Priority?}
            Logic -->|Price/Time| Buy[Auto-Buy & Checkout]
        end
        LLM -->|Extract Dates| Calendar[Google Calendar API]
        Buy -->|Order Confirmation| DB[(Database / Logs)]
        Calendar -->|Create Event| GCal[User Calendar]


### 3. Data Flow Diagram

    sequenceDiagram
        participant User
        participant Server as MCP Server (FastAPI)
        participant AI as Gemini + OCR
        participant Bot as Selenium Agent
        participant Site as Pharmacy Sites
        participant GCal as Google Calendar

    User->>Server: Upload Image + Priority (Price/Speed)
    Server->>AI: Send Image for Analysis
    AI-->>Server: Return JSON (Medicines + Next Visit Date)
    par Parallel Actions
        Server->>Bot: Trigger Shopping Agent
        Bot->>Site: Search Medicine
        Site-->>Bot: Return Price & Delivery Time
        Bot->>Site: Add to Cart & Checkout
        Bot-->>Server: Return Order Report
    and
        Server->>GCal: If 'Next Visit' exists, Create Event
        GCal-->>Server: Return Event Link
    end
    Server-->>User: Final Response (Order Status + Calendar Link)


### 4. Agent Decision Logic

    flowchart LR
        Start([Start]) --> Input[Receive Medicine List]
        Input --> CheckPriority{User Priority?}
        CheckPriority -- "Price" --> SortPrice[Sort by Price]
        CheckPriority -- "Delivery" --> SortTime[Sort by Delivery Time]
        SortPrice --> TieBreaker1{Same Price?}
        TieBreaker1 -- Yes --> SelectFastest[Select Fastest Delivery]
        TieBreaker1 -- No --> SelectCheapest[Select Cheapest]
        SortTime --> TieBreaker2{Same Time?}
        TieBreaker2 -- Yes --> SelectCheapest2[Select Cheapest]
        TieBreaker2 -- No --> SelectFastest2[Select Fastest]
        SelectCheapest --> Buy[Execute Purchase]
        SelectFastest --> Buy
        SelectCheapest2 --> Buy
        SelectFastest2 --> Buy


## Future Roadmap (Round 2)

    1. Enhanced Frontend (Next.js)
        Build a modern dashboard with real-time bot visualization, drag-and-drop prescription upload, and order history.
    2. Geospatial Diagnostic Booking
        Detect diagnostic tests in prescriptions.
        Use Google Maps API to find and book top-rated labs/clinics near the user.
    3. AI-Powered Patient Adherence Guide
        Generate personalized medicine intake guides.
        Alert users about side effects and special instructions.


## Setup & Installation

### Prerequisites
    Python 3.9+
    Node.js (for mock pharmacy sites)
    Google Cloud credentials (credentials.json)

### 1. Start Mock Pharmacy Sites

    Terminal 1
    --------------
    cd mock-ecosystem/site-a
    node server.js

    Terminal 2
    --------------
    cd mock-ecosystem/site-b
    node server.js

### 2. Start the Backend (MCP Brain)

    Terminal 3
    --------------
    cd Backend
    source venv/bin/activate
    pip install -r requirements.txt
    uvicorn main:app --reload

### 3. Usage
    Visit http://localhost:8000/docs
    ---------------------------------
    Upload a prescription and watch the bot work!

# Team : Printf("winner");
