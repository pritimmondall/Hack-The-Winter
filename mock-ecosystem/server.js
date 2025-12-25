const express = require('express');
const bodyParser = require('body-parser');
const http = require('http');

const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(express.static('public'));

// Test data for demonstration
const testPrescription = {
  prescriptionId: 'RX-001',
  doctorName: 'Dr. Smith',
  medicines: [
    { name: 'Aspirin 500mg', quantity: 10 },
    { name: 'Vitamin D3 1000IU', quantity: 30 },
    { name: 'Paracetamol 500mg', quantity: 15 }
  ],
  date: new Date(),
  validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
};

// Helper function to call pharmacy APIs
async function callPharmacy(method, site, path, data = null) {
  const sitePort = site === 'A' ? 3001 : 3002;
  
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: sitePort,
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/json'
      }
    };
    
    const req = http.request(options, (res) => {
      let responseData = '';
      
      res.on('data', (chunk) => {
        responseData += chunk;
      });
      
      res.on('end', () => {
        try {
          resolve(JSON.parse(responseData));
        } catch (e) {
          resolve({ error: 'Failed to parse response', raw: responseData });
        }
      });
    });
    
    req.on('error', (error) => {
      reject(error);
    });
    
    if (data) {
      req.write(JSON.stringify(data));
    }
    req.end();
  });
}

// MCV Server Routes

// 1. Compare prices across pharmacies
app.post('/api/mcv/compare-prices', async (req, res) => {
  const { medicineNames } = req.body;
  
  if (!medicineNames || !Array.isArray(medicineNames)) {
    return res.status(400).json({
      success: false,
      message: 'Send medicineNames as array'
    });
  }
  
  try {
    console.log('\n🔍 MCV Server: Comparing prices across pharmacies...');
    
    const siteAResult = await callPharmacy('POST', 'A', '/api/pricing/compare', { medicineNames });
    const siteBResult = await callPharmacy('POST', 'B', '/api/pricing/compare', { medicineNames });
    
    const comparison = {
      searchedMedicines: medicineNames,
      siteA: siteAResult.data || [],
      siteB: siteBResult.data || [],
      timestamp: new Date()
    };
    
    // Find best prices
    const recommendations = medicineNames.map(name => {
      const priceA = siteAResult.data?.find(m => m.name === name);
      const priceB = siteBResult.data?.find(m => m.name === name);
      
      return {
        medicine: name,
        options: [priceA, priceB].filter(p => p.available),
        recommendation: determineBestOption(priceA, priceB)
      };
    });
    
    res.json({
      success: true,
      comparison,
      recommendations,
      message: 'Price comparison complete'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// 2. Process prescription - automatic order
app.post('/api/mcv/process-prescription', async (req, res) => {
  const { prescription, userEmail, address, autoApprove = false, preferredSite = null } = req.body;
  
  if (!prescription || !prescription.medicines || !userEmail || !address) {
    return res.status(400).json({
      success: false,
      message: 'Missing fields: prescription, userEmail, address'
    });
  }
  
  try {
    console.log('\n📋 MCV Server: Processing prescription...');
    console.log('Auto-Approve:', autoApprove ? 'YES' : 'NO (Manual Approval Required)');
    
    // Step 1: Get comparison
    const medicineNames = prescription.medicines.map(m => m.name);
    const comparisonResult = await callPharmacy('POST', 'A', '/api/pricing/compare', { medicineNames });
    const comparisonResultB = await callPharmacy('POST', 'B', '/api/pricing/compare', { medicineNames });
    
    // Step 2: Determine best site based on preference
    let selectedSite = preferredSite || 'A';
    let totalPrice = 0;
    let orderItems = [];
    
    const medicinesForOrder = await Promise.all(
      prescription.medicines.map(async (med) => {
        const siteAMed = await callPharmacy('GET', 'A', `/api/medicines/search/${med.name}`);
        const siteBMed = await callPharmacy('GET', 'B', `/api/medicines/search/${med.name}`);
        
        return {
          name: med.name,
          quantity: med.quantity,
          siteA: siteAMed.data?.[0],
          siteB: siteBMed.data?.[0]
        };
      })
    );
    
    // Step 3: Create order items
    for (const med of medicinesForOrder) {
      const targetSite = selectedSite === 'A' ? med.siteA : med.siteB;
      if (targetSite) {
        orderItems.push({
          medicineId: targetSite.id,
          medicineName: targetSite.name,
          quantity: med.quantity
        });
        totalPrice += targetSite.price * med.quantity;
      }
    }
    
    // Step 4: Prepare order details
    const orderData = {
      medicines: orderItems,
      userEmail,
      address,
      paymentMethod: 'COD'
    };
    
    // Return approval needed message if not auto-approved
    if (!autoApprove) {
      return res.json({
        success: true,
        status: 'PENDING_APPROVAL',
        orderPreview: {
          site: selectedSite === 'A' ? 'Site A (Premium)' : 'Site B (Budget)',
          medicines: orderItems,
          estimatedTotal: totalPrice,
          estimatedDelivery: selectedSite === 'A' ? '1-2 days' : '2-3 days'
        },
        message: 'Order ready for approval. Call /api/mcv/approve-order endpoint with orderId'
      });
    }
    
    // Place order if auto-approved
    const orderResult = await callPharmacy('POST', selectedSite === 'A' ? 'A' : 'B', '/api/orders', orderData);
    
    res.json({
      success: true,
      status: 'ORDER_PLACED',
      order: orderResult.data,
      message: 'Order placed automatically'
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// 3. Manual order approval
app.post('/api/mcv/approve-order', async (req, res) => {
  const { site, medicines, userEmail, address } = req.body;
  
  if (!site || !medicines || !userEmail || !address) {
    return res.status(400).json({
      success: false,
      message: 'Missing required fields'
    });
  }
  
  try {
    console.log(`\n✅ MCV Server: Approving order on Site ${site.toUpperCase()}...`);
    
    const orderData = {
      medicines: medicines,
      userEmail,
      address,
      paymentMethod: 'COD'
    };
    
    const orderResult = await callPharmacy('POST', site, '/api/orders', orderData);
    
    res.json({
      success: true,
      status: 'ORDER_PLACED',
      order: orderResult.data,
      message: 'Order approved and placed'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// 4. Track order
app.get('/api/mcv/track-order/:orderId/:site', async (req, res) => {
  const { orderId, site } = req.params;
  
  try {
    const trackingResult = await callPharmacy('GET', site, `/api/orders/${orderId}`);
    
    res.json({
      success: true,
      data: trackingResult.data,
      message: 'Order tracking info'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// 5. Get medicine details
app.get('/api/mcv/medicine/:id/:site', async (req, res) => {
  const { id, site } = req.params;
  
  try {
    const medicineResult = await callPharmacy('GET', site, `/api/medicines/${id}`);
    
    res.json({
      success: true,
      data: medicineResult.data,
      message: 'Medicine details'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Demonstration endpoint
app.get('/api/mcv/test-prescription', (req, res) => {
  res.json({
    success: true,
    prescription: testPrescription,
    message: 'Sample prescription for testing'
  });
});

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'alive',
    server: 'MCV Orchestrator',
    port: PORT,
    pharmacies: [
      { name: 'Site A (Premium)', url: 'http://localhost:3001' },
      { name: 'Site B (Budget)', url: 'http://localhost:3002' }
    ]
  });
});

app.listen(PORT, () => {
  console.log(`\n🏥 MCV Server running on http://localhost:${PORT}`);
  console.log('\nEndpoints:');
  console.log('  POST /api/mcv/compare-prices - Compare medicine prices');
  console.log('  POST /api/mcv/process-prescription - Process prescription');
  console.log('  POST /api/mcv/approve-order - Approve pending order');
  console.log('  GET  /api/mcv/track-order/:orderId/:site - Track order');
  console.log('  GET  /api/mcv/medicine/:id/:site - Get medicine details');
  console.log('  GET  /api/mcv/test-prescription - Get sample prescription\n');
});
