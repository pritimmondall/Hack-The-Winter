const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const path = require('path');

const app = express();
const PORT = 3002;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// ==================== MOCK DATA ====================

// Medicine catalog - Apollo has slightly different prices and stock
const medicines = [
  {
    id: 'APL001',
    name: 'Paracetamol 500mg',
    genericName: 'Acetaminophen',
    brand: 'Dolo',
    category: 'Pain Relief',
    price: 22.00,
    mrp: 28.00,
    discount: 21,
    quantity: 15,
    unit: 'tablets',
    inStock: true,
    stockCount: 650,
    manufacturer: 'Micro Labs',
    expiryDate: '2026-07-15',
    prescriptionRequired: false,
    description: 'Effective fever reducer and pain reliever for headache, body pain, and fever',
    dosageInstructions: 'Adults: 1-2 tablets every 4-6 hours. Maximum 8 tablets in 24 hours. Take with water.',
    sideEffects: ['Nausea', 'Allergic skin reactions', 'Liver issues (overdose)'],
    composition: 'Paracetamol IP 500mg',
    storageInstructions: 'Store below 30°C in a cool, dry place',
    deliveryTime: '24 hours',
    rating: 4.6,
    reviews: 2340,
    image: '/images/paracetamol.jpg'
  },
  {
    id: 'APL002',
    name: 'Azithromycin 500mg',
    genericName: 'Azithromycin',
    brand: 'Zithromax',
    category: 'Antibiotics',
    price: 95.00,
    mrp: 115.00,
    discount: 17,
    quantity: 3,
    unit: 'tablets',
    inStock: true,
    stockCount: 180,
    manufacturer: 'Pfizer',
    expiryDate: '2025-10-20',
    prescriptionRequired: true,
    description: 'Macrolide antibiotic for treating bacterial infections of respiratory tract, skin, and ear',
    dosageInstructions: 'Take 500mg once daily for 3 days. Can be taken with or without food.',
    sideEffects: ['Stomach upset', 'Diarrhea', 'Nausea', 'Vomiting', 'Headache'],
    composition: 'Azithromycin Dihydrate equivalent to Azithromycin 500mg',
    storageInstructions: 'Store below 25°C, protect from light and moisture',
    deliveryTime: '24 hours',
    rating: 4.4,
    reviews: 1120,
    image: '/images/azithromycin.jpg'
  },
  {
    id: 'APL003',
    name: 'Metformin 500mg',
    genericName: 'Metformin Hydrochloride',
    brand: 'Glucophage',
    category: 'Diabetes',
    price: 38.00,
    mrp: 48.00,
    discount: 21,
    quantity: 20,
    unit: 'tablets',
    inStock: true,
    stockCount: 400,
    manufacturer: 'Merck',
    expiryDate: '2026-04-30',
    prescriptionRequired: true,
    description: 'First-line medication for type 2 diabetes management, helps control blood sugar',
    dosageInstructions: 'Start with 500mg twice daily with meals. May be increased based on blood sugar levels.',
    sideEffects: ['Stomach upset', 'Diarrhea', 'Nausea', 'Metallic taste', 'Loss of appetite'],
    composition: 'Metformin Hydrochloride BP 500mg',
    storageInstructions: 'Store below 25°C, keep away from direct sunlight',
    deliveryTime: '24 hours',
    rating: 4.7,
    reviews: 2890,
    image: '/images/metformin.jpg'
  },
  {
    id: 'APL004',
    name: 'Pantoprazole 40mg',
    genericName: 'Pantoprazole Sodium',
    brand: 'Pan-D',
    category: 'Gastro',
    price: 75.00,
    mrp: 95.00,
    discount: 21,
    quantity: 15,
    unit: 'tablets',
    inStock: true,
    stockCount: 520,
    manufacturer: 'Alkem Laboratories',
    expiryDate: '2026-02-28',
    prescriptionRequired: false,
    description: 'Proton pump inhibitor for treating GERD, stomach ulcers, and acid reflux',
    dosageInstructions: 'Take 1 tablet before breakfast. Swallow whole, do not crush or chew.',
    sideEffects: ['Headache', 'Diarrhea', 'Nausea', 'Abdominal pain', 'Flatulence'],
    composition: 'Pantoprazole Sodium Sesquihydrate equivalent to Pantoprazole 40mg',
    storageInstructions: 'Store below 25°C in original packaging',
    deliveryTime: '24 hours',
    rating: 4.5,
    reviews: 1780,
    image: '/images/pantoprazole.jpg'
  },
  {
    id: 'APL005',
    name: 'Amoxicillin 500mg',
    genericName: 'Amoxicillin',
    brand: 'Amoxil',
    category: 'Antibiotics',
    price: 48.00,
    mrp: 62.00,
    discount: 23,
    quantity: 10,
    unit: 'capsules',
    inStock: true,
    stockCount: 320,
    manufacturer: 'GSK Pharmaceuticals',
    expiryDate: '2025-12-15',
    prescriptionRequired: true,
    description: 'Penicillin-type antibiotic for bacterial infections of ear, nose, throat, skin',
    dosageInstructions: 'Take 1 capsule every 8 hours for 7-10 days. Complete the full course.',
    sideEffects: ['Diarrhea', 'Nausea', 'Skin rash', 'Vomiting', 'Allergic reactions'],
    composition: 'Amoxicillin Trihydrate BP equivalent to Amoxicillin 500mg',
    storageInstructions: 'Store below 25°C, protect from moisture',
    deliveryTime: '24 hours',
    rating: 4.3,
    reviews: 1050,
    image: '/images/amoxicillin.jpg'
  },
  {
    id: 'APL006',
    name: 'Vitamin D3 60000 IU',
    genericName: 'Cholecalciferol',
    brand: 'Calcirol',
    category: 'Vitamins',
    price: 105.00,
    mrp: 130.00,
    discount: 19,
    quantity: 4,
    unit: 'sachets',
    inStock: true,
    stockCount: 750,
    manufacturer: 'Cadila Healthcare',
    expiryDate: '2026-09-20',
    prescriptionRequired: false,
    description: 'High-dose Vitamin D supplement for deficiency, bone health, and immune support',
    dosageInstructions: 'Dissolve 1 sachet in water, once weekly or as directed by physician.',
    sideEffects: ['Nausea (rare)', 'Weakness', 'Dry mouth', 'Headache (high doses)'],
    composition: 'Cholecalciferol (Vitamin D3) 60000 IU granules',
    storageInstructions: 'Store below 25°C, protect from moisture and light',
    deliveryTime: '24 hours',
    rating: 4.8,
    reviews: 4150,
    image: '/images/vitamind3.jpg'
  },
  {
    id: 'APL007',
    name: 'Levocetirizine 5mg',
    genericName: 'Levocetirizine Dihydrochloride',
    brand: 'Xyzal',
    category: 'Allergy',
    price: 42.00,
    mrp: 55.00,
    discount: 24,
    quantity: 10,
    unit: 'tablets',
    inStock: true,
    stockCount: 580,
    manufacturer: 'Sanofi India',
    expiryDate: '2026-06-10',
    prescriptionRequired: false,
    description: 'Third-generation antihistamine for allergies, hay fever, and urticaria',
    dosageInstructions: 'Take 1 tablet once daily in the evening. Can be taken with or without food.',
    sideEffects: ['Drowsiness', 'Dry mouth', 'Fatigue', 'Headache', 'Sore throat'],
    composition: 'Levocetirizine Dihydrochloride 5mg',
    storageInstructions: 'Store below 30°C in a dry place',
    deliveryTime: '24 hours',
    rating: 4.6,
    reviews: 2100,
    image: '/images/levocetirizine.jpg'
  },
  {
    id: 'APL008',
    name: 'Rosuvastatin 10mg',
    genericName: 'Rosuvastatin Calcium',
    brand: 'Crestor',
    category: 'Cardiac',
    price: 110.00,
    mrp: 140.00,
    discount: 21,
    quantity: 15,
    unit: 'tablets',
    inStock: true,
    stockCount: 220,
    manufacturer: 'AstraZeneca',
    expiryDate: '2026-03-25',
    prescriptionRequired: true,
    description: 'Statin medication for high cholesterol and prevention of cardiovascular disease',
    dosageInstructions: 'Take 1 tablet once daily at the same time. Can be taken with or without food.',
    sideEffects: ['Muscle pain', 'Headache', 'Abdominal pain', 'Nausea', 'Weakness'],
    composition: 'Rosuvastatin Calcium equivalent to Rosuvastatin 10mg',
    storageInstructions: 'Store below 30°C, protect from light',
    deliveryTime: '24 hours',
    rating: 4.5,
    reviews: 1650,
    image: '/images/rosuvastatin.jpg'
  },
  {
    id: 'APL009',
    name: 'Ibuprofen 400mg',
    genericName: 'Ibuprofen',
    brand: 'Brufen',
    category: 'Pain Relief',
    price: 28.00,
    mrp: 35.00,
    discount: 20,
    quantity: 10,
    unit: 'tablets',
    inStock: true,
    stockCount: 480,
    manufacturer: 'Abbott India',
    expiryDate: '2026-05-18',
    prescriptionRequired: false,
    description: 'NSAID for pain relief, inflammation, and fever reduction',
    dosageInstructions: 'Take 1 tablet every 6-8 hours with food. Maximum 3 tablets daily.',
    sideEffects: ['Stomach upset', 'Nausea', 'Headache', 'Dizziness', 'Heartburn'],
    composition: 'Ibuprofen BP 400mg',
    storageInstructions: 'Store below 25°C in a dry place',
    deliveryTime: '24 hours',
    rating: 4.4,
    reviews: 1890,
    image: '/images/ibuprofen.jpg'
  },
  {
    id: 'APL010',
    name: 'Montelukast 10mg',
    genericName: 'Montelukast Sodium',
    brand: 'Montair',
    category: 'Respiratory',
    price: 135.00,
    mrp: 170.00,
    discount: 21,
    quantity: 15,
    unit: 'tablets',
    inStock: true,
    stockCount: 190,
    manufacturer: 'Cipla Ltd',
    expiryDate: '2026-01-30',
    prescriptionRequired: true,
    description: 'Leukotriene receptor antagonist for asthma and allergic rhinitis prevention',
    dosageInstructions: 'Take 1 tablet once daily in the evening. For asthma prevention, take regularly.',
    sideEffects: ['Headache', 'Stomach pain', 'Fatigue', 'Dizziness', 'Skin rash'],
    composition: 'Montelukast Sodium equivalent to Montelukast 10mg',
    storageInstructions: 'Store below 30°C, protect from light and moisture',
    deliveryTime: '24 hours',
    rating: 4.5,
    reviews: 1420,
    image: '/images/montelukast.jpg'
  }
];

// In-memory storage
const carts = {};
const orders = {};
const users = {
  'user123': {
    id: 'user123',
    name: 'Test User',
    email: 'test@example.com',
    phone: '9876543210',
    addresses: [
      {
        id: 'addr1',
        type: 'Home',
        line1: '456 Apollo Street',
        line2: 'Block C, Sector 12',
        city: 'Bangalore',
        state: 'Karnataka',
        pincode: '560001',
        isDefault: true
      }
    ],
    savedCards: [
      {
        id: 'card1',
        type: 'Credit Card',
        last4: '1234',
        brand: 'Mastercard',
        expiryMonth: 8,
        expiryYear: 2026
      }
    ]
  }
};

// ==================== API ROUTES ====================

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    service: 'Apollo Pharmacy Mock', 
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Get all medicines
app.get('/api/medicines', (req, res) => {
  const { category, search, prescriptionRequired, inStock, sortBy, order } = req.query;
  
  let filteredMedicines = [...medicines];
  
  if (category) {
    filteredMedicines = filteredMedicines.filter(m => 
      m.category.toLowerCase() === category.toLowerCase()
    );
  }
  
  if (search) {
    const searchLower = search.toLowerCase();
    filteredMedicines = filteredMedicines.filter(m => 
      m.name.toLowerCase().includes(searchLower) ||
      m.genericName.toLowerCase().includes(searchLower) ||
      m.brand.toLowerCase().includes(searchLower)
    );
  }
  
  if (prescriptionRequired !== undefined) {
    const reqPrescription = prescriptionRequired === 'true';
    filteredMedicines = filteredMedicines.filter(m => 
      m.prescriptionRequired === reqPrescription
    );
  }
  
  if (inStock === 'true') {
    filteredMedicines = filteredMedicines.filter(m => m.inStock);
  }
  
  if (sortBy) {
    filteredMedicines.sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case 'price':
          comparison = a.price - b.price;
          break;
        case 'rating':
          comparison = a.rating - b.rating;
          break;
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'discount':
          comparison = a.discount - b.discount;
          break;
      }
      return order === 'desc' ? -comparison : comparison;
    });
  }
  
  res.json({
    success: true,
    count: filteredMedicines.length,
    data: filteredMedicines
  });
});

// Get medicine by ID
app.get('/api/medicines/:id', (req, res) => {
  const medicine = medicines.find(m => m.id === req.params.id);
  
  if (!medicine) {
    return res.status(404).json({ success: false, error: 'Medicine not found' });
  }
  
  res.json({ success: true, data: medicine });
});

// Search medicines by name
app.post('/api/medicines/search', (req, res) => {
  const { names } = req.body;
  
  if (!names || !Array.isArray(names)) {
    return res.status(400).json({ success: false, error: 'Please provide an array of medicine names' });
  }
  
  const results = names.map(name => {
    const searchLower = name.toLowerCase();
    const found = medicines.filter(m => 
      m.name.toLowerCase().includes(searchLower) ||
      m.genericName.toLowerCase().includes(searchLower) ||
      m.brand.toLowerCase().includes(searchLower)
    );
    return { searchTerm: name, matches: found, found: found.length > 0 };
  });
  
  res.json({ success: true, data: results });
});

// Get categories
app.get('/api/categories', (req, res) => {
  const categories = [...new Set(medicines.map(m => m.category))];
  res.json({ success: true, data: categories });
});

// ==================== CART OPERATIONS ====================

app.get('/api/cart/:userId', (req, res) => {
  const { userId } = req.params;
  const cart = carts[userId] || { items: [], total: 0, itemCount: 0 };
  res.json({ success: true, data: cart });
});

app.post('/api/cart/:userId/add', (req, res) => {
  const { userId } = req.params;
  const { medicineId, quantity = 1 } = req.body;
  
  const medicine = medicines.find(m => m.id === medicineId);
  if (!medicine) {
    return res.status(404).json({ success: false, error: 'Medicine not found' });
  }
  
  if (!medicine.inStock) {
    return res.status(400).json({ success: false, error: 'Medicine is out of stock' });
  }
  
  if (!carts[userId]) {
    carts[userId] = { items: [], total: 0, itemCount: 0 };
  }
  
  const existingItem = carts[userId].items.find(item => item.medicineId === medicineId);
  
  if (existingItem) {
    existingItem.quantity += quantity;
    existingItem.subtotal = existingItem.quantity * medicine.price;
  } else {
    carts[userId].items.push({
      medicineId: medicine.id,
      name: medicine.name,
      brand: medicine.brand,
      price: medicine.price,
      mrp: medicine.mrp,
      quantity,
      subtotal: quantity * medicine.price,
      prescriptionRequired: medicine.prescriptionRequired,
      image: medicine.image
    });
  }
  
  carts[userId].itemCount = carts[userId].items.reduce((sum, item) => sum + item.quantity, 0);
  carts[userId].total = carts[userId].items.reduce((sum, item) => sum + item.subtotal, 0);
  carts[userId].savings = carts[userId].items.reduce((sum, item) => 
    sum + ((item.mrp - item.price) * item.quantity), 0
  );
  
  res.json({ success: true, message: 'Item added to cart', data: carts[userId] });
});

app.put('/api/cart/:userId/update', (req, res) => {
  const { userId } = req.params;
  const { medicineId, quantity } = req.body;
  
  if (!carts[userId]) {
    return res.status(404).json({ success: false, error: 'Cart not found' });
  }
  
  const item = carts[userId].items.find(item => item.medicineId === medicineId);
  if (!item) {
    return res.status(404).json({ success: false, error: 'Item not found in cart' });
  }
  
  if (quantity <= 0) {
    carts[userId].items = carts[userId].items.filter(item => item.medicineId !== medicineId);
  } else {
    item.quantity = quantity;
    item.subtotal = quantity * item.price;
  }
  
  carts[userId].itemCount = carts[userId].items.reduce((sum, item) => sum + item.quantity, 0);
  carts[userId].total = carts[userId].items.reduce((sum, item) => sum + item.subtotal, 0);
  carts[userId].savings = carts[userId].items.reduce((sum, item) => 
    sum + ((item.mrp - item.price) * item.quantity), 0
  );
  
  res.json({ success: true, message: 'Cart updated', data: carts[userId] });
});

app.delete('/api/cart/:userId/remove/:medicineId', (req, res) => {
  const { userId, medicineId } = req.params;
  
  if (!carts[userId]) {
    return res.status(404).json({ success: false, error: 'Cart not found' });
  }
  
  carts[userId].items = carts[userId].items.filter(item => item.medicineId !== medicineId);
  
  carts[userId].itemCount = carts[userId].items.reduce((sum, item) => sum + item.quantity, 0);
  carts[userId].total = carts[userId].items.reduce((sum, item) => sum + item.subtotal, 0);
  carts[userId].savings = carts[userId].items.reduce((sum, item) => 
    sum + ((item.mrp - item.price) * item.quantity), 0
  );
  
  res.json({ success: true, message: 'Item removed from cart', data: carts[userId] });
});

app.delete('/api/cart/:userId/clear', (req, res) => {
  const { userId } = req.params;
  carts[userId] = { items: [], total: 0, itemCount: 0, savings: 0 };
  res.json({ success: true, message: 'Cart cleared', data: carts[userId] });
});

// ==================== ORDER OPERATIONS ====================

app.post('/api/orders/create', (req, res) => {
  const { userId, addressId, paymentMethod, prescriptionUrl } = req.body;
  
  if (!carts[userId] || carts[userId].items.length === 0) {
    return res.status(400).json({ success: false, error: 'Cart is empty' });
  }
  
  const needsPrescription = carts[userId].items.some(item => item.prescriptionRequired);
  if (needsPrescription && !prescriptionUrl) {
    return res.status(400).json({ 
      success: false, 
      error: 'Prescription required for some items in cart',
      prescriptionRequired: true,
      itemsRequiringPrescription: carts[userId].items.filter(i => i.prescriptionRequired)
    });
  }
  
  const user = users[userId];
  const address = user?.addresses.find(a => a.id === addressId) || user?.addresses[0];
  
  const orderId = `APL${Date.now()}${Math.random().toString(36).substr(2, 4).toUpperCase()}`;
  
  const order = {
    orderId,
    userId,
    items: [...carts[userId].items],
    subtotal: carts[userId].total,
    deliveryFee: carts[userId].total >= 400 ? 0 : 30,
    discount: 0,
    total: carts[userId].total + (carts[userId].total >= 400 ? 0 : 30),
    savings: carts[userId].savings,
    address,
    paymentMethod: paymentMethod || 'COD',
    paymentStatus: 'pending',
    orderStatus: 'confirmed',
    prescriptionUrl,
    estimatedDelivery: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date().toISOString(),
    statusHistory: [
      { status: 'confirmed', timestamp: new Date().toISOString(), message: 'Order confirmed successfully' }
    ]
  };
  
  orders[orderId] = order;
  carts[userId] = { items: [], total: 0, itemCount: 0, savings: 0 };
  
  res.json({ success: true, message: 'Order placed successfully', data: order });
});

app.post('/api/orders/:orderId/pay', (req, res) => {
  const { orderId } = req.params;
  const { paymentMethod } = req.body;
  
  const order = orders[orderId];
  if (!order) {
    return res.status(404).json({ success: false, error: 'Order not found' });
  }
  
  const paymentId = `APLPAY${Date.now()}`;
  
  order.paymentStatus = 'completed';
  order.paymentId = paymentId;
  order.paymentMethod = paymentMethod;
  order.paidAt = new Date().toISOString();
  order.statusHistory.push({
    status: 'payment_completed',
    timestamp: new Date().toISOString(),
    message: `Payment of ₹${order.total} completed via ${paymentMethod}`
  });
  
  res.json({ 
    success: true, 
    message: 'Payment successful',
    data: { orderId, paymentId, amount: order.total, status: 'completed' }
  });
});

app.get('/api/orders/:orderId', (req, res) => {
  const { orderId } = req.params;
  const order = orders[orderId];
  
  if (!order) {
    return res.status(404).json({ success: false, error: 'Order not found' });
  }
  
  res.json({ success: true, data: order });
});

app.get('/api/orders/user/:userId', (req, res) => {
  const { userId } = req.params;
  const userOrders = Object.values(orders).filter(o => o.userId === userId);
  res.json({ success: true, count: userOrders.length, data: userOrders });
});

app.put('/api/orders/:orderId/status', (req, res) => {
  const { orderId } = req.params;
  const { status, message } = req.body;
  
  const order = orders[orderId];
  if (!order) {
    return res.status(404).json({ success: false, error: 'Order not found' });
  }
  
  order.orderStatus = status;
  order.statusHistory.push({
    status,
    timestamp: new Date().toISOString(),
    message: message || `Order status updated to ${status}`
  });
  
  res.json({ success: true, message: 'Order status updated', data: order });
});

// ==================== USER OPERATIONS ====================

app.get('/api/users/:userId', (req, res) => {
  const { userId } = req.params;
  const user = users[userId];
  
  if (!user) {
    return res.status(404).json({ success: false, error: 'User not found' });
  }
  
  res.json({ success: true, data: user });
});

app.post('/api/users/:userId/addresses', (req, res) => {
  const { userId } = req.params;
  const address = req.body;
  
  if (!users[userId]) {
    users[userId] = { id: userId, addresses: [], savedCards: [] };
  }
  
  const newAddress = {
    id: `addr${Date.now()}`,
    ...address,
    isDefault: users[userId].addresses.length === 0
  };
  
  users[userId].addresses.push(newAddress);
  
  res.json({ success: true, message: 'Address added', data: newAddress });
});

// ==================== PRESCRIPTION ====================

app.post('/api/prescription/upload', (req, res) => {
  const { userId } = req.body;
  const prescriptionId = `APLPRESC${Date.now()}`;
  
  res.json({
    success: true,
    message: 'Prescription uploaded successfully',
    data: {
      prescriptionId,
      userId,
      uploadedAt: new Date().toISOString(),
      status: 'pending_verification',
      url: `/prescriptions/${prescriptionId}`
    }
  });
});

app.post('/api/prescription/:prescriptionId/verify', (req, res) => {
  const { prescriptionId } = req.params;
  
  res.json({
    success: true,
    message: 'Prescription verified',
    data: {
      prescriptionId,
      status: 'verified',
      verifiedAt: new Date().toISOString(),
      validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
    }
  });
});

// ==================== DELIVERY SLOTS ====================

app.get('/api/delivery/slots', (req, res) => {
  const today = new Date();
  const slots = [];
  
  // Apollo offers faster delivery - same day and next day
  for (let i = 0; i <= 3; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() + i);
    
    const daySlots = i === 0 ? [
      { id: `${i}-1`, time: '2:00 PM - 5:00 PM', available: new Date().getHours() < 12, fee: 50 },
      { id: `${i}-2`, time: '5:00 PM - 8:00 PM', available: new Date().getHours() < 15, fee: 30 }
    ] : [
      { id: `${i}-1`, time: '8:00 AM - 11:00 AM', available: true, fee: 0 },
      { id: `${i}-2`, time: '11:00 AM - 2:00 PM', available: true, fee: 0 },
      { id: `${i}-3`, time: '2:00 PM - 5:00 PM', available: true, fee: 0 },
      { id: `${i}-4`, time: '5:00 PM - 8:00 PM', available: true, fee: 0 }
    ];
    
    slots.push({
      date: date.toISOString().split('T')[0],
      dayLabel: i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : date.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' }),
      slots: daySlots
    });
  }
  
  res.json({ success: true, data: slots });
});

// ==================== STORE LOCATOR ====================

app.get('/api/stores/nearby', (req, res) => {
  // Mock nearby Apollo stores
  const stores = [
    {
      id: 'store1',
      name: 'Apollo Pharmacy - MG Road',
      address: '123 MG Road, Brigade Gateway, Bangalore',
      distance: '1.2 km',
      phone: '080-12345678',
      timing: '8:00 AM - 10:00 PM',
      services: ['24x7 Delivery', 'Health Checkup', 'Vaccination']
    },
    {
      id: 'store2',
      name: 'Apollo Pharmacy - Koramangala',
      address: '456 80 Feet Road, Koramangala, Bangalore',
      distance: '2.5 km',
      phone: '080-87654321',
      timing: '24 Hours',
      services: ['24x7 Delivery', 'Doctor Consultation', 'Lab Tests']
    },
    {
      id: 'store3',
      name: 'Apollo Pharmacy - Indiranagar',
      address: '789 100 Feet Road, Indiranagar, Bangalore',
      distance: '3.8 km',
      phone: '080-11223344',
      timing: '7:00 AM - 11:00 PM',
      services: ['Home Delivery', 'Health Products']
    }
  ];
  
  res.json({ success: true, data: stores });
});

// ==================== VIEW ROUTES ====================

app.get('/', (req, res) => {
  res.render('index', { 
    medicines,
    categories: [...new Set(medicines.map(m => m.category))],
    siteName: 'Apollo Pharmacy',
    tagline: 'Trusted Health Partner Since 1983'
  });
});

app.get('/product/:id', (req, res) => {
  const medicine = medicines.find(m => m.id === req.params.id);
  
  if (!medicine) {
    return res.status(404).render('error', { message: 'Medicine not found' });
  }
  
  res.render('product', { 
    medicine,
    siteName: 'Apollo Pharmacy',
    relatedProducts: medicines.filter(m => m.category === medicine.category && m.id !== medicine.id).slice(0, 4)
  });
});

app.get('/cart', (req, res) => {
  const userId = req.query.userId || 'user123';
  const cart = carts[userId] || { items: [], total: 0, itemCount: 0 };
  
  res.render('cart', { cart, userId, siteName: 'Apollo Pharmacy' });
});

app.get('/checkout', (req, res) => {
  const userId = req.query.userId || 'user123';
  const cart = carts[userId] || { items: [], total: 0, itemCount: 0 };
  const user = users[userId];
  
  res.render('checkout', { cart, user, siteName: 'Apollo Pharmacy' });
});

app.get('/order/:orderId', (req, res) => {
  const order = orders[req.params.orderId];
  
  if (!order) {
    return res.status(404).render('error', { message: 'Order not found' });
  }
  
  res.render('order', { order, siteName: 'Apollo Pharmacy' });
});

// ==================== VIEW ROUTES ====================

// ... (Your existing Home Page route is here) ...

// --- ADD THIS NEW ROUTE FOR THE BOT ---
app.get('/search', (req, res) => {
  const query = req.query.q ? req.query.q.toLowerCase() : '';
  
  // Logic: Search the detailed 'medicines' array
  const foundMedicine = medicines.find(m => 
    m.name.toLowerCase().includes(query) || 
    m.genericName.toLowerCase().includes(query) ||
    m.brand.toLowerCase().includes(query)
  );

  // Render the 'product' view
  // We pass 'medicine' (for the full page) and 'data' (in case your previous simple EJS used that)
  res.render('product', { 
    medicine: foundMedicine, 
    // Map data for backward compatibility if your EJS uses 'data.price'
    data: foundMedicine, 
    name: foundMedicine ? foundMedicine.name : query,
    siteName: 'Tata 1mg',
    relatedProducts: [] 
  });
});

// ... (Your existing Product, Cart, Checkout routes follow here) ...


// Start server
app.listen(PORT, () => {
  console.log(`🏥 Apollo Pharmacy Mock Server running on http://localhost:${PORT}`);
  console.log(`📦 API endpoints available at http://localhost:${PORT}/api`);
});

module.exports = app;
