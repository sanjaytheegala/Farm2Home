import React, { useState } from 'react';
import Navbar from '../components/Navbar';

const ConsumerDashboard = () => {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div style={{ minHeight: '100vh' }}>
      <Navbar />
      <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header Section */}
        <div style={headerSection}>
          <h1 style={welcomeTitle}>Welcome to Consumer Dashboard</h1>
          <p style={welcomeSubtitle}>Find fresh produce from local farmers</p>
        </div>

        {/* Search Section */}
        <div style={searchSection}>
          <input
            type="text"
            placeholder="Search for products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={searchInput}
          />
        </div>

        {/* Coming Soon Section */}
        <div style={comingSoonSection}>
          <div style={comingSoonCard}>
            <h2 style={comingSoonTitle}>🚧 Under Construction</h2>
            <p style={comingSoonText}>
              We're working hard to bring you the best shopping experience. 
              Product listings will be available soon!
            </p>
            <div style={featuresList}>
              <div style={featureItem}>🍎 Fresh Fruits</div>
              <div style={featureItem}>🥕 Organic Vegetables</div>
              <div style={featureItem}>🌾 Grains & Pulses</div>
              <div style={featureItem}>🥜 Dry Fruits & Nuts</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Styles
const headerSection = {
  textAlign: 'center',
  padding: '40px 20px',
  backgroundColor: 'white',
  borderRadius: '12px',
  boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
  marginBottom: '30px',
  marginTop: '100px'
};

const welcomeTitle = {
  fontSize: '2.5rem',
  fontWeight: 'bold',
  color: '#333',
  marginBottom: '10px'
};

const welcomeSubtitle = {
  fontSize: '1.2rem',
  color: '#666',
  margin: 0
};

const searchSection = {
  display: 'flex',
  justifyContent: 'center',
  marginBottom: '40px'
};

const searchInput = {
  padding: '15px 20px',
  fontSize: '16px',
  width: '100%',
  maxWidth: '500px',
  borderRadius: '25px',
  border: '2px solid #ddd',
  outline: 'none',
  boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
  transition: 'all 0.3s ease'
};

const comingSoonSection = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  minHeight: '400px'
};

const comingSoonCard = {
  backgroundColor: 'white',
  borderRadius: '20px',
  padding: '60px 40px',
  textAlign: 'center',
  boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
  maxWidth: '600px',
  width: '100%'
};

const comingSoonTitle = {
  fontSize: '2.5rem',
  color: '#333',
  marginBottom: '20px',
  fontWeight: 'bold'
};

const comingSoonText = {
  fontSize: '1.2rem',
  color: '#666',
  marginBottom: '40px',
  lineHeight: '1.6'
};

const featuresList = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
  gap: '20px',
  marginTop: '30px'
};

const featureItem = {
  padding: '20px',
  backgroundColor: '#f8f9fa',
  borderRadius: '12px',
  fontSize: '1.1rem',
  fontWeight: '600',
  color: '#333',
  transition: 'all 0.3s ease'
};

export default ConsumerDashboard;