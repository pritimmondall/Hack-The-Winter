import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/pages.css';

function CheckoutPage({ userId, setPage }) {
  const [order, setOrder] = useState(null);

  const handleCheckout = () => {
    axios.post(`/api/checkout/${userId}`)
      .then(res => {
        setOrder(res.data.order);
      })
      .catch(err => console.error(err));
  };

  if (order) {
    return (
      <div className="checkout-page">
        <div className="order-confirmation">
          <h2>✅ Order Confirmed!</h2>
          <p><strong>Order ID:</strong> {order.orderId}</p>
          <p><strong>Total:</strong> ₹{order.total}</p>
          <p><strong>Status:</strong> {order.status}</p>
          <div className="order-items">
            <h3>Items:</h3>
            {order.items.map(item => (
              <div key={item.id} className="order-item">
                {item.name} x {item.quantity} = ₹{item.price * item.quantity}
              </div>
            ))}
          </div>
          <button onClick={() => setPage('home')} className="back-btn">
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <h2>Checkout</h2>
      <p>Review your order and proceed</p>
      <button onClick={handleCheckout} className="confirm-btn">
        Confirm Order
      </button>
    </div>
  );
}

export default CheckoutPage;
