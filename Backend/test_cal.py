from calendar_service import add_checkup_event
from datetime import date, timedelta

print("--- TESTING CALENDAR ---")
# Try to add an event for tomorrow
tomorrow = (date.today() + timedelta(days=1)).isoformat()
result = add_checkup_event(tomorrow, "MedVision Test Event")
print(f"RESULT: {result}")