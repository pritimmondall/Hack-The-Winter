import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/pages.css';

function CartPage({ userId, setPage }) {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = () => {
    axios.get(`/api/cart/${userId}`)
      .then(res => setCart(res.data.cart))
      .catch(err => console.error(err));
  };

  const handleRemove = (medicineId) => {
    axios.delete(`/api/cart/${userId}/${medicineId}`)
      .then(() => fetchCart())
      .catch(err => console.error(err));
  };

  const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <div className="cart-page">
      <h2>Shopping Cart - Site B</h2>
      {cart.length === 0 ? (
        <p>Your cart is empty</p>
      ) : (
        <div className="cart-container">
          <table className="cart-table">
            <thead>
              <tr>
                <th>Medicine</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Subtotal</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {cart.map(item => (
                <tr key={item.id}>
                  <td>{item.name}</td>
                  <td>₹{item.price}</td>
                  <td>{item.quantity}</td>
                  <td>₹{item.price * item.quantity}</td>
                  <td>
                    <button onClick={() => handleRemove(item.id)} className="remove-btn">
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="cart-summary">
            <h3>Total: ₹{totalPrice}</h3>
            <button onClick={() => setPage('checkout')} className="checkout-btn">
              Proceed to Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default CartPage;
