import React from 'react';
import '../styles/pages.css';

function HomePage({ setPage }) {
  return (
    <div className="home-page">
      <div className="hero">
        <h2>Welcome to Site B - Budget Medicine Store</h2>
        <p>Affordable medicines for everyone. Great value, no compromise.</p>
        <button onClick={() => setPage('medicines')} className="cta-button">
          Shop Now
        </button>
      </div>
      <div className="features">
        <div className="feature">
          <h3>💵 Best Prices</h3>
          <p>Lowest prices in market</p>
        </div>
        <div className="feature">
          <h3>📦 Reliable</h3>
          <p>Trusted medicine source</p>
        </div>
        <div className="feature">
          <h3>✅ Authentic</h3>
          <p>Genuine medicines only</p>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
