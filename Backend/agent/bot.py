import time
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager

class PharmaAgent:
    def __init__(self):
        # SETTINGS
        self.site_a_url = "http://localhost:3001"
        self.site_b_url = "http://localhost:3002"
        
        # Setup Chrome Browser
        options = webdriver.ChromeOptions()
        # IMPORTANT: We leave this False so you can SEE the bot working
        options.add_argument("--start-maximized")
        
        # Initialize Driver
        self.driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=options)
        print("[AGENT] Browser Launched.")

    def get_price_from_site(self, site_url, medicine_name):
        """Visits a site, searches, and scrapes the price."""
        try:
            print(f"[AGENT] Checking {site_url} for {medicine_name}...")
            
            # 1. Go to Search Page
            search_url = f"{site_url}/search?q={medicine_name}"
            self.driver.get(search_url)
            time.sleep(1) # Wait for simulation
            
            # 2. Extract Price (Using the IDs Member 4 created)
            # We assume the dummy site has <span id="med-price">25</span>
            price_element = self.driver.find_element(By.ID, "med-price")
            price = float(price_element.text)
            
            print(f"   -> Found price: ₹{price}")
            return price
        except Exception as e:
            print(f"   -> {medicine_name} not found on {site_url}")
            return float('inf') # Infinite price if not found

    def execute_purchase(self, site_url, medicine_name):
        """Goes to the specific site and clicks the Buy button."""
        print(f"[AGENT] DECISION MADE: Buying {medicine_name} from {site_url}")
        
        # 1. Navigate to the item
        self.driver.get(f"{site_url}/search?q={medicine_name}")
        time.sleep(1)
        
        # 2. Click "Add to Cart" / "Buy"
        try:
            buy_btn = self.driver.find_element(By.ID, "add-to-cart")
            buy_btn.click()
            print("[AGENT] 'Add to Cart' Clicked!")
            
            # 3. Simulate Checkout (Wait so we can see it)
            time.sleep(2)
            
            # Handle standard JS Alert if the dummy site has one
            try:
                alert = self.driver.switch_to.alert
                alert.accept()
                print("[AGENT] Accepted Purchase Popup.")
            except:
                pass
                
        except Exception as e:
            print(f"[AGENT] Error clicking buy button: {e}")

    def process_order(self, medicine_list):
        """Main Loop: Iterates through all medicines in prescription."""
        results = []
        
        for med in medicine_list:
            name = med['name'] # Expected from Gemini JSON
            
            # 1. Compare Prices
            price_a = self.get_price_from_site(self.site_a_url, name)
            price_b = self.get_price_from_site(self.site_b_url, name)
            
            if price_a == float('inf') and price_b == float('inf'):
                print(f"[AGENT] SKIPPING: {name} not found anywhere.")
                continue

            # 2. Decision Logic
            if price_a < price_b:
                best_site = self.site_a_url
                best_price = price_a
                site_name = "MockPharma A"
            else:
                best_site = self.site_b_url
                best_price = price_b
                site_name = "MockPharma B"

            # 3. Action (The "Buying" Part)
            self.execute_purchase(best_site, name)
            
            results.append({
                "medicine": name,
                "bought_from": site_name,
                "price": best_price,
                "status": "Ordered"
            })
            
        return results

    def close(self):
        print("[AGENT] Work done. Closing browser.")
        time.sleep(2)
        self.driver.quit()