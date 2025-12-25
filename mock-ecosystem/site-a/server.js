const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = 3001;

app.use(bodyParser.json());
app.use(cors());

// Mock Medicine Database for Site A - Premium Quality, Higher Price
const medicines = [
  {
    id: 'a1',
    name: 'Aspirin 500mg',
    price: 250,
    quantity: 10,
    deliveryDays: 1,
    rating: 4.8,
    manufacturer: 'PharmaCorp A',
    description: 'High-quality pain reliever and anti-inflammatory',
    stock: 150,
    category: 'Pain Relief'
  },
  {
    id: 'a2',
    name: 'Vitamin D3 1000IU',
    price: 180,
    quantity: 30,
    deliveryDays: 1,
    rating: 4.9,
    manufacturer: 'NutriCare A',
    description: 'Premium vitamin D supplement',
    stock: 200,
    category: 'Vitamins'
  },
  {
    id: 'a3',
    name: 'Amoxicillin 250mg',
    price: 120,
    quantity: 10,
    deliveryDays: 2,
    rating: 4.7,
    manufacturer: 'AntiBiotics A',
    description: 'Antibiotic for bacterial infections',
    stock: 100,
    category: 'Antibiotics'
  },
  {
    id: 'a4',
    name: 'Paracetamol 500mg',
    price: 80,
    quantity: 15,
    deliveryDays: 1,
    rating: 4.6,
    manufacturer: 'FeverCare A',
    description: 'Effective fever and pain management',
    stock: 250,
    category: 'Pain Relief'
  },
  {
    id: 'a5',
    name: 'Omeprazole 20mg',
    price: 200,
    quantity: 10,
    deliveryDays: 2,
    rating: 4.5,
    manufacturer: 'GastroWell A',
    description: 'Acid reflux and gastric ulcer treatment',
    stock: 80,
    category: 'Gastro'
  }
];

// Mock Orders Storage
const orders = [];

// API: Get all medicines
app.get('/api/medicines', (req, res) => {
  res.json({
    success: true,
    site: 'Site A - Premium Quality',
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
    site: 'Site A',
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
      site: 'Site A'
    });
  }
  
  res.json({
    success: true,
    site: 'Site A',
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
      site: 'Site A'
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
        site: 'Site A'
      });
    }
    
    if (medicine.stock < item.quantity) {
      return res.status(400).json({
        success: false,
        message: `Insufficient stock for ${medicine.name}. Available: ${medicine.stock}`,
        site: 'Site A'
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
  
  const orderId = `SITE-A-${Date.now()}`;
  const order = {
    orderId,
    siteA: true,
    orderDate: new Date(),
    medicines: orderDetails,
    totalPrice,
    userEmail,
    address,
    paymentMethod: paymentMethod || 'COD',
    status: 'confirmed',
    estimatedDelivery: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // 1 day default
    trackingId: `TRK-${Math.random().toString(36).substr(2, 9).toUpperCase()}`
  };
  
  orders.push(order);
  
  res.json({
    success: true,
    site: 'Site A - Premium Quality',
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
      site: 'Site A'
    });
  }
  
  res.json({
    success: true,
    site: 'Site A',
    data: order
  });
});

// API: Get all orders
app.get('/api/orders', (req, res) => {
  res.json({
    success: true,
    site: 'Site A',
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
      site: 'Site A'
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
    site: 'Site A - Premium & Faster',
    data: pricing
  });
});

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'alive',
    site: 'Site A - Medical Store',
    port: PORT,
    timestamp: new Date()
  });
});

app.listen(PORT, () => {
  console.log(`\n🏥 Site A (Premium Quality Store) running on http://localhost:${PORT}`);
  console.log('Endpoints: /api/medicines, /api/medicines/:id, /api/orders, /health\n');
});
