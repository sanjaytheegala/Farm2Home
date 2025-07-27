import React from 'react';
import CropRecommendation from '../components/CropRecommendation';
import Navbar from '../components/Navbar';

const CropRecommendationPage = () => {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f4f4f4' }}>
      <Navbar />
      <div style={{ paddingTop: '80px' }}>
        <CropRecommendation />
      </div>
    </div>
  );
};

export default CropRecommendationPage; 