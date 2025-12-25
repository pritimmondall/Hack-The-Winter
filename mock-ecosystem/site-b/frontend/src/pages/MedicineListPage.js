import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/pages.css';

function MedicineListPage({ onSelectMedicine }) {
  const [medicines, setMedicines] = useState([]);

  useEffect(() => {
    axios.get('/api/medicines')
      .then(res => setMedicines(res.data.medicines))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="medicine-list-page">
      <h2>All Medicines - Site B</h2>
      <div className="medicines-grid">
        {medicines.map(medicine => (
          <div key={medicine.id} className="medicine-card">
            <h3>{medicine.name}</h3>
            <p className="price">₹{medicine.price}</p>
            <p className="delivery">📦 {medicine.delivery}</p>
            <p className="rating">⭐ {medicine.rating}</p>
            <p className="description">{medicine.description}</p>
            <button onClick={() => onSelectMedicine(medicine.id)} className="view-btn">
              View Details
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MedicineListPage;
