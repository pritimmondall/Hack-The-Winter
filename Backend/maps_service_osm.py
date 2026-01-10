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
    1. Fetches raw data from OSM (Nominatim).
    2. Converts EVERYTHING into Google Maps Links.
    """
    
    # --- PART 1: FETCH RAW DATA ---
    url = "https://nominatim.openstreetmap.org/search"
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
            p_lat = place.get("lat")
            p_lon = place.get("lon")
            name = place.get("display_name", "").split(",")[0]
            
            dist = calculate_distance(lat, lng, p_lat, p_lon)
            
            # Filter: Must be within 15km
            if dist <= 15.0:
                # GENERATE INDIVIDUAL GOOGLE MAPS LINK
                # Format: search/?api=1&query={name}&query_place_id={lat},{lon}
                encoded_name = name.replace(" ", "+")
                gmaps_link = f"https://www.google.com/maps/search/?api=1&query={encoded_name}&query_place_id={p_lat},{p_lon}"
                
                labs_list.append({
                    "name": name,
                    "full_address": place.get("display_name"),
                    "lat": p_lat,
                    "lon": p_lon,
                    "distance_km": dist,
                    "google_maps_link": gmaps_link # <--- Now Google, not OSM
                })
        
        # Sort by distance (Index 0 is Nearest)
        labs_list.sort(key=lambda x: x["distance_km"])

    except Exception as e:
        print(f"[OSM] Data Fetch Error: {e}")
        labs_list = []

    # --- PART 2: GENERATE MAIN ACTION LINKS (Standard Google Format) ---
    
    # Logic: Pick the best search term
    tests_str = " ".join(test_names).lower()
    if "x-ray" in tests_str or "scan" in tests_str:
        query_term = "Diagnostic Centre"
    elif "blood" in tests_str:
        query_term = "Pathology Lab"
    else:
        query_term = "Hospital"
    
    # 1. SEARCH LINK (The "Explore" view)
    # Format: https://www.google.com/maps/search/?api=1&query={term}+near+{lat},{lng}
    encoded_query = f"{query_term} near {lat},{lng}".replace(" ", "+")
    search_link = f"https://www.google.com/maps/search/?api=1&query={encoded_query}"

    # 2. NAVIGATION LINK (The "Go Now" view)
    directions_link = ""
    if len(labs_list) > 0:
        best_lab = labs_list[0]
        # Format: https://www.google.com/maps/dir/?api=1&origin={lat},{lng}&destination={lat},{lng}&travelmode=driving
        directions_link = (
            f"https://www.google.com/maps/dir/?api=1"
            f"&origin={lat},{lng}"
            f"&destination={best_lab['lat']},{best_lab['lon']}"
            f"&travelmode=driving"
        )

    return {
        "labs": labs_list[:5],        
        "map_search_link": search_link,
        "map_directions_link": directions_link
    }