const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');

const app = express();
const PORT = 5001;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Multer setup for file uploads
const upload = multer({ dest: 'uploads/' });

// Dummy medicines database - Site A (Premium, Higher Prices)
const medicines = [
  {
    id: 1,
    name: 'PremiumVit D3',
    price: 450,
    delivery: '2 days',
    rating: 4.8,
    description: 'High-potency Vitamin D3 supplement',
    image: '/images/vitd3.jpg'
  },
  {
    id: 2,
    name: 'ElitePain Relief',
    price: 280,
    delivery: '1 day',
    rating: 4.9,
    description: 'Fast-acting pain relief medication',
    image: '/images/pain.jpg'
  },
  {
    id: 3,
    name: 'ProHealth Antibiotic',
    price: 320,
    delivery: '2 days',
    rating: 4.7,
    description: 'Broad-spectrum antibiotic',
    image: '/images/antibiotic.jpg'
  },
  {
    id: 4,
    name: 'CareMax Calcium',
    price: 380,
    delivery: '2 days',
    rating: 4.6,
    description: 'Calcium supplement with Vitamin K2',
    image: '/images/calcium.jpg'
  },
  {
    id: 5,
    name: 'WellnessPlus Multivitamin',
    price: 520,
    delivery: '1 day',
    rating: 4.9,
    description: 'Complete multivitamin complex',
    image: '/images/multivit.jpg'
  }
];

// Cart storage (in-memory)
const carts = {};

// Prescription uploads storage
const prescriptions = [];

// Routes

// GET - All medicines
app.get('/api/medicines', (req, res) => {
  res.json({
    success: true,
    site: 'Site A - Premium Health',
    medicines
  });
});

// GET - Medicine by ID
app.get('/api/medicines/:id', (req, res) => {
  const medicine = medicines.find(m => m.id === parseInt(req.params.id));
  if (!medicine) {
    return res.status(404).json({ success: false, message: 'Medicine not found' });
  }
  res.json({ success: true, medicine });
});

// GET - Cart for user
app.get('/api/cart/:userId', (req, res) => {
  const cart = carts[req.params.userId] || [];
  res.json({ success: true, cart });
});

// POST - Add to cart
app.post('/api/cart/:userId', (req, res) => {
  const { medicineId, quantity } = req.body;
  const userId = req.params.userId;
  
  if (!carts[userId]) {
    carts[userId] = [];
  }
  
  const medicine = medicines.find(m => m.id === medicineId);
  if (!medicine) {
    return res.status(404).json({ success: false, message: 'Medicine not found' });
  }
  
  const cartItem = {
    id: medicineId,
    name: medicine.name,
    price: medicine.price,
    quantity: quantity || 1
  };
  
  carts[userId].push(cartItem);
  res.json({ success: true, message: 'Added to cart', cart: carts[userId] });
});

// DELETE - Remove from cart
app.delete('/api/cart/:userId/:medicineId', (req, res) => {
  const userId = req.params.userId;
  const medicineId = parseInt(req.params.medicineId);
  
  if (carts[userId]) {
    carts[userId] = carts[userId].filter(item => item.id !== medicineId);
  }
  
  res.json({ success: true, message: 'Removed from cart' });
});

// POST - Checkout (dummy order confirmation)
app.post('/api/checkout/:userId', (req, res) => {
  const userId = req.params.userId;
  const cart = carts[userId] || [];
  
  if (cart.length === 0) {
    return res.status(400).json({ success: false, message: 'Cart is empty' });
  }
  
  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const orderId = `SITE-A-${Date.now()}`;
  
  const order = {
    orderId,
    userId,
    items: cart,
    total,
    status: 'confirmed',
    date: new Date()
  };
  
  // Clear cart
  delete carts[userId];
  
  res.json({ success: true, message: 'Order confirmed', order });
});

// POST - Upload prescription
app.post('/api/prescription/:userId', upload.single('prescription'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'No file uploaded' });
  }
  
  const prescription = {
    id: prescriptions.length + 1,
    userId: req.params.userId,
    filename: req.file.filename,
    originalName: req.file.originalname,
    uploadDate: new Date()
  };
  
  prescriptions.push(prescription);
  
  res.json({ success: true, message: 'Prescription uploaded', prescription });
});

// GET - User prescriptions
app.get('/api/prescriptions/:userId', (req, res) => {
  const userPrescriptions = prescriptions.filter(p => p.userId === req.params.userId);
  res.json({ success: true, prescriptions: userPrescriptions });
});

app.listen(PORT, () => {
  console.log(`\n🏥 Site A Backend (Premium) running on http://localhost:${PORT}\n`);
});
