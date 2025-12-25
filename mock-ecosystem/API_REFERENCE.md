# MCV Server - Quick API Reference

## Server Ports
- **MCV Orchestrator**: http://localhost:3000
- **Site A (Premium)**: http://localhost:3001
- **Site B (Budget)**: http://localhost:3002

---

## MCV Server Endpoints (Port 3000)

### 1. Compare Prices
**Method:** `POST`  
**Endpoint:** `/api/mcv/compare-prices`

**Request:**
```json
{
  "medicineNames": ["Aspirin 500mg", "Vitamin D3 1000IU"]
}
```

**Response:**
```json
{
  "success": true,
  "comparison": {
    "siteA": [...],
    "siteB": [...]
  },
  "recommendations": [...]
}
```

---

### 2. Process Prescription (Semi-Auto)
**Method:** `POST`  
**Endpoint:** `/api/mcv/process-prescription`

**Request:**
```json
{
  "prescription": {
    "prescriptionId": "RX-001",
    "medicines": [
      {"name": "Aspirin 500mg", "quantity": 10}
    ]
  },
  "userEmail": "user@example.com",
  "address": "123 Main St",
  "autoApprove": false
}
```

**Response:** (When autoApprove=false)
```json
{
  "success": true,
  "status": "PENDING_APPROVAL",
  "orderPreview": {...}
}
```

---

### 3. Process Prescription (Auto)
**Method:** `POST`  
**Endpoint:** `/api/mcv/process-prescription`

**Request:**
```json
{
  "prescription": {...},
  "userEmail": "user@example.com",
  "address": "123 Main St",
  "autoApprove": true,
  "preferredSite": "A"
}
```

**Response:** (When autoApprove=true)
```json
{
  "success": true,
  "status": "ORDER_PLACED",
  "order": {...}
}
```

---

### 4. Approve Order
**Method:** `POST`  
**Endpoint:** `/api/mcv/approve-order`

**Request:**
```json
{
  "site": "A",
  "medicines": [
    {"medicineId": "a1", "quantity": 10}
  ],
  "userEmail": "user@example.com",
  "address": "123 Main St"
}
```

**Response:**
```json
{
  "success": true,
  "status": "ORDER_PLACED",
  "order": {...}
}
```

---

### 5. Track Order
**Method:** `GET`  
**Endpoint:** `/api/mcv/track-order/:orderId/:site`

**Example:**
```
GET /api/mcv/track-order/SITE-A-1672896456789/A
```

**Response:**
```json
{
  "success": true,
  "data": {
    "orderId": "SITE-A-1672896456789",
    "status": "confirmed",
    "totalPrice": 450,
    "estimatedDelivery": "2024-01-25T10:30:00.000Z"
  }
}
```

---

### 6. Get Medicine Details
**Method:** `GET`  
**Endpoint:** `/api/mcv/medicine/:id/:site`

**Example:**
```
GET /api/mcv/medicine/a1/A
```

---

### 7. Get Test Prescription
**Method:** `GET`  
**Endpoint:** `/api/mcv/test-prescription`

**Response:**
```json
{
  "success": true,
  "prescription": {
    "prescriptionId": "RX-001",
    "medicines": [...],
    "validUntil": "2024-02-24T10:30:00.000Z"
  }
}
```

---

### 8. Health Check
**Method:** `GET`  
**Endpoint:** `/health`

---

## Pharmacy APIs (Port 3001 & 3002)

### Get All Medicines
```
GET /api/medicines
```

### Search Medicines
```
GET /api/medicines/search/Aspirin
```

### Get Medicine by ID
```
GET /api/medicines/a1
```

### Create Order
```
POST /api/orders
```

**Body:**
```json
{
  "medicines": [
    {"medicineId": "a1", "quantity": 10}
  ],
  "userEmail": "user@example.com",
  "address": "123 Main St",
  "paymentMethod": "COD"
}
```

### Get Order
```
GET /api/orders/:orderId
```

### Compare Pricing
```
POST /api/pricing/compare
```

**Body:**
```json
{
  "medicineNames": ["Aspirin 500mg", "Vitamin D3 1000IU"]
}
```

---

## Common cURL Commands

### Test MCV Server
```bash
# Health check all servers
curl http://localhost:3000/health
curl http://localhost:3001/health
curl http://localhost:3002/health

# Get test prescription
curl http://localhost:3000/api/mcv/test-prescription

# Compare prices
curl -X POST http://localhost:3000/api/mcv/compare-prices \
  -H "Content-Type: application/json" \
  -d '{"medicineNames":["Aspirin 500mg","Paracetamol 500mg"]}'

# Process prescription (semi-auto)
curl -X POST http://localhost:3000/api/mcv/process-prescription \
  -H "Content-Type: application/json" \
  -d '{
    "prescription":{"prescriptionId":"RX-001","medicines":[{"name":"Aspirin 500mg","quantity":10}]},
    "userEmail":"user@example.com",
    "address":"123 Main St",
    "autoApprove":false
  }'

# Process prescription (auto)
curl -X POST http://localhost:3000/api/mcv/process-prescription \
  -H "Content-Type: application/json" \
  -d '{
    "prescription":{"prescriptionId":"RX-001","medicines":[{"name":"Aspirin 500mg","quantity":10}]},
    "userEmail":"user@example.com",
    "address":"123 Main St",
    "autoApprove":true,
    "preferredSite":"B"
  }'
```

---

## Response Status Codes

| Code | Meaning |
|------|---------|
| 200 | Success |
| 400 | Bad Request (missing/invalid fields) |
| 404 | Not Found (medicine/order doesn't exist) |
| 500 | Server Error |

---

## Medicine IDs

### Site A
- a1: Aspirin 500mg
- a2: Vitamin D3 1000IU
- a3: Amoxicillin 250mg
- a4: Paracetamol 500mg
- a5: Omeprazole 20mg

### Site B
- b1: Aspirin 500mg
- b2: Vitamin D3 1000IU
- b3: Amoxicillin 250mg
- b4: Paracetamol 500mg
- b5: Omeprazole 20mg
- b6: Metformin 500mg

---

## Next Steps

1. Start all servers using `start-all.bat`
2. Test health endpoints
3. Run comparison tests
4. Test semi-automatic workflow
5. Test fully automatic workflow
6. Check TESTING_GUIDE.md for detailed scenarios
