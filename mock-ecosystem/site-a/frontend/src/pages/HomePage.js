import React from 'react';
import '../styles/pages.css';

function HomePage({ setPage }) {
  return (
    <div className="home-page">
      <div className="hero">
        <h2>Welcome to Site A - Premium Health Store</h2>
        <p>Quality medicines at premium prices. Fast delivery guaranteed.</p>
        <button onClick={() => setPage('medicines')} className="cta-button">
          Browse Medicines
        </button>
      </div>
      <div className="features">
        <div className="feature">
          <h3>⚡ Fast Delivery</h3>
          <p>1-2 days delivery</p>
        </div>
        <div className="feature">
          <h3>✨ Premium Quality</h3>
          <p>Highest rated medicines</p>
        </div>
        <div className="feature">
          <h3>🔒 Safe & Secure</h3>
          <p>Certified medications</p>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
