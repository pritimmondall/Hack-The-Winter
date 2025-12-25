# 📖 MCV System - Documentation Index

Welcome! This is your quick guide to all the documentation files in the mock pharmacy ecosystem.

---

## 🚀 Getting Started (Start Here!)

### For Quick Setup
👉 **[FINAL_SUMMARY.md](FINAL_SUMMARY.md)** - 5-minute overview
- Quick setup steps
- What you have
- Basic testing workflow

### For Complete Setup
👉 **[README.md](README.md)** - Full guide
- Architecture overview
- Complete installation
- All features explained
- Next steps for production

---

## 📚 API Documentation

### Quick Reference
👉 **[API_REFERENCE.md](API_REFERENCE.md)** - All endpoints at a glance
- MCV Server endpoints
- Pharmacy APIs
- Response formats
- Medicine IDs

### Real Examples
👉 **[EXAMPLE_REQUESTS.md](EXAMPLE_REQUESTS.md)** - Copy-paste curl commands
- Health checks
- Pharmacy exploration
- Price comparisons
- Order workflows
- Error cases
- Testing tips

---

## 🧪 Testing

### Test Scenarios
👉 **[TESTING_GUIDE.md](TESTING_GUIDE.md)** - Detailed test cases
- 7 complete test scenarios
- Expected outputs
- Price comparison data
- Common requests
- Debugging tips

---

## 🏗️ System Design

### Architecture & Flow
👉 **[ARCHITECTURE.md](ARCHITECTURE.md)** - System diagrams and flows
- Architecture diagram
- User journey flows
- Data flow between servers
- Decision logic
- Error handling
- Integration points
- Key statistics

---

## 📁 File Structure

```
mock-ecosystem/
├── 📄 Index Files:
│   ├── INDEX.md (you are here)
│   ├── FINAL_SUMMARY.md ⭐ START HERE
│   ├── README.md
│   ├── SETUP_COMPLETE.md
│
├── 📋 API & Testing:
│   ├── API_REFERENCE.md
│   ├── EXAMPLE_REQUESTS.md
│   ├── TESTING_GUIDE.md
│
├── 📐 Architecture:
│   ├── ARCHITECTURE.md
│
├── 🖥️ Servers:
│   ├── server.js (MCV Server)
│   ├── site-a/server.js (Premium Pharmacy)
│   └── site-b/server.js (Budget Pharmacy)
│
└── 🔧 Configuration:
    ├── package.json
    ├── start-all.bat
    └── site-a/package.json
    └── site-b/package.json
```

---

## 🎯 Quick Navigation by Use Case

### "I want to start the servers immediately"
1. Go to → [FINAL_SUMMARY.md](FINAL_SUMMARY.md) (Quick Start section)
2. Or just run → `start-all.bat`

### "I want to test the API"
1. Go to → [EXAMPLE_REQUESTS.md](EXAMPLE_REQUESTS.md)
2. Copy-paste any curl command
3. Modify with your data
4. Run in terminal

### "I want to understand the system"
1. Read → [ARCHITECTURE.md](ARCHITECTURE.md) (Start with diagrams)
2. Then → [README.md](README.md) (Full explanation)
3. Reference → [API_REFERENCE.md](API_REFERENCE.md) (For details)

### "I want to run complete tests"
1. Start servers (see FINAL_SUMMARY.md)
2. Follow → [TESTING_GUIDE.md](TESTING_GUIDE.md)
3. Use → [EXAMPLE_REQUESTS.md](EXAMPLE_REQUESTS.md) for actual commands

### "I want to integrate with my code"
1. Study → [ARCHITECTURE.md](ARCHITECTURE.md) (Understand flow)
2. Reference → [API_REFERENCE.md](API_REFERENCE.md) (Endpoint details)
3. Check → [EXAMPLE_REQUESTS.md](EXAMPLE_REQUESTS.md) (Request/Response)

### "I want to know what's next"
1. Read → [README.md](README.md) (Future Enhancements section)
2. Or → [FINAL_SUMMARY.md](FINAL_SUMMARY.md) (Next Features section)

---

## 📝 Document Descriptions

| Document | Purpose | Length | Read When |
|----------|---------|--------|-----------|
| **FINAL_SUMMARY.md** | Quick overview of everything | 5 min | First! |
| **README.md** | Complete documentation | 15 min | Need full details |
| **API_REFERENCE.md** | All endpoints reference | 5 min | Building integration |
| **EXAMPLE_REQUESTS.md** | Copy-paste curl commands | 10 min | Testing APIs |
| **TESTING_GUIDE.md** | Detailed test scenarios | 20 min | QA/thorough testing |
| **ARCHITECTURE.md** | System design & flows | 10 min | Understanding design |
| **SETUP_COMPLETE.md** | Setup confirmation | 5 min | Verification |
| **INDEX.md** | This file | 3 min | Navigation |

---

## 🔧 Server Information

### MCV Server (Port 3000)
- **File:** `server.js`
- **Purpose:** Orchestrator/Hub for prescription processing
- **Key Functions:**
  - Compare prices
  - Process prescriptions
  - Manage approvals
  - Track orders

### Site A - Premium Store (Port 3001)
- **File:** `site-a/server.js`
- **Characteristics:** Fast delivery, higher price, excellent quality
- **Best for:** Speed and quality seekers
- **Medicines:** 5 types with high ratings

### Site B - Budget Store (Port 3002)
- **File:** `site-b/server.js`
- **Characteristics:** Standard delivery, lower price, good quality
- **Best for:** Budget-conscious buyers
- **Medicines:** 6 types (includes Metformin)

---

## 🚀 Quick Start Commands

```bash
# Navigate to project
cd c:\Users\User\OneDrive\Desktop\Hack-The-Winter\mock-ecosystem

# Option 1: Start all servers (automatic)
start-all.bat

# Option 2: Manual start - Terminal 1
cd site-a && npm start

# Option 2: Manual start - Terminal 2
cd site-b && npm start

# Option 2: Manual start - Terminal 3
npm start

# Test that servers are running
curl http://localhost:3000/health
curl http://localhost:3001/health
curl http://localhost:3002/health
```

---

## 🆘 Troubleshooting

### Port Already in Use?
Edit the PORT variable in `server.js`, `site-a/server.js`, or `site-b/server.js`

### Dependencies Not Installed?
```bash
cd site-a && npm install
cd ../site-b && npm install
cd .. && npm install
```

### CORS Issues?
All servers have CORS enabled. Check server console logs.

### Connection Refused?
Verify all 3 servers are running on correct ports (3000, 3001, 3002)

---

## 💡 Key Features Summary

✅ **Price Comparison** - Compare across pharmacies
✅ **Prescription Processing** - Auto/manual workflows
✅ **Order Management** - Place, track, manage orders
✅ **Stock Management** - Real inventory tracking
✅ **Error Handling** - Proper HTTP codes and messages
✅ **CORS Support** - Cross-origin requests enabled
✅ **Mock Data** - Realistic medicines and pricing
✅ **Multiple Sites** - Test with different strategies

---

## 📊 What You Get

```
✓ 3 Fully functional Node.js/Express servers
✓ 11 medicines across 2 sites
✓ Automatic order placement & tracking
✓ Semi-automatic approval workflow
✓ Full automatic mode
✓ Real-time stock management
✓ Complete API documentation
✓ Testing guide with scenarios
✓ Example curl commands
✓ Architecture diagrams
✓ Production-ready code
```

---

## 🎯 Your Next Steps

1. **Read** → [FINAL_SUMMARY.md](FINAL_SUMMARY.md)
2. **Start** → Run `start-all.bat`
3. **Test** → Use [EXAMPLE_REQUESTS.md](EXAMPLE_REQUESTS.md)
4. **Verify** → Follow [TESTING_GUIDE.md](TESTING_GUIDE.md)
5. **Integrate** → Reference [API_REFERENCE.md](API_REFERENCE.md)
6. **Build** → Add features mentioned in [README.md](README.md)

---

## 📞 Quick Reference

| Need | Document |
|------|----------|
| Quick start | [FINAL_SUMMARY.md](FINAL_SUMMARY.md) |
| All endpoints | [API_REFERENCE.md](API_REFERENCE.md) |
| Test commands | [EXAMPLE_REQUESTS.md](EXAMPLE_REQUESTS.md) |
| Test scenarios | [TESTING_GUIDE.md](TESTING_GUIDE.md) |
| Architecture | [ARCHITECTURE.md](ARCHITECTURE.md) |
| Full guide | [README.md](README.md) |

---

## 🎉 You're Ready!

Everything is set up and documented. Just start the servers and begin testing!

**Happy Building!** 🚀

---

**Last Updated:** 2025-12-25
**MCV System Version:** 1.0 - Mock Ecosystem
**Status:** ✅ Ready for Testing
