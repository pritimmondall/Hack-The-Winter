import os.path
import datetime
from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build

# If modifying these scopes, delete the file token.json.
SCOPES = ['https://www.googleapis.com/auth/calendar']

def get_calendar_service():
    """Shows basic usage of the Google Calendar API."""
    creds = None
    
    # 1. The Fix: Use 'from_authorized_user_file' instead of 'from_json'
    if os.path.exists('token.json'):
        try:
            creds = Credentials.from_authorized_user_file('token.json', SCOPES)
        except Exception:
            # If the token is corrupted, delete it and try again
            os.remove('token.json')
            creds = None

    # 2. If no valid credentials, log in again
    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            try:
                creds.refresh(Request())
            except Exception:
                # If refresh fails, force re-login
                creds = None
        
        if not creds:
            flow = InstalledAppFlow.from_client_secrets_file(
                'credentials.json', SCOPES)
            creds = flow.run_local_server(port=0)
        
        # Save the credentials for the next run
        with open('token.json', 'w') as token:
            token.write(creds.to_json())

    service = build('calendar', 'v3', credentials=creds)
    return service

def add_checkup_event(date_str, summary="Medical Checkup"):
    """
    Adds an all-day event to the primary calendar.
    date_str must be in 'YYYY-MM-DD' format.
    """
    try:
        service = get_calendar_service()
        
        event = {
            'summary': f'🩺 {summary}',
            'description': 'Scheduled automatically by MCV Server based on your prescription.',
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

        created_event = service.events().insert(calendarId='primary', body=event).execute()
        print(f"[CALENDAR] Event created: {created_event.get('htmlLink')}")
        return {"status": "success", "link": created_event.get('htmlLink')}
        
    except Exception as e:
        print(f"[CALENDAR] Error: {e}")
        return {"status": "failed", "error": str(e)}