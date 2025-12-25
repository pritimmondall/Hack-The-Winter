import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import HomePage from './pages/HomePage';
import MedicineListPage from './pages/MedicineListPage';
import MedicineDetailPage from './pages/MedicineDetailPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import PrescriptionPage from './pages/PrescriptionPage';

function App() {
  const [page, setPage] = useState('home');
  const [selectedMedicine, setSelectedMedicine] = useState(null);
  const userId = 'user123';

  const handleViewMedicine = (medicineId) => {
    setSelectedMedicine(medicineId);
    setPage('detail');
  };

  return (
    <div className="app">
      <header className="site-header">
        <h1>🏥 Site A - Premium Health Store</h1>
        <nav>
          <button onClick={() => setPage('home')}>Home</button>
          <button onClick={() => setPage('medicines')}>Medicines</button>
          <button onClick={() => setPage('cart')}>Cart</button>
          <button onClick={() => setPage('prescription')}>Upload Rx</button>
        </nav>
      </header>

      <main className="site-content">
        {page === 'home' && <HomePage setPage={setPage} />}
        {page === 'medicines' && <MedicineListPage onSelectMedicine={handleViewMedicine} />}
        {page === 'detail' && <MedicineDetailPage medicineId={selectedMedicine} userId={userId} setPage={setPage} />}
        {page === 'cart' && <CartPage userId={userId} setPage={setPage} />}
        {page === 'checkout' && <CheckoutPage userId={userId} setPage={setPage} />}
        {page === 'prescription' && <PrescriptionPage userId={userId} />}
      </main>
    </div>
  );
}

export default App;
