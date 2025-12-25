# 🏥 MCV Server - Mock Pharmacy Ecosystem Setup Complete

## What Has Been Created

You now have a fully functional mock medicine e-commerce ecosystem with two dummy pharmacy sites for testing your Medical Comparison and Verification (MCV) server!

---

## 📁 Directory Structure

```
mock-ecosystem/
├── server.js                 (MCV Orchestrator Server - Port 3000)
├── package.json              (Main dependencies)
├── start-all.bat            (Windows batch script to start all servers)
├── API_REFERENCE.md         (Quick API reference guide)
├── TESTING_GUIDE.md         (Detailed test scenarios)
├── README.md                (Complete documentation)
├── site-a/                  (Premium Quality Pharmacy)
│   ├── server.js            (Port 3001)
│   └── package.json
└── site-b/                  (Budget Friendly Pharmacy)
    ├── server.js            (Port 3002)
    └── package.json
```

---

## 🏪 Two Pharmacy Sites Created

### Site A - Premium Quality Store (Port 3001)
**Characteristics:**
- 💰 Higher prices (premium quality)
- ⚡ Fast delivery: 1-2 days
- ⭐ High ratings: 4.5-4.9
- 📦 Available medicines: 5 types
- **Best for**: When speed and quality matter

**Pricing Example:**
- Aspirin 500mg: ₹250
- Vitamin D3 1000IU: ₹180
- Paracetamol 500mg: ₹80

### Site B - Budget Friendly Store (Port 3002)
**Characteristics:**
- 💵 Lower prices (budget-friendly)
- 🚚 Standard delivery: 2-3 days
- ⭐ Good ratings: 4.0-4.4
- 📦 Available medicines: 6 types (includes Metformin)
- **Best for**: When saving money is priority

**Pricing Example:**
- Aspirin 500mg: ₹180
- Vitamin D3 1000IU: ₹120
- Paracetamol 500mg: ₹50

---

## 🚀 How to Run

### Option 1: Batch Script (Recommended for Windows)
```bash
start-all.bat
```
This will open 3 terminals and start all servers automatically.

### Option 2: Manual Start (3 separate terminals)

**Terminal 1 - Site A:**
```bash
cd site-a
npm start
```

**Terminal 2 - Site B:**
```bash
cd site-b
npm start
```

**Terminal 3 - MCV Server:**
```bash
npm start
```

### Verify All Servers Running
```bash
curl http://localhost:3000/health
curl http://localhost:3001/health
curl http://localhost:3002/health
```

---

## 🎯 Key Features Implemented

### ✅ Price Comparison
- Compare prices across multiple sites
- Get recommendations based on price/delivery
- Real-time pricing updates

### ✅ Automatic Order Processing
- Place orders with auto-approval
- Semi-automatic with manual confirmation
- Choose preferred pharmacy

### ✅ Order Management
- Place orders with stock validation
- Track orders with tracking ID
- Get order status and delivery estimates

### ✅ Medicine Database
- Search medicines by name
- Get detailed medicine info
- Stock availability tracking

### ✅ Error Handling
- Stock unavailability checks
- Proper HTTP status codes
- Meaningful error messages

---

## 📡 Main API Endpoints

### MCV Server (Port 3000)

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/api/mcv/compare-prices` | Compare prices across sites |
| POST | `/api/mcv/process-prescription` | Process prescription (auto/semi-auto) |
| POST | `/api/mcv/approve-order` | Manual order approval |
| GET | `/api/mcv/track-order/:id/:site` | Track order status |
| GET | `/api/mcv/medicine/:id/:site` | Get medicine details |
| GET | `/api/mcv/test-prescription` | Get sample prescription |

### Pharmacy APIs (3001 & 3002)

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/api/medicines` | Get all medicines |
| GET | `/api/medicines/search/:name` | Search medicines |
| GET | `/api/medicines/:id` | Get medicine by ID |
| POST | `/api/orders` | Create order |
| GET | `/api/orders/:id` | Get order status |
| POST | `/api/pricing/compare` | Compare prices |

---

## 🧪 Quick Test Example

### 1. Get Test Prescription
```bash
curl http://localhost:3000/api/mcv/test-prescription
```

### 2. Compare Prices
```bash
curl -X POST http://localhost:3000/api/mcv/compare-prices \
  -H "Content-Type: application/json" \
  -d '{"medicineNames":["Aspirin 500mg","Paracetamol 500mg"]}'
```

### 3. Process Prescription (Semi-Auto)
```bash
curl -X POST http://localhost:3000/api/mcv/process-prescription \
  -H "Content-Type: application/json" \
  -d '{
    "prescription":{"prescriptionId":"RX-001","medicines":[{"name":"Aspirin 500mg","quantity":10}]},
    "userEmail":"user@example.com",
    "address":"123 Main St",
    "autoApprove":false
  }'
```

### 4. Approve Order
```bash
curl -X POST http://localhost:3000/api/mcv/approve-order \
  -H "Content-Type: application/json" \
  -d '{
    "site":"A",
    "medicines":[{"medicineId":"a1","quantity":10}],
    "userEmail":"user@example.com",
    "address":"123 Main St"
  }'
```

---

## 📚 Documentation Files

1. **README.md** - Complete setup and usage guide
2. **API_REFERENCE.md** - Quick API endpoint reference
3. **TESTING_GUIDE.md** - Detailed test scenarios with expected outputs

Read these for complete understanding!

---

## 🔧 What's Ready for Your MCV Server

Your mock ecosystem now supports:

✅ Medicine availability checking  
✅ Price comparison across pharmacies  
✅ Order placement and tracking  
✅ Stock management  
✅ Semi-automatic and fully automatic workflows  
✅ Different delivery speeds  
✅ Quality ratings  

---

## 🚀 Next Steps for Full MCV Implementation

To complete your MCV server vision, you'll need to add:

1. **Prescription Upload**
   - PDF parsing
   - OCR for prescription reading
   - Medicine name extraction

2. **Calendar Integration**
   - Google Calendar API
   - Apple Calendar API
   - Automatic appointment scheduling

3. **Clinic Finder**
   - Google Maps API integration
   - Clinic search by location
   - Appointment booking APIs

4. **Medicine Reminders**
   - Push notifications
   - SMS/Email reminders
   - Take medicine schedules

5. **Lab Report Processing**
   - PDF parsing for reports
   - Nearby clinic recommendations
   - Appointment scheduling

6. **User Authentication**
   - Login/signup
   - User profiles
   - Medical history storage

7. **Real Payment Integration**
   - Razorpay/PayPal integration
   - Multiple payment options
   - Secure checkout

8. **Notification System**
   - Email notifications
   - SMS alerts
   - In-app notifications

---

## 💡 Key Differentiators of Your MCV System

🏥 **Automatic Pharmacy Comparison** - Compares prices instantly  
🔐 **Privacy-First** - Uses local mock sites (before going live)  
⚙️ **Flexible Control** - Auto or manual approval at each step  
📅 **Calendar Integration** - Auto-schedule checkups  
🏨 **Smart Clinic Selection** - Find best nearby clinics  
💊 **Medicine Intelligence** - Detailed instructions and reminders  

---

## 📝 Notes

- All servers use CORS enabled so they can communicate
- Body-parser is configured for JSON requests
- Mock data includes realistic medicine prices and delivery times
- Stock decreases with each order (simulates real inventory)
- Order IDs are unique with timestamps

---

## 🆘 Troubleshooting

**Port Already in Use?**
- Change PORT in server files

**Dependencies not installing?**
- Make sure Node.js and npm are installed
- Delete node_modules and package-lock.json, run npm install again

**CORS Errors?**
- All servers have CORS enabled
- Check server console logs for detailed error info

**Connection refused?**
- Verify all servers are running
- Check correct ports (3000, 3001, 3002)

---

## 📞 Testing Support

Use **Postman** or **curl** for API testing. See API_REFERENCE.md for all endpoints!

---

**Your MCV Server mock ecosystem is now ready for testing! 🎉**
