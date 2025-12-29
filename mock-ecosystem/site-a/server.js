const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const path = require('path');

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// ==================== MOCK DATA ====================

// Medicine catalog with detailed information
const medicines = [
  {
    id: 'MED001',
    name: 'Paracetamol 500mg',
    genericName: 'Acetaminophen',
    brand: 'Crocin',
    category: 'Pain Relief',
    price: 25.00,
    mrp: 30.00,
    discount: 17,
    quantity: 10,
    unit: 'tablets',
    inStock: true,
    stockCount: 500,
    manufacturer: 'GSK Pharmaceuticals',
    expiryDate: '2026-06-30',
    prescriptionRequired: false,
    description: 'Used for fever and mild to moderate pain relief',
    dosageInstructions: 'Take 1-2 tablets every 4-6 hours as needed. Do not exceed 8 tablets in 24 hours.',
    sideEffects: ['Nausea', 'Allergic reactions (rare)', 'Liver damage (overdose)'],
    composition: 'Paracetamol 500mg',
    storageInstructions: 'Store below 25°C in a dry place',
    deliveryTime: '1-2 days',
    rating: 4.5,
    reviews: 1250,
    image: '/images/paracetamol.jpg'
  },
  {
    id: 'MED002',
    name: 'Azithromycin 500mg',
    genericName: 'Azithromycin',
    brand: 'Azithral',
    category: 'Antibiotics',
    price: 85.00,
    mrp: 100.00,
    discount: 15,
    quantity: 3,
    unit: 'tablets',
    inStock: true,
    stockCount: 200,
    manufacturer: 'Alembic Pharma',
    expiryDate: '2025-12-31',
    prescriptionRequired: true,
    description: 'Antibiotic used to treat bacterial infections',
    dosageInstructions: 'Take 1 tablet daily for 3 days, preferably 1 hour before or 2 hours after meals.',
    sideEffects: ['Diarrhea', 'Nausea', 'Abdominal pain', 'Headache'],
    composition: 'Azithromycin 500mg',
    storageInstructions: 'Store below 30°C, protect from moisture',
    deliveryTime: '1-2 days',
    rating: 4.3,
    reviews: 890,
    image: '/images/azithromycin.jpg'
  },
  {
    id: 'MED003',
    name: 'Metformin 500mg',
    genericName: 'Metformin Hydrochloride',
    brand: 'Glycomet',
    category: 'Diabetes',
    price: 45.00,
    mrp: 55.00,
    discount: 18,
    quantity: 20,
    unit: 'tablets',
    inStock: true,
    stockCount: 350,
    manufacturer: 'USV Limited',
    expiryDate: '2026-03-15',
    prescriptionRequired: true,
    description: 'Used to control blood sugar levels in type 2 diabetes',
    dosageInstructions: 'Take with meals, usually 1-2 times daily as directed by physician.',
    sideEffects: ['Nausea', 'Diarrhea', 'Stomach upset', 'Metallic taste'],
    composition: 'Metformin Hydrochloride 500mg',
    storageInstructions: 'Store below 25°C in a dry place',
    deliveryTime: '1-2 days',
    rating: 4.6,
    reviews: 2100,
    image: '/images/metformin.jpg'
  },
  {
    id: 'MED004',
    name: 'Omeprazole 20mg',
    genericName: 'Omeprazole',
    brand: 'Omez',
    category: 'Gastro',
    price: 65.00,
    mrp: 80.00,
    discount: 19,
    quantity: 15,
    unit: 'capsules',
    inStock: true,
    stockCount: 420,
    manufacturer: 'Dr. Reddy\'s Laboratories',
    expiryDate: '2026-01-20',
    prescriptionRequired: false,
    description: 'Used to treat acidity, heartburn, and stomach ulcers',
    dosageInstructions: 'Take 1 capsule daily before breakfast for 2-4 weeks.',
    sideEffects: ['Headache', 'Nausea', 'Diarrhea', 'Stomach pain'],
    composition: 'Omeprazole 20mg',
    storageInstructions: 'Store below 25°C, protect from moisture',
    deliveryTime: '1-2 days',
    rating: 4.4,
    reviews: 1560,
    image: '/images/omeprazole.jpg'
  },
  {
    id: 'MED005',
    name: 'Amoxicillin 500mg',
    genericName: 'Amoxicillin',
    brand: 'Mox',
    category: 'Antibiotics',
    price: 55.00,
    mrp: 70.00,
    discount: 21,
    quantity: 10,
    unit: 'capsules',
    inStock: true,
    stockCount: 280,
    manufacturer: 'Ranbaxy Laboratories',
    expiryDate: '2025-11-30',
    prescriptionRequired: true,
    description: 'Broad-spectrum antibiotic for bacterial infections',
    dosageInstructions: 'Take 1 capsule every 8 hours for 7-10 days with or without food.',
    sideEffects: ['Diarrhea', 'Nausea', 'Skin rash', 'Allergic reactions'],
    composition: 'Amoxicillin Trihydrate equivalent to Amoxicillin 500mg',
    storageInstructions: 'Store below 25°C in a dry place',
    deliveryTime: '1-2 days',
    rating: 4.2,
    reviews: 980,
    image: '/images/amoxicillin.jpg'
  },
  {
    id: 'MED006',
    name: 'Vitamin D3 60000 IU',
    genericName: 'Cholecalciferol',
    brand: 'D-Rise',
    category: 'Vitamins',
    price: 120.00,
    mrp: 150.00,
    discount: 20,
    quantity: 8,
    unit: 'softgels',
    inStock: true,
    stockCount: 600,
    manufacturer: 'USV Limited',
    expiryDate: '2026-08-15',
    prescriptionRequired: false,
    description: 'Vitamin D supplement for bone health and immunity',
    dosageInstructions: 'Take 1 softgel once a week or as directed by physician.',
    sideEffects: ['Nausea (rare)', 'Constipation (high doses)', 'Weakness'],
    composition: 'Cholecalciferol (Vitamin D3) 60000 IU',
    storageInstructions: 'Store below 25°C, protect from light',
    deliveryTime: '1-2 days',
    rating: 4.7,
    reviews: 3200,
    image: '/images/vitamind3.jpg'
  },
  {
    id: 'MED007',
    name: 'Cetirizine 10mg',
    genericName: 'Cetirizine Hydrochloride',
    brand: 'Cetzine',
    category: 'Allergy',
    price: 35.00,
    mrp: 45.00,
    discount: 22,
    quantity: 10,
    unit: 'tablets',
    inStock: true,
    stockCount: 450,
    manufacturer: 'Alkem Laboratories',
    expiryDate: '2026-05-10',
    prescriptionRequired: false,
    description: 'Antihistamine for allergy relief, sneezing, and runny nose',
    dosageInstructions: 'Take 1 tablet once daily, preferably at bedtime.',
    sideEffects: ['Drowsiness', 'Dry mouth', 'Fatigue', 'Headache'],
    composition: 'Cetirizine Hydrochloride 10mg',
    storageInstructions: 'Store below 30°C in a dry place',
    deliveryTime: '1-2 days',
    rating: 4.5,
    reviews: 1890,
    image: '/images/cetirizine.jpg'
  },
  {
    id: 'MED008',
    name: 'Atorvastatin 10mg',
    genericName: 'Atorvastatin Calcium',
    brand: 'Atorva',
    category: 'Cardiac',
    price: 95.00,
    mrp: 120.00,
    discount: 21,
    quantity: 15,
    unit: 'tablets',
    inStock: true,
    stockCount: 180,
    manufacturer: 'Zydus Cadila',
    expiryDate: '2026-02-28',
    prescriptionRequired: true,
    description: 'Used to lower cholesterol and reduce risk of heart disease',
    dosageInstructions: 'Take 1 tablet once daily at the same time each day.',
    sideEffects: ['Muscle pain', 'Joint pain', 'Nausea', 'Diarrhea'],
    composition: 'Atorvastatin Calcium equivalent to Atorvastatin 10mg',
    storageInstructions: 'Store below 25°C, protect from moisture and light',
    deliveryTime: '1-2 days',
    rating: 4.4,
    reviews: 1450,
    image: '/images/atorvastatin.jpg'
  }
];

// In-memory storage for carts and orders
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
        line1: '123 Test Street',
        line2: 'Apartment 4B',
        city: 'Mumbai',
        state: 'Maharashtra',
        pincode: '400001',
        isDefault: true
      }
    ],
    savedCards: [
      {
        id: 'card1',
        type: 'Credit Card',
        last4: '4242',
        brand: 'Visa',
        expiryMonth: 12,
        expiryYear: 2027
      }
    ]
  }
};

// ==================== API ROUTES ====================

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    service: 'Tata 1mg Mock', 
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Get all medicines
app.get('/api/medicines', (req, res) => {
  const { category, search, prescriptionRequired, inStock, sortBy, order } = req.query;
  
  let filteredMedicines = [...medicines];
  
  // Filter by category
  if (category) {
    filteredMedicines = filteredMedicines.filter(m => 
      m.category.toLowerCase() === category.toLowerCase()
    );
  }
  
  // Search by name or generic name
  if (search) {
    const searchLower = search.toLowerCase();
    filteredMedicines = filteredMedicines.filter(m => 
      m.name.toLowerCase().includes(searchLower) ||
      m.genericName.toLowerCase().includes(searchLower) ||
      m.brand.toLowerCase().includes(searchLower)
    );
  }
  
  // Filter by prescription requirement
  if (prescriptionRequired !== undefined) {
    const reqPrescription = prescriptionRequired === 'true';
    filteredMedicines = filteredMedicines.filter(m => 
      m.prescriptionRequired === reqPrescription
    );
  }
  
  // Filter by stock
  if (inStock === 'true') {
    filteredMedicines = filteredMedicines.filter(m => m.inStock);
  }
  
  // Sorting
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
    return res.status(404).json({ 
      success: false, 
      error: 'Medicine not found' 
    });
  }
  
  res.json({ 
    success: true, 
    data: medicine 
  });
});

// Search medicines by name (for prescription parsing)
app.post('/api/medicines/search', (req, res) => {
  const { names } = req.body;
  
  if (!names || !Array.isArray(names)) {
    return res.status(400).json({ 
      success: false, 
      error: 'Please provide an array of medicine names' 
    });
  }
  
  const results = names.map(name => {
    const searchLower = name.toLowerCase();
    const found = medicines.filter(m => 
      m.name.toLowerCase().includes(searchLower) ||
      m.genericName.toLowerCase().includes(searchLower) ||
      m.brand.toLowerCase().includes(searchLower)
    );
    return {
      searchTerm: name,
      matches: found,
      found: found.length > 0
    };
  });
  
  res.json({
    success: true,
    data: results
  });
});

// Get categories
app.get('/api/categories', (req, res) => {
  const categories = [...new Set(medicines.map(m => m.category))];
  res.json({ 
    success: true, 
    data: categories 
  });
});

// ==================== CART OPERATIONS ====================

// Get cart
app.get('/api/cart/:userId', (req, res) => {
  const { userId } = req.params;
  const cart = carts[userId] || { items: [], total: 0, itemCount: 0 };
  
  res.json({ 
    success: true, 
    data: cart 
  });
});

// Add to cart
app.post('/api/cart/:userId/add', (req, res) => {
  const { userId } = req.params;
  const { medicineId, quantity = 1 } = req.body;
  
  const medicine = medicines.find(m => m.id === medicineId);
  if (!medicine) {
    return res.status(404).json({ 
      success: false, 
      error: 'Medicine not found' 
    });
  }
  
  if (!medicine.inStock) {
    return res.status(400).json({ 
      success: false, 
      error: 'Medicine is out of stock' 
    });
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
  
  // Recalculate totals
  carts[userId].itemCount = carts[userId].items.reduce((sum, item) => sum + item.quantity, 0);
  carts[userId].total = carts[userId].items.reduce((sum, item) => sum + item.subtotal, 0);
  carts[userId].savings = carts[userId].items.reduce((sum, item) => 
    sum + ((item.mrp - item.price) * item.quantity), 0
  );
  
  res.json({ 
    success: true, 
    message: 'Item added to cart',
    data: carts[userId] 
  });
});

// Update cart item quantity
app.put('/api/cart/:userId/update', (req, res) => {
  const { userId } = req.params;
  const { medicineId, quantity } = req.body;
  
  if (!carts[userId]) {
    return res.status(404).json({ 
      success: false, 
      error: 'Cart not found' 
    });
  }
  
  const item = carts[userId].items.find(item => item.medicineId === medicineId);
  if (!item) {
    return res.status(404).json({ 
      success: false, 
      error: 'Item not found in cart' 
    });
  }
  
  if (quantity <= 0) {
    carts[userId].items = carts[userId].items.filter(item => item.medicineId !== medicineId);
  } else {
    item.quantity = quantity;
    item.subtotal = quantity * item.price;
  }
  
  // Recalculate totals
  carts[userId].itemCount = carts[userId].items.reduce((sum, item) => sum + item.quantity, 0);
  carts[userId].total = carts[userId].items.reduce((sum, item) => sum + item.subtotal, 0);
  carts[userId].savings = carts[userId].items.reduce((sum, item) => 
    sum + ((item.mrp - item.price) * item.quantity), 0
  );
  
  res.json({ 
    success: true, 
    message: 'Cart updated',
    data: carts[userId] 
  });
});

// Remove from cart
app.delete('/api/cart/:userId/remove/:medicineId', (req, res) => {
  const { userId, medicineId } = req.params;
  
  if (!carts[userId]) {
    return res.status(404).json({ 
      success: false, 
      error: 'Cart not found' 
    });
  }
  
  carts[userId].items = carts[userId].items.filter(item => item.medicineId !== medicineId);
  
  // Recalculate totals
  carts[userId].itemCount = carts[userId].items.reduce((sum, item) => sum + item.quantity, 0);
  carts[userId].total = carts[userId].items.reduce((sum, item) => sum + item.subtotal, 0);
  carts[userId].savings = carts[userId].items.reduce((sum, item) => 
    sum + ((item.mrp - item.price) * item.quantity), 0
  );
  
  res.json({ 
    success: true, 
    message: 'Item removed from cart',
    data: carts[userId] 
  });
});

// Clear cart
app.delete('/api/cart/:userId/clear', (req, res) => {
  const { userId } = req.params;
  carts[userId] = { items: [], total: 0, itemCount: 0, savings: 0 };
  
  res.json({ 
    success: true, 
    message: 'Cart cleared',
    data: carts[userId] 
  });
});

// ==================== ORDER OPERATIONS ====================

// Create order (checkout)
app.post('/api/orders/create', (req, res) => {
  const { userId, addressId, paymentMethod, prescriptionUrl } = req.body;
  
  if (!carts[userId] || carts[userId].items.length === 0) {
    return res.status(400).json({ 
      success: false, 
      error: 'Cart is empty' 
    });
  }
  
  // Check if prescription is required
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
  
  const orderId = `TM${Date.now()}${Math.random().toString(36).substr(2, 4).toUpperCase()}`;
  
  const order = {
    orderId,
    userId,
    items: [...carts[userId].items],
    subtotal: carts[userId].total,
    deliveryFee: carts[userId].total >= 500 ? 0 : 40,
    discount: 0,
    total: carts[userId].total + (carts[userId].total >= 500 ? 0 : 40),
    savings: carts[userId].savings,
    address,
    paymentMethod: paymentMethod || 'COD',
    paymentStatus: 'pending',
    orderStatus: 'confirmed',
    prescriptionUrl,
    estimatedDelivery: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date().toISOString(),
    statusHistory: [
      { status: 'confirmed', timestamp: new Date().toISOString(), message: 'Order placed successfully' }
    ]
  };
  
  orders[orderId] = order;
  
  // Clear the cart after order
  carts[userId] = { items: [], total: 0, itemCount: 0, savings: 0 };
  
  res.json({ 
    success: true, 
    message: 'Order placed successfully',
    data: order 
  });
});

// Process payment
app.post('/api/orders/:orderId/pay', (req, res) => {
  const { orderId } = req.params;
  const { paymentMethod, cardId } = req.body;
  
  const order = orders[orderId];
  if (!order) {
    return res.status(404).json({ 
      success: false, 
      error: 'Order not found' 
    });
  }
  
  // Simulate payment processing
  const paymentId = `PAY${Date.now()}`;
  
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
    data: {
      orderId,
      paymentId,
      amount: order.total,
      status: 'completed'
    }
  });
});

// Get order by ID
app.get('/api/orders/:orderId', (req, res) => {
  const { orderId } = req.params;
  const order = orders[orderId];
  
  if (!order) {
    return res.status(404).json({ 
      success: false, 
      error: 'Order not found' 
    });
  }
  
  res.json({ 
    success: true, 
    data: order 
  });
});

// Get user orders
app.get('/api/orders/user/:userId', (req, res) => {
  const { userId } = req.params;
  const userOrders = Object.values(orders).filter(o => o.userId === userId);
  
  res.json({ 
    success: true, 
    count: userOrders.length,
    data: userOrders 
  });
});

// Update order status (for admin/testing)
app.put('/api/orders/:orderId/status', (req, res) => {
  const { orderId } = req.params;
  const { status, message } = req.body;
  
  const order = orders[orderId];
  if (!order) {
    return res.status(404).json({ 
      success: false, 
      error: 'Order not found' 
    });
  }
  
  order.orderStatus = status;
  order.statusHistory.push({
    status,
    timestamp: new Date().toISOString(),
    message: message || `Order status updated to ${status}`
  });
  
  res.json({ 
    success: true, 
    message: 'Order status updated',
    data: order 
  });
});

// ==================== USER OPERATIONS ====================

// Get user profile
app.get('/api/users/:userId', (req, res) => {
  const { userId } = req.params;
  const user = users[userId];
  
  if (!user) {
    return res.status(404).json({ 
      success: false, 
      error: 'User not found' 
    });
  }
  
  res.json({ 
    success: true, 
    data: user 
  });
});

// Add address
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
  
  res.json({ 
    success: true, 
    message: 'Address added',
    data: newAddress 
  });
});

// ==================== PRESCRIPTION UPLOAD ====================

// Upload prescription (mock)
app.post('/api/prescription/upload', (req, res) => {
  const { userId, prescriptionData } = req.body;
  
  // In real scenario, this would handle file upload
  const prescriptionId = `PRESC${Date.now()}`;
  
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

// Verify prescription (mock)
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

// Get available delivery slots
app.get('/api/delivery/slots', (req, res) => {
  const today = new Date();
  const slots = [];
  
  for (let i = 1; i <= 5; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() + i);
    
    slots.push({
      date: date.toISOString().split('T')[0],
      slots: [
        { id: `${i}-1`, time: '9:00 AM - 12:00 PM', available: true, fee: 0 },
        { id: `${i}-2`, time: '12:00 PM - 3:00 PM', available: true, fee: 0 },
        { id: `${i}-3`, time: '3:00 PM - 6:00 PM', available: i !== 3, fee: 0 },
        { id: `${i}-4`, time: '6:00 PM - 9:00 PM', available: true, fee: 20 }
      ]
    });
  }
  
  res.json({ 
    success: true, 
    data: slots 
  });
});

// ==================== VIEW ROUTES ====================

// Home page
app.get('/', (req, res) => {
  res.render('index', { 
    medicines,
    categories: [...new Set(medicines.map(m => m.category))],
    siteName: 'Tata 1mg',
    tagline: 'Your Trusted Health Partner'
  });
});

// Product page
app.get('/product/:id', (req, res) => {
  const medicine = medicines.find(m => m.id === req.params.id);
  
  if (!medicine) {
    return res.status(404).render('error', { message: 'Medicine not found' });
  }
  
  res.render('product', { 
    medicine,
    siteName: 'Tata 1mg',
    relatedProducts: medicines.filter(m => m.category === medicine.category && m.id !== medicine.id).slice(0, 4)
  });
});

// Cart page
app.get('/cart', (req, res) => {
  const userId = req.query.userId || 'user123';
  const cart = carts[userId] || { items: [], total: 0, itemCount: 0 };
  
  res.render('cart', { 
    cart,
    userId,
    siteName: 'Tata 1mg'
  });
});

// Checkout page
app.get('/checkout', (req, res) => {
  const userId = req.query.userId || 'user123';
  const cart = carts[userId] || { items: [], total: 0, itemCount: 0 };
  const user = users[userId];
  
  res.render('checkout', { 
    cart,
    user,
    siteName: 'Tata 1mg'
  });
});

// Order confirmation page
app.get('/order/:orderId', (req, res) => {
  const order = orders[req.params.orderId];
  
  if (!order) {
    return res.status(404).render('error', { message: 'Order not found' });
  }
  
  res.render('order', { 
    order,
    siteName: 'Tata 1mg'
  });
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
  console.log(`🏥 Tata 1mg Mock Server running on http://localhost:${PORT}`);
  console.log(`📦 API endpoints available at http://localhost:${PORT}/api`);
});

module.exports = app;
