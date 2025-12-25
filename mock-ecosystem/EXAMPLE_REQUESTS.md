# 📋 Example Requests for Testing MCV Server

Copy-paste these commands to test your MCV system!

---

## 🏥 Health Checks

```bash
# Check MCV Server
curl http://localhost:3000/health

# Check Site A
curl http://localhost:3001/health

# Check Site B
curl http://localhost:3002/health
```

---

## 💊 Explore Pharmacies

### Get All Medicines from Site A
```bash
curl http://localhost:3001/api/medicines
```

### Get All Medicines from Site B
```bash
curl http://localhost:3002/api/medicines
```

### Search for Aspirin at Site A
```bash
curl http://localhost:3001/api/medicines/search/Aspirin
```

### Search for Vitamin at Site B
```bash
curl http://localhost:3002/api/medicines/search/Vitamin
```

### Get Specific Medicine
```bash
# Get Aspirin from Site A
curl http://localhost:3001/api/medicines/a1

# Get Paracetamol from Site B
curl http://localhost:3002/api/medicines/b4
```

---

## 🔍 MCV Server - Price Comparison

### Basic Price Comparison
```bash
curl -X POST http://localhost:3000/api/mcv/compare-prices \
  -H "Content-Type: application/json" \
  -d '{
    "medicineNames": ["Paracetamol 500mg"]
  }'
```

### Compare Multiple Medicines
```bash
curl -X POST http://localhost:3000/api/mcv/compare-prices \
  -H "Content-Type: application/json" \
  -d '{
    "medicineNames": [
      "Aspirin 500mg",
      "Paracetamol 500mg",
      "Vitamin D3 1000IU"
    ]
  }'
```

### Complex Prescription Comparison
```bash
curl -X POST http://localhost:3000/api/mcv/compare-prices \
  -H "Content-Type: application/json" \
  -d '{
    "medicineNames": [
      "Aspirin 500mg",
      "Vitamin D3 1000IU",
      "Amoxicillin 250mg",
      "Paracetamol 500mg",
      "Omeprazole 20mg"
    ]
  }'
```

---

## 📝 MCV Server - Get Sample Prescription

```bash
curl http://localhost:3000/api/mcv/test-prescription
```

---

## 🛒 MCV Server - Semi-Automatic Order (Requires Approval)

### Process Prescription - Wait for Approval
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
    "userEmail": "john@example.com",
    "address": "123 Main Street, New York, NY 10001",
    "autoApprove": false
  }'
```

Response will show `PENDING_APPROVAL` status with order preview.

### Approve the Order (Use Site A)
```bash
curl -X POST http://localhost:3000/api/mcv/approve-order \
  -H "Content-Type: application/json" \
  -d '{
    "site": "A",
    "medicines": [
      {"medicineId": "a1", "quantity": 10},
      {"medicineId": "a2", "quantity": 30}
    ],
    "userEmail": "john@example.com",
    "address": "123 Main Street, New York, NY 10001"
  }'
```

### Approve the Order (Use Site B - Cheaper)
```bash
curl -X POST http://localhost:3000/api/mcv/approve-order \
  -H "Content-Type: application/json" \
  -d '{
    "site": "B",
    "medicines": [
      {"medicineId": "b1", "quantity": 10},
      {"medicineId": "b2", "quantity": 30}
    ],
    "userEmail": "john@example.com",
    "address": "123 Main Street, New York, NY 10001"
  }'
```

---

## ⚡ MCV Server - Fully Automatic Order

### Auto-Approve with Site A (Premium)
```bash
curl -X POST http://localhost:3000/api/mcv/process-prescription \
  -H "Content-Type: application/json" \
  -d '{
    "prescription": {
      "prescriptionId": "RX-002",
      "medicines": [
        {"name": "Aspirin 500mg", "quantity": 5}
      ]
    },
    "userEmail": "jane@example.com",
    "address": "456 Oak Avenue, Boston, MA 02101",
    "autoApprove": true,
    "preferredSite": "A"
  }'
```

### Auto-Approve with Site B (Budget)
```bash
curl -X POST http://localhost:3000/api/mcv/process-prescription \
  -H "Content-Type: application/json" \
  -d '{
    "prescription": {
      "prescriptionId": "RX-003",
      "medicines": [
        {"name": "Paracetamol 500mg", "quantity": 20},
        {"name": "Amoxicillin 250mg", "quantity": 10}
      ]
    },
    "userEmail": "bob@example.com",
    "address": "789 Elm Street, Chicago, IL 60601",
    "autoApprove": true,
    "preferredSite": "B"
  }'
```

### Auto-Approve - Full Prescription
```bash
curl -X POST http://localhost:3000/api/mcv/process-prescription \
  -H "Content-Type: application/json" \
  -d '{
    "prescription": {
      "prescriptionId": "RX-FULL",
      "doctorName": "Dr. Smith",
      "medicines": [
        {"name": "Aspirin 500mg", "quantity": 10},
        {"name": "Vitamin D3 1000IU", "quantity": 30},
        {"name": "Amoxicillin 250mg", "quantity": 10},
        {"name": "Paracetamol 500mg", "quantity": 15},
        {"name": "Omeprazole 20mg", "quantity": 10}
      ]
    },
    "userEmail": "patient@example.com",
    "address": "999 Medical Plaza, Los Angeles, CA 90001",
    "autoApprove": true,
    "preferredSite": "B"
  }'
```

---

## 📦 Track Orders

### Track Order from Site A
```bash
# Note: Replace SITE-A-1672896456789 with actual order ID from response
curl http://localhost:3000/api/mcv/track-order/SITE-A-1672896456789/A
```

### Track Order from Site B
```bash
curl http://localhost:3000/api/mcv/track-order/SITE-B-1672896456789/B
```

### Get Medicine Details from Site A
```bash
curl http://localhost:3000/api/mcv/medicine/a1/A
```

### Get Medicine Details from Site B
```bash
curl http://localhost:3000/api/mcv/medicine/b1/B
```

---

## 🏪 Direct Pharmacy Orders

### Order from Site A
```bash
curl -X POST http://localhost:3001/api/orders \
  -H "Content-Type: application/json" \
  -d '{
    "medicines": [
      {"medicineId": "a1", "quantity": 10},
      {"medicineId": "a4", "quantity": 15}
    ],
    "userEmail": "user@example.com",
    "address": "123 Test Street",
    "paymentMethod": "COD"
  }'
```

### Order from Site B
```bash
curl -X POST http://localhost:3002/api/orders \
  -H "Content-Type: application/json" \
  -d '{
    "medicines": [
      {"medicineId": "b1", "quantity": 10},
      {"medicineId": "b6", "quantity": 30}
    ],
    "userEmail": "user@example.com",
    "address": "123 Test Street",
    "paymentMethod": "COD"
  }'
```

---

## 🔄 Pharmacy API - Pricing Comparison

### Compare Pricing on Site A
```bash
curl -X POST http://localhost:3001/api/pricing/compare \
  -H "Content-Type: application/json" \
  -d '{
    "medicineNames": ["Aspirin 500mg", "Paracetamol 500mg"]
  }'
```

### Compare Pricing on Site B
```bash
curl -X POST http://localhost:3002/api/pricing/compare \
  -H "Content-Type: application/json" \
  -d '{
    "medicineNames": ["Aspirin 500mg", "Paracetamol 500mg", "Metformin 500mg"]
  }'
```

---

## 🚨 Error Cases to Test

### Medicine Not Found
```bash
curl http://localhost:3001/api/medicines/nonexistent
```

### Insufficient Stock
```bash
curl -X POST http://localhost:3001/api/orders \
  -H "Content-Type: application/json" \
  -d '{
    "medicines": [
      {"medicineId": "a1", "quantity": 999999}
    ],
    "userEmail": "user@example.com",
    "address": "123 Main St"
  }'
```

### Missing Required Fields
```bash
curl -X POST http://localhost:3000/api/mcv/compare-prices \
  -H "Content-Type: application/json" \
  -d '{
    "invalidField": "test"
  }'
```

### Invalid Site Letter (for approval)
```bash
curl -X POST http://localhost:3000/api/mcv/approve-order \
  -H "Content-Type: application/json" \
  -d '{
    "site": "C",
    "medicines": [],
    "userEmail": "user@example.com",
    "address": "123 Main St"
  }'
```

---

## 💡 Tips for Testing

1. **Copy one command at a time** and paste into terminal
2. **Replace order IDs** with actual IDs from previous responses
3. **Change user emails and addresses** for realistic testing
4. **Run health checks** first to verify servers are running
5. **Check console logs** in each server terminal for detailed logs
6. **Watch stock levels** decrease after placing orders

---

## 📊 Testing Flow Example

```
1. Health Checks
   ↓
2. Browse Medicines (GET /api/medicines)
   ↓
3. Compare Prices (POST /api/mcv/compare-prices)
   ↓
4. Get Test Prescription (GET /api/mcv/test-prescription)
   ↓
5. Process Prescription Semi-Auto (autoApprove: false)
   ↓
6. Approve Order (POST /api/mcv/approve-order)
   ↓
7. Track Order (GET /api/mcv/track-order)
```

---

Start with the health checks, then try the comparison endpoints!
