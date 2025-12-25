# Mock Medicine E-Commerce Ecosystem

This mock ecosystem contains two dummy medicine e-commerce sites that simulate real-world pharmacies like Tata 1mg and Apollo. These are designed for testing the MCV (Medical Comparison and Verification) server.

## Architecture

```
mock-ecosystem/
├── server.js          (MCV Server Orchestrator on port 3000)
├── site-a/
│   ├── package.json
│   └── server.js      (Premium Quality Pharmacy on port 3001)
└── site-b/
    ├── package.json
    └── server.js      (Budget Friendly Pharmacy on port 3002)
```

## Quick Start

### 1. Install Dependencies

```bash
# Install main ecosystem dependencies
npm install

# Install Site A dependencies
cd site-a && npm install && cd ..

# Install Site B dependencies
cd site-b && npm install && cd ..
```

### 2. Start All Servers

You can run all three servers in separate terminals:

**Terminal 1 - Site A (Premium, Port 3001):**
```bash
cd site-a && npm start
```

**Terminal 2 - Site B (Budget, Port 3002):**
```bash
cd site-b && npm start
```

**Terminal 3 - MCV Server (Orchestrator, Port 3000):**
```bash
npm start
```

Or use the provided batch script (Windows):
```bash
start-all.bat
```

## Site Characteristics

### Site A - Premium Quality Store (Port 3001)
- **Pricing**: Higher prices
- **Delivery**: 1-2 days (Fast)
- **Quality Rating**: High (4.5-4.9)
- **Use Case**: When you need medicine quickly and prefer quality

**Medicines Available:**
- Aspirin 500mg - ₹250
- Vitamin D3 1000IU - ₹180
- Amoxicillin 250mg - ₹120
- Paracetamol 500mg - ₹80
- Omeprazole 20mg - ₹200

### Site B - Budget Friendly Store (Port 3002)
- **Pricing**: Lower prices
- **Delivery**: 2-3 days (Standard)
- **Quality Rating**: Good (4.0-4.4)
- **Use Case**: When you want to save money and can wait longer

**Medicines Available:**
- Aspirin 500mg - ₹180
- Vitamin D3 1000IU - ₹120
- Amoxicillin 250mg - ₹85
- Paracetamol 500mg - ₹50
- Omeprazole 20mg - ₹140
- Metformin 500mg - ₹95

## API Endpoints

### Site A & Site B APIs

#### Get All Medicines
```bash
curl http://localhost:3001/api/medicines
curl http://localhost:3002/api/medicines
```

#### Search Medicines
```bash
curl http://localhost:3001/api/medicines/search/Aspirin
curl http://localhost:3002/api/medicines/search/Vitamin
```

#### Get Medicine by ID
```bash
curl http://localhost:3001/api/medicines/a1
curl http://localhost:3002/api/medicines/b1
```

#### Create Order
```bash
curl -X POST http://localhost:3001/api/orders \
  -H "Content-Type: application/json" \
  -d '{
    "medicines": [
      {"medicineId": "a1", "quantity": 10}
    ],
    "userEmail": "user@example.com",
    "address": "123 Main St, City, State",
    "paymentMethod": "COD"
  }'
```

#### Get Order Status
```bash
curl http://localhost:3001/api/orders/SITE-A-1234567890
```

#### Compare Pricing
```bash
curl -X POST http://localhost:3001/api/pricing/compare \
  -H "Content-Type: application/json" \
  -d '{
    "medicineNames": ["Aspirin 500mg", "Vitamin D3 1000IU"]
  }'
```

### MCV Server API (Port 3000)

#### 1. Compare Prices Across All Sites
```bash
curl -X POST http://localhost:3000/api/mcv/compare-prices \
  -H "Content-Type: application/json" \
  -d '{
    "medicineNames": ["Aspirin 500mg", "Vitamin D3 1000IU", "Paracetamol 500mg"]
  }'
```

**Response:**
```json
{
  "success": true,
  "comparison": {
    "searchedMedicines": [...],
    "siteA": [...],
    "siteB": [...]
  },
  "recommendations": [
    {
      "medicine": "Aspirin 500mg",
      "options": [...],
      "recommendation": "Site B for better price"
    }
  ]
}
```

#### 2. Get Sample Prescription
```bash
curl http://localhost:3000/api/mcv/test-prescription
```

#### 3. Process Prescription (Semi-Automatic)
Requires manual approval:
```bash
curl -X POST http://localhost:3000/api/mcv/process-prescription \
  -H "Content-Type: application/json" \
  -d '{
    "prescription": {
      "prescriptionId": "RX-001",
      "medicines": [
        {"name": "Aspirin 500mg", "quantity": 10},
        {"name": "Vitamin D3 1000IU", "quantity": 30}
      ]
    },
    "userEmail": "user@example.com",
    "address": "123 Main St, City",
    "autoApprove": false
  }'
```

#### 4. Process Prescription (Fully Automatic)
Auto-approves and places order:
```bash
curl -X POST http://localhost:3000/api/mcv/process-prescription \
  -H "Content-Type: application/json" \
  -d '{
    "prescription": {
      "prescriptionId": "RX-001",
      "medicines": [
        {"name": "Aspirin 500mg", "quantity": 10}
      ]
    },
    "userEmail": "user@example.com",
    "address": "123 Main St, City",
    "autoApprove": true,
    "preferredSite": "B"
  }'
```

#### 5. Approve Order (Manual)
```bash
curl -X POST http://localhost:3000/api/mcv/approve-order \
  -H "Content-Type: application/json" \
  -d '{
    "site": "A",
    "medicines": [
      {"medicineId": "a1", "quantity": 10}
    ],
    "userEmail": "user@example.com",
    "address": "123 Main St, City"
  }'
```

#### 6. Track Order
```bash
curl http://localhost:3000/api/mcv/track-order/SITE-A-1234567890/A
```

## Features for Your MCV System

✅ **Price Comparison** - Automatically compares prices across multiple sites
✅ **Automatic/Semi-Automatic Ordering** - Can place orders with or without approval
✅ **Order Tracking** - Get real-time order status
✅ **Medicine Search** - Find medicines by name or category
✅ **Stock Management** - Tracks availability
✅ **Delivery Time Estimation** - Different delivery speeds per site
✅ **Quality Ratings** - Compare quality ratings between sites

## Next Steps for Your MCV Server

To build a complete MCV system, you'll need to add:

1. **PDF Prescription Upload** - Parse doctor prescriptions
2. **Calendar Integration** - Google Calendar & Apple Calendar APIs
3. **Clinic Finder** - Map integration for nearby clinics
4. **Appointment Booking** - Schedule appointments
5. **Medicine Reminders** - Push notifications for medicine intake
6. **Report Interpreter** - Parse lab reports (blood test, x-ray, etc.)
7. **User Authentication** - Secure user accounts
8. **Payment Integration** - Real payment gateways
9. **Notification System** - Email/SMS/Push notifications

## Testing Tips

1. **Start with price comparison** to verify the MCV server can communicate with both sites
2. **Test semi-automatic mode first** to ensure approval flow works
3. **Use curl or Postman** to test APIs
4. **Monitor console logs** in each terminal to see request flow
5. **Check stock levels** after placing orders

## Future Enhancements

- Add authentication and user accounts
- Implement wishlist and favorites
- Add prescription history
- Real-time inventory sync
- Payment gateway integration
- Multi-city delivery
- Customer reviews and ratings
- Medicine expiry tracking
