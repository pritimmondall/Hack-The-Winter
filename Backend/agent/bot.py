import time
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager

class PharmaAgent:
    def __init__(self):
        # Site Configuration
        self.sites = [
            {"name": "MockPharma A", "url": "http://localhost:3001", "id": "site_a"},
            {"name": "MockPharma B", "url": "http://localhost:3002", "id": "site_b"}
        ]
        
        options = webdriver.ChromeOptions()
        options.add_argument("--start-maximized")
        self.driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=options)

    def get_product_details(self, site_url, medicine_name):
        """Scrapes BOTH Price and Delivery Days."""
        try:
            print(f"[AGENT] Checking {site_url} for {medicine_name}...")
            self.driver.get(f"{site_url}/search?q={medicine_name}")
            time.sleep(1) # Wait for load

            # 1. Scrape Price
            price_element = self.driver.find_element(By.ID, "med-price")
            price = float(price_element.text)

            # 2. Scrape Delivery Days (The new feature)
            try:
                days_element = self.driver.find_element(By.ID, "delivery-days")
                days = int(days_element.text)
            except:
                days = 5 # Default to 5 days if not found
            
            return {"price": price, "days": days, "found": True}
        
        except Exception:
            return {"price": float('inf'), "days": 99, "found": False}

    def execute_purchase(self, site_url, medicine_name):
        """Executes the actual buy action."""
        print(f"   -> BUYING from {site_url}...")
        self.driver.get(f"{site_url}/search?q={medicine_name}")
        time.sleep(1)
        
        try:
            # Click Add to Cart (which now auto-redirects to checkout)
            self.driver.find_element(By.ID, "add-to-cart").click()
            time.sleep(2) # Wait for redirect
            
            # Click Place Order
            self.driver.find_element(By.ID, "placeOrderBtn").click()
            time.sleep(2)
        except Exception as e:
            print(f"   -> Purchase Failed: {e}")

    def process_order(self, medicine_list, user_priority="price"):
        """
        user_priority: 'price' or 'delivery'
        """
        results = []
        
        for med in medicine_list:
            name = med['name']
            print(f"\n--- Processing: {name} (Priority: {user_priority}) ---")
            
            # 1. Gather Data from All Sites
            site_data = []
            for site in self.sites:
                details = self.get_product_details(site['url'], name)
                if details['found']:
                    details['site_name'] = site['name']
                    details['url'] = site['url']
                    site_data.append(details)

            if not site_data:
                print("   -> Not found anywhere.")
                continue

            # 2. THE NEW DECISION LOGIC
            best_option = None
            
            if user_priority == "price":
                # Sort primarily by Price (Low to High), secondarily by Days
                site_data.sort(key=lambda x: (x['price'], x['days']))
            else: # priority == "delivery"
                # Sort primarily by Days (Low to High), secondarily by Price
                site_data.sort(key=lambda x: (x['days'], x['price']))
            
            best_option = site_data[0] # The first item is now the best choice

            print(f"   -> Winner: {best_option['site_name']} (₹{best_option['price']}, {best_option['days']} days)")

            # 3. Buy It
            self.execute_purchase(best_option['url'], name)
            
            results.append({
                "medicine": name,
                "bought_from": best_option['site_name'],
                "price": best_option['price'],
                "delivery_days": best_option['days']
            })
            
        return results

    def open_map_link(self, map_url):
        """
        Opens the provided Google Maps link in a new browser tab.
        """
        try:
            print(f"[AGENT] Opening Map Location: {map_url}")
            
            # Open new tab
            self.driver.execute_script("window.open('');")
            
            # Switch to the new tab (it's usually the last handle)
            self.driver.switch_to.window(self.driver.window_handles[-1])
            
            # Load the Map
            self.driver.get(map_url)
            time.sleep(3) # Let it load so the user sees it
            
            # Optional: Switch back to the main tab if you want to continue shopping
            # self.driver.switch_to.window(self.driver.window_handles[0])
            
        except Exception as e:
            print(f"[AGENT] Failed to open map: {e}")

    def close(self):
        self.driver.quit()