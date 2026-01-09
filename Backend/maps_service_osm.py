import requests
from math import radians, cos, sin, asin, sqrt

def calculate_distance(lat1, lon1, lat2, lon2):
    """Haversine formula to calculate distance in km."""
    try:
        lon1, lat1, lon2, lat2 = map(radians, [float(lon1), float(lat1), float(lon2), float(lat2)])
        dlon = lon2 - lon1 
        dlat = lat2 - lat1 
        a = sin(dlat/2)**2 + cos(lat1) * cos(lat2) * sin(dlon/2)**2
        c = 2 * asin(sqrt(a)) 
        r = 6371 
        return round(c * r, 2)
    except Exception:
        return 0.0

def find_labs_osm(lat, lng, test_names=[]):
    """
    1. Fetches JSON data from OSM (for your future frontend pins).
    2. Generates a Smart Google Maps Link (for your current demo).
    """
    
    # --- PART 1: FETCH DATA FROM OSM (Nominatim) ---
    # This data is for "Round 2" when you build your Next.js dashboard.
    url = "https://nominatim.openstreetmap.org/search"
    
    # We search broadly in OSM to ensure we get *some* data for the JSON
    osm_query = "hospital clinic medical"
    
    headers = { "User-Agent": "MedVision-Project/1.0" }
    
    params = {
        "q": osm_query,
        "lat": lat,
        "lon": lng,
        "format": "json",
        "limit": 10,
        "addressdetails": 1,
        "dedupe": 1
    }

    labs_list = []
    try:
        response = requests.get(url, params=params, headers=headers)
        data = response.json()
        
        for place in data:
            dist = calculate_distance(lat, lng, place.get("lat"), place.get("lon"))
            # Filter: Only show places within 15km
            if dist <= 15.0:
                labs_list.append({
                    "name": place.get("display_name", "").split(",")[0],
                    "full_address": place.get("display_name"),
                    "lat": place.get("lat"),
                    "lon": place.get("lon"),
                    "distance_km": dist,
                    "osm_link": f"https://www.openstreetmap.org/node/{place.get('osm_id')}"
                })
        
        # Sort by distance
        labs_list.sort(key=lambda x: x["distance_km"])

    except Exception as e:
        print(f"[OSM] Data Fetch Error: {e}")
        # We don't crash; we just return an empty list for the frontend
        labs_list = []

    # --- PART 2: GENERATE SMART GOOGLE MAPS LINK ---
    # This determines what the user actually SEES when they click the link.
    
    # Logic: If prescription has 'X-Ray' or 'Scan', search for 'Diagnostic Centre'.
    # If 'Blood' or 'CBC', search for 'Pathology Lab'.
    # Default to 'Hospital'.
    
    query_term = "Hospital" # Default
    tests_str = " ".join(test_names).lower()
    
    if "x-ray" in tests_str or "scan" in tests_str or "mri" in tests_str:
        query_term = "Diagnostic+Centre"
    elif "blood" in tests_str or "cbc" in tests_str or "urine" in tests_str:
        query_term = "Pathology+Lab"
    
    # Standard Google Search URL syntax:
    # https://www.google.com/maps/search/{query}/@{lat},{lng},{zoom}z
    google_maps_link = f"https://www.google.com/maps/search/{query_term}/@{lat},{lng},14z"

    return {
        "labs": labs_list[:5],        # Backend Data (OSM)
        "map_view_link": google_maps_link # Frontend Visual (Google Maps)
    }