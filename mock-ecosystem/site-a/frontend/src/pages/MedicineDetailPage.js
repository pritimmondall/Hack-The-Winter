import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/pages.css';

function MedicineDetailPage({ medicineId, userId, setPage }) {
  const [medicine, setMedicine] = useState(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    axios.get(`/api/medicines/${medicineId}`)
      .then(res => setMedicine(res.data.medicine))
      .catch(err => console.error(err));
  }, [medicineId]);

  const handleAddToCart = () => {
    axios.post(`/api/cart/${userId}`, {
      medicineId: medicine.id,
      quantity: parseInt(quantity)
    })
    .then(() => {
      alert('Added to cart!');
      setPage('medicines');
    })
    .catch(err => console.error(err));
  };

  if (!medicine) return <div>Loading...</div>;

  return (
    <div className="medicine-detail-page">
      <h2>{medicine.name}</h2>
      <div className="detail-container">
        <div className="medicine-info">
          <p><strong>Price:</strong> ₹{medicine.price}</p>
          <p><strong>Delivery:</strong> {medicine.delivery}</p>
          <p><strong>Rating:</strong> ⭐ {medicine.rating}</p>
          <p><strong>Description:</strong> {medicine.description}</p>
        </div>
        <div className="quantity-selector">
          <label>Quantity:</label>
          <select value={quantity} onChange={(e) => setQuantity(e.target.value)}>
            {[1, 2, 3, 4, 5].map(q => <option key={q} value={q}>{q}</option>)}
          </select>
        </div>
        <button onClick={handleAddToCart} className="add-to-cart-btn">
          Add to Cart
        </button>
      </div>
    </div>
  );
}

export default MedicineDetailPage;
