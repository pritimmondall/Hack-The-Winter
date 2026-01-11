import os
import datetime
from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build

# If modifying these scopes, delete the file token.json.
SCOPES = ['https://www.googleapis.com/auth/calendar']

def get_calendar_service():
    """Authenticates the user and returns the Calendar Service."""
    creds = None
    
    # 1. Check if token.json exists (Saved Login)
    if os.path.exists('token.json'):
        try:
            creds = Credentials.from_authorized_user_file('token.json', SCOPES)
        except Exception as e:
            print(f"[CALENDAR] ⚠️ Corrupted token found ({e}). Deleting it to force re-login...")
            os.remove('token.json')
            creds = None

    # 2. If no valid login, trigger a new one
    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            try:
                print("[CALENDAR] 🔄 Refreshing expired token...")
                creds.refresh(Request())
            except Exception as e:
                print(f"[CALENDAR] ⚠️ Refresh failed ({e}). Deleting token to force re-login...")
                os.remove('token.json')
                creds = None
        
        # If still no creds, launch browser login
        if not creds:
            if not os.path.exists('credentials.json'):
                print("[CALENDAR] ❌ CRITICAL: 'credentials.json' missing! Download it from Google Cloud.")
                return None
                
            print("[CALENDAR] 🔐 Launching Browser for Login... (Please check your browser)")
            flow = InstalledAppFlow.from_client_secrets_file('credentials.json', SCOPES)
            creds = flow.run_local_server(port=0)
        
        # Save the new token
        with open('token.json', 'w') as token:
            token.write(creds.to_json())
            print("[CALENDAR] ✅ Login Successful! Token saved.")

    try:
        service = build('calendar', 'v3', credentials=creds)
        return service
    except Exception as e:
        print(f"[CALENDAR] ❌ API Connection Error: {e}")
        return None

def add_checkup_event(date_str, summary="Medical Checkup"):
    """Creates an all-day event for the given date (YYYY-MM-DD)."""
    print(f"[CALENDAR] Attempting to create event on {date_str}...")
    
    service = get_calendar_service()
    if not service:
        return {"status": "failed", "error": "Could not authenticate."}

    event = {
        'summary': f'🩺 {summary}',
        'description': 'Scheduled automatically by MedVision Bot.',
        'start': {
            'date': date_str,
            'timeZone': 'Asia/Kolkata',
        },
        'end': {
            'date': date_str,
            'timeZone': 'Asia/Kolkata',
        },
        'reminders': {
            'useDefault': False,
            'overrides': [
                {'method': 'email', 'minutes': 24 * 60},
                {'method': 'popup', 'minutes': 10},
            ],
        },
    }

    try:
        created_event = service.events().insert(calendarId='primary', body=event).execute()
        link = created_event.get('htmlLink')
        print(f"[CALENDAR] 🎉 Success! Event created: {link}")
        return {"status": "success", "link": link}
    except Exception as e:
        print(f"[CALENDAR] ❌ Creation Failed: {e}")
        return {"status": "failed", "error": str(e)}