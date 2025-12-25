const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = 3002;

app.use(bodyParser.json());
app.use(cors());

// Mock Medicine Database for Site B - Budget Friendly, Slower Delivery
const medicines = [
  {
    id: 'b1',
    name: 'Aspirin 500mg',
    price: 180,
    quantity: 10,
    deliveryDays: 3,
    rating: 4.3,
    manufacturer: 'BudgetMed B',
    description: 'Affordable pain reliever',
    stock: 300,
    category: 'Pain Relief'
  },
  {
    id: 'b2',
    name: 'Vitamin D3 1000IU',
    price: 120,
    quantity: 30,
    deliveryDays: 2,
    rating: 4.1,
    manufacturer: 'HealthPlus B',
    description: 'Affordable vitamin D supplement',
    stock: 400,
    category: 'Vitamins'
  },
  {
    id: 'b3',
    name: 'Amoxicillin 250mg',
    price: 85,
    quantity: 10,
    deliveryDays: 3,
    rating: 4.2,
    manufacturer: 'GenericMeds B',
    description: 'Generic antibiotic for bacterial infections',
    stock: 250,
    category: 'Antibiotics'
  },
  {
    id: 'b4',
    name: 'Paracetamol 500mg',
    price: 50,
    quantity: 15,
    deliveryDays: 2,
    rating: 4.0,
    manufacturer: 'ValuePack B',
    description: 'Budget fever and pain management',
    stock: 500,
    category: 'Pain Relief'
  },
  {
    id: 'b5',
    name: 'Omeprazole 20mg',
    price: 140,
    quantity: 10,
    deliveryDays: 3,
    rating: 4.4,
    manufacturer: 'HealthGain B',
    description: 'Cost-effective acid reflux treatment',
    stock: 150,
    category: 'Gastro'
  },
  {
    id: 'b6',
    name: 'Metformin 500mg',
    price: 95,
    quantity: 30,
    deliveryDays: 2,
    rating: 4.2,
    manufacturer: 'DiabetesControl B',
    description: 'Diabetes management medicine',
    stock: 200,
    category: 'Endocrine'
  }
];

// Mock Orders Storage
const orders = [];

// API: Get all medicines
app.get('/api/medicines', (req, res) => {
  res.json({
    success: true,
    site: 'Site B - Budget Friendly',
    data: medicines,
    timestamp: new Date()
  });
});

// API: Search medicines by name
app.get('/api/medicines/search/:name', (req, res) => {
  const { name } = req.params;
  const results = medicines.filter(m => 
    m.name.toLowerCase().includes(name.toLowerCase()) ||
    m.category.toLowerCase().includes(name.toLowerCase())
  );
  
  res.json({
    success: true,
    site: 'Site B',
    query: name,
    data: results,
    count: results.length
  });
});

// API: Get medicine by ID
app.get('/api/medicines/:id', (req, res) => {
  const { id } = req.params;
  const medicine = medicines.find(m => m.id === id);
  
  if (!medicine) {
    return res.status(404).json({
      success: false,
      message: 'Medicine not found',
      site: 'Site B'
    });
  }
  
  res.json({
    success: true,
    site: 'Site B',
    data: medicine
  });
});

// API: Create order
app.post('/api/orders', (req, res) => {
  const { medicines: orderMedicines, userEmail, address, paymentMethod } = req.body;
  
  if (!orderMedicines || !userEmail || !address) {
    return res.status(400).json({
      success: false,
      message: 'Missing required fields: medicines, userEmail, address',
      site: 'Site B'
    });
  }
  
  // Calculate total and check stock
  let totalPrice = 0;
  const orderDetails = [];
  
  for (const item of orderMedicines) {
    const medicine = medicines.find(m => m.id === item.medicineId);
    if (!medicine) {
      return res.status(404).json({
        success: false,
        message: `Medicine ${item.medicineId} not found`,
        site: 'Site B'
      });
    }
    
    if (medicine.stock < item.quantity) {
      return res.status(400).json({
        success: false,
        message: `Insufficient stock for ${medicine.name}. Available: ${medicine.stock}`,
        site: 'Site B'
      });
    }
    
    const itemTotal = medicine.price * item.quantity;
    totalPrice += itemTotal;
    orderDetails.push({
      medicineId: item.medicineId,
      medicineName: medicine.name,
      quantity: item.quantity,
      unitPrice: medicine.price,
      subtotal: itemTotal
    });
    
    // Reduce stock
    medicine.stock -= item.quantity;
  }
  
  const orderId = `SITE-B-${Date.now()}`;
  const order = {
    orderId,
    siteB: true,
    orderDate: new Date(),
    medicines: orderDetails,
    totalPrice,
    userEmail,
    address,
    paymentMethod: paymentMethod || 'COD',
    status: 'confirmed',
    estimatedDelivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days default
    trackingId: `TRK-${Math.random().toString(36).substr(2, 9).toUpperCase()}`
  };
  
  orders.push(order);
  
  res.json({
    success: true,
    site: 'Site B - Budget Friendly',
    message: 'Order placed successfully',
    data: order
  });
});

// API: Get order status
app.get('/api/orders/:orderId', (req, res) => {
  const { orderId } = req.params;
  const order = orders.find(o => o.orderId === orderId);
  
  if (!order) {
    return res.status(404).json({
      success: false,
      message: 'Order not found',
      site: 'Site B'
    });
  }
  
  res.json({
    success: true,
    site: 'Site B',
    data: order
  });
});

// API: Get all orders
app.get('/api/orders', (req, res) => {
  res.json({
    success: true,
    site: 'Site B',
    totalOrders: orders.length,
    data: orders
  });
});

// API: Get pricing info for MCV comparison
app.post('/api/pricing/compare', (req, res) => {
  const { medicineNames } = req.body;
  
  if (!medicineNames || !Array.isArray(medicineNames)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid request. Send medicineNames as array',
      site: 'Site B'
    });
  }
  
  const pricing = medicineNames.map(name => {
    const medicine = medicines.find(m => 
      m.name.toLowerCase() === name.toLowerCase()
    );
    return {
      name,
      available: !!medicine,
      price: medicine ? medicine.price : null,
      deliveryDays: medicine ? medicine.deliveryDays : null,
      rating: medicine ? medicine.rating : null,
      stock: medicine ? medicine.stock : 0
    };
  });
  
  res.json({
    success: true,
    site: 'Site B - Budget & More Inventory',
    data: pricing
  });
});

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'alive',
    site: 'Site B - Medical Store',
    port: PORT,
    timestamp: new Date()
  });
});

app.listen(PORT, () => {
  console.log(`\n💊 Site B (Budget Friendly Store) running on http://localhost:${PORT}`);
  console.log('Endpoints: /api/medicines, /api/medicines/:id, /api/orders, /health\n');
});
