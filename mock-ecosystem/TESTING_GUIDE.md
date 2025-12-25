# Testing Guide for MCV Server with Mock Pharmacies

## Test Scenarios

### Scenario 1: Price Comparison
**Goal**: Verify MCV can compare prices across multiple pharmacy sites

**Steps:**
1. Start all three servers (Site A, Site B, MCV)
2. Make request to compare prices:
```bash
curl -X POST http://localhost:3000/api/mcv/compare-prices \
  -H "Content-Type: application/json" \
  -d '{
    "medicineNames": ["Aspirin 500mg", "Paracetamol 500mg", "Vitamin D3 1000IU"]
  }'
```

**Expected Output:**
- Site A prices should be higher
- Site B prices should be lower
- Both sites should have recommendation
- Aspirin: Site B recommended (₹180 vs ₹250)
- Paracetamol: Site B recommended (₹50 vs ₹80)

---

### Scenario 2: Semi-Automatic Prescription Processing
**Goal**: Test approval workflow

**Steps:**
1. Get prescription:
```bash
curl http://localhost:3000/api/mcv/test-prescription
```

2. Process prescription without auto-approval:
```bash
curl -X POST http://localhost:3000/api/mcv/process-prescription \
  -H "Content-Type: application/json" \
  -d '{
    "prescription": {
      "prescriptionId": "RX-001",
      "medicines": [
        {"name": "Aspirin 500mg", "quantity": 10},
        {"name": "Vitamin D3 1000IU", "quantity": 30},
        {"name": "Paracetamol 500mg", "quantity": 15}
      ]
    },
    "userEmail": "john@example.com",
    "address": "123 Main Street, New York",
    "autoApprove": false
  }'
```

**Expected Output:**
- Response status: `PENDING_APPROVAL`
- Order preview showing:
  - Selected site (Site A or B)
  - Medicine list
  - Estimated total price
  - Estimated delivery date

**Then approve:**
```bash
curl -X POST http://localhost:3000/api/mcv/approve-order \
  -H "Content-Type: application/json" \
  -d '{
    "site": "A",
    "medicines": [
      {"medicineId": "a1", "quantity": 10},
      {"medicineId": "a2", "quantity": 30},
      {"medicineId": "a4", "quantity": 15}
    ],
    "userEmail": "john@example.com",
    "address": "123 Main Street, New York"
  }'
```

**Expected Output:**
- Order placed successfully
- OrderID returned (e.g., `SITE-A-1672896456789`)
- Status: `confirmed`
- Tracking ID provided

---

### Scenario 3: Fully Automatic Prescription Processing
**Goal**: Test automatic order placement

**Steps:**
```bash
curl -X POST http://localhost:3000/api/mcv/process-prescription \
  -H "Content-Type: application/json" \
  -d '{
    "prescription": {
      "prescriptionId": "RX-002",
      "medicines": [
        {"name": "Amoxicillin 250mg", "quantity": 10}
      ]
    },
    "userEmail": "jane@example.com",
    "address": "456 Oak Avenue, Boston",
    "autoApprove": true,
    "preferredSite": "B"
  }'
```

**Expected Output:**
- Order placed immediately
- Status: `ORDER_PLACED`
- Order ID and tracking details

---

### Scenario 4: Track Order
**Goal**: Track order status across pharmacies

**Steps:**
1. Place an order and note the OrderID
2. Track using:
```bash
curl http://localhost:3000/api/mcv/track-order/SITE-A-[YourOrderID]/A
```

**Expected Output:**
- Order details
- Current status
- Estimated delivery date
- Tracking ID

---

### Scenario 5: Insufficient Stock Test
**Goal**: Verify error handling when medicine not available

**Steps:**
```bash
curl -X POST http://localhost:3001/api/orders \
  -H "Content-Type: application/json" \
  -d '{
    "medicines": [
      {"medicineId": "a1", "quantity": 999}
    ],
    "userEmail": "test@example.com",
    "address": "Test Address"
  }'
```

**Expected Output:**
- Error message about insufficient stock
- Available quantity shown
- Order not placed

---

### Scenario 6: Medicine Not Found
**Goal**: Test error handling for unavailable medicine

**Steps:**
```bash
curl http://localhost:3001/api/medicines/nonexistent
```

**Expected Output:**
- 404 error
- Message: "Medicine not found"

---

### Scenario 7: Search Functionality
**Goal**: Test medicine search across sites

**Site A Search:**
```bash
curl http://localhost:3001/api/medicines/search/Vitamin
```

**Site B Search:**
```bash
curl http://localhost:3002/api/medicines/search/Aspirin
```

**Expected Output:**
- Matching medicines listed
- Count of results shown
- Complete medicine details

---

## Price Comparison Data

### Before Any Orders
**Aspirin 500mg:**
| Site | Price | Delivery | Rating | Stock |
|------|-------|----------|--------|-------|
| A    | ₹250  | 1 day    | 4.8    | 150   |
| B    | ₹180  | 3 days   | 4.3    | 300   |

**Paracetamol 500mg:**
| Site | Price | Delivery | Rating | Stock |
|------|-------|----------|--------|-------|
| A    | ₹80   | 1 day    | 4.6    | 250   |
| B    | ₹50   | 2 days   | 4.0    | 500   |

**Vitamin D3 1000IU:**
| Site | Price | Delivery | Rating | Stock |
|------|-------|----------|--------|-------|
| A    | ₹180  | 1 day    | 4.9    | 200   |
| B    | ₹120  | 2 days   | 4.1    | 400   |

---

## Common Requests for Testing

### Request 1: Simple Price Check
```json
{
  "medicineNames": ["Paracetamol 500mg"]
}
```

### Request 2: Complex Prescription
```json
{
  "prescription": {
    "prescriptionId": "RX-TEST",
    "medicines": [
      {"name": "Aspirin 500mg", "quantity": 10},
      {"name": "Amoxicillin 250mg", "quantity": 10},
      {"name": "Omeprazole 20mg", "quantity": 10}
    ]
  },
  "userEmail": "test@example.com",
  "address": "Test Address"
}
```

### Request 3: Manual Approval
```json
{
  "site": "B",
  "medicines": [
    {"medicineId": "b1", "quantity": 5},
    {"medicineId": "b4", "quantity": 20}
  ],
  "userEmail": "test@example.com",
  "address": "123 Test St"
}
```

---

## Debugging Tips

1. **Check if servers are running:**
   ```bash
   curl http://localhost:3000/health
   curl http://localhost:3001/health
   curl http://localhost:3002/health
   ```

2. **View console logs** in each terminal to see request flow

3. **Test individual pharmacy APIs** before testing MCV integration

4. **Use Postman** for easier API testing with saved requests

5. **Check network connectivity** between servers

---

## Expected Behavior Summary

| Feature | Expected Behavior |
|---------|-------------------|
| Price Comparison | Compares both sites, recommends cheaper/faster option |
| Automatic Order | Places order immediately if auto-approved |
| Manual Approval | Waits for user confirmation before ordering |
| Stock Check | Rejects if sufficient stock unavailable |
| Delivery Time | Site A (1 day), Site B (2-3 days) |
| Error Handling | Proper error messages with HTTP status codes |
| Order Tracking | Returns complete order details with tracking ID |

