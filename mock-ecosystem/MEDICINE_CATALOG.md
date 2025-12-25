# 💊 Medicine Catalog & IDs

Quick reference for all medicines available in the mock pharmacy ecosystem.

---

## Site A - Premium Quality Store (Port 3001)

### Medicine Inventory

| ID | Medicine Name | Strength | Price | Delivery | Rating | Stock | Category |
|----|--------------|----------|-------|----------|--------|-------|----------|
| a1 | Aspirin | 500mg | ₹250 | 1 day | 4.8 ⭐ | 150 | Pain Relief |
| a2 | Vitamin D3 | 1000IU | ₹180 | 1 day | 4.9 ⭐ | 200 | Vitamins |
| a3 | Amoxicillin | 250mg | ₹120 | 2 days | 4.7 ⭐ | 100 | Antibiotics |
| a4 | Paracetamol | 500mg | ₹80 | 1 day | 4.6 ⭐ | 250 | Pain Relief |
| a5 | Omeprazole | 20mg | ₹200 | 2 days | 4.5 ⭐ | 80 | Gastro |

**Site A Characteristics:**
- Premium quality medicines
- Fast delivery (1-2 days)
- Higher prices
- Best quality ratings (4.5-4.9)
- Good for urgent needs

---

## Site B - Budget Friendly Store (Port 3002)

### Medicine Inventory

| ID | Medicine Name | Strength | Price | Delivery | Rating | Stock | Category |
|----|--------------|----------|-------|----------|--------|-------|----------|
| b1 | Aspirin | 500mg | ₹180 | 3 days | 4.3 ⭐ | 300 | Pain Relief |
| b2 | Vitamin D3 | 1000IU | ₹120 | 2 days | 4.1 ⭐ | 400 | Vitamins |
| b3 | Amoxicillin | 250mg | ₹85 | 3 days | 4.2 ⭐ | 250 | Antibiotics |
| b4 | Paracetamol | 500mg | ₹50 | 2 days | 4.0 ⭐ | 500 | Pain Relief |
| b5 | Omeprazole | 20mg | ₹140 | 3 days | 4.4 ⭐ | 150 | Gastro |
| b6 | Metformin | 500mg | ₹95 | 2 days | 4.2 ⭐ | 200 | Endocrine |

**Site B Characteristics:**
- Budget-friendly medicines
- Standard delivery (2-3 days)
- Lower prices (save 20-38%)
- Good quality ratings (4.0-4.4)
- Best for cost-conscious buyers
- More medicines available

---

## 💰 Price Comparison

### Which site is cheaper?

| Medicine | Site A | Site B | Savings | % Off |
|----------|--------|--------|---------|-------|
| Aspirin 500mg | ₹250 | ₹180 | ₹70 | 28% |
| Vitamin D3 1000IU | ₹180 | ₹120 | ₹60 | 33% |
| Amoxicillin 250mg | ₹120 | ₹85 | ₹35 | 29% |
| Paracetamol 500mg | ₹80 | ₹50 | ₹30 | 37% |
| Omeprazole 20mg | ₹200 | ₹140 | ₹60 | 30% |
| **Average Savings** | - | - | **₹51** | **32%** |

**Result:** Site B is consistently 28-37% cheaper! 💰

---

## ⏱️ Delivery Time Comparison

| Medicine | Site A | Site B | Faster By |
|----------|--------|--------|-----------|
| Aspirin | 1 day | 3 days | Site A (2 days) |
| Vitamin D3 | 1 day | 2 days | Site A (1 day) |
| Amoxicillin | 2 days | 3 days | Site A (1 day) |
| Paracetamol | 1 day | 2 days | Site A (1 day) |
| Omeprazole | 2 days | 3 days | Site A (1 day) |

**Result:** Site A delivers 1-2 days faster! ⚡

---

## ⭐ Quality Ratings

### Average Ratings by Site

| Metric | Site A | Site B |
|--------|--------|--------|
| Lowest Rating | 4.5 | 4.0 |
| Highest Rating | 4.9 | 4.4 |
| Average Rating | 4.7 | 4.2 |

**Result:** Site A has better quality ratings! ✨

---

## 📦 Stock Availability

### Total Stock by Site

| Medicine | Site A | Site B | Total |
|----------|--------|--------|-------|
| Aspirin | 150 | 300 | 450 |
| Vitamin D3 | 200 | 400 | 600 |
| Amoxicillin | 100 | 250 | 350 |
| Paracetamol | 250 | 500 | 750 |
| Omeprazole | 80 | 150 | 230 |
| Metformin | - | 200 | 200 |
| **Total** | **780** | **1,800** | **2,580** |

**Result:** Site B has more stock available! 📦

---

## 🔤 Medicine Categories

### By Category

| Category | Site A | Site B | Medicines |
|----------|--------|--------|-----------|
| Pain Relief | 2 | 2 | Aspirin, Paracetamol |
| Vitamins | 1 | 1 | Vitamin D3 |
| Antibiotics | 1 | 1 | Amoxicillin |
| Gastro | 1 | 1 | Omeprazole |
| Endocrine | - | 1 | Metformin |
| **Total** | **5** | **6** | **11** |

---

## 🛒 Sample Cart Scenarios

### Scenario 1: Budget Conscious
```
Order: Paracetamol (15 units)
Site A: ₹80 × 15 = ₹1,200
Site B: ₹50 × 15 = ₹750
SAVINGS: ₹450 (37.5%)
Choose: Site B ✓
```

### Scenario 2: Speed Priority
```
Order: Aspirin (10 units)
Site A: 1 day delivery
Site B: 3 days delivery
Choose: Site A ✓
```

### Scenario 3: Balanced Choice
```
Order: Multiple medicines
Total Site A: ₹950 (1-2 days, 4.7★)
Total Site B: ₹680 (2-3 days, 4.2★)
Save 28% with Site B
Or Get 1-2 days faster with Site A
Choose: Depends on priority ✓
```

### Scenario 4: Exclusive Medicine
```
Order: Metformin 500mg
Available: Site B only (₹95)
Site A: Not available ✗
Choose: Site B ✓
```

---

## 🔗 Using Medicine IDs

### In API Requests

When placing orders, use the medicine ID:

**Example - Site A Order:**
```json
{
  "medicines": [
    {"medicineId": "a1", "quantity": 10},
    {"medicineId": "a4", "quantity": 15}
  ]
}
```

**Example - Site B Order:**
```json
{
  "medicines": [
    {"medicineId": "b1", "quantity": 10},
    {"medicineId": "b6", "quantity": 30}
  ]
}
```

---

## 📞 Quick Reference

### Get Medicine Details

**By ID:**
```bash
curl http://localhost:3001/api/medicines/a1      # Get Aspirin from Site A
curl http://localhost:3002/api/medicines/b6      # Get Metformin from Site B
```

**By Search:**
```bash
curl http://localhost:3001/api/medicines/search/Vitamin
curl http://localhost:3002/api/medicines/search/Aspirin
```

**All Medicines:**
```bash
curl http://localhost:3001/api/medicines          # All Site A medicines
curl http://localhost:3002/api/medicines          # All Site B medicines
```

---

## 💡 Recommendations

### For Maximum Savings (Budget)
→ Choose **Site B** for all medicines
- Average 32% cheaper
- Good quality (4.0-4.4★)
- More stock available
- Slightly slower delivery (2-3 days)

### For Maximum Speed (Urgent)
→ Choose **Site A** for all medicines
- 1-2 day delivery
- Best quality (4.5-4.9★)
- Higher price but premium quality
- Lower stock

### For Balanced Choice (Recommended)
→ Mix both sites
- Aspirin: Site B (₹70 cheaper)
- Pain Relief: Site B (₹30 cheaper)
- Antibiotics: Site B (₹35 cheaper)
- Gastro: Site B (₹60 cheaper)
- Vitamins: Site B (₹60 cheaper)
- Metformin: Site B (exclusive)
- **Average savings with mix: 32%**

---

## 📊 Quick Facts

```
Total Medicines: 11
Unique Medicines: 5 (available at both sites)
Exclusive to Site A: 0
Exclusive to Site B: 1 (Metformin)

Price Range:
  Lowest: ₹50 (Paracetamol, Site B)
  Highest: ₹250 (Aspirin, Site A)

Delivery Range:
  Fastest: 1 day (Site A)
  Slowest: 3 days (Site B)

Quality Range:
  Best: 4.9★ (Vitamin D3, Site A)
  Good: 4.0★ (Paracetamol, Site B)

Stock Range:
  Highest: 500 units (Paracetamol, Site B)
  Lowest: 80 units (Omeprazole, Site A)

Total Stock: 2,580 units across both sites
```

---

## 🎯 Usage Tips

1. **Use medicine IDs** in API requests for precise ordering
2. **Compare both sites** for best prices
3. **Check stock levels** before ordering large quantities
4. **Plan ahead** if you need faster delivery
5. **Mix and match** pharmacies for best overall value

---

**Last Updated:** 2025-12-25
**Version:** 1.0 - Mock Ecosystem
