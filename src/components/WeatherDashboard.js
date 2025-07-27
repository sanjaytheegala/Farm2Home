import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { FaThermometerHalf, FaTint, FaWind, FaSun, FaCloud, FaCloudRain, FaCloudSun, FaCalendarAlt, FaSeedling, FaExclamationTriangle } from 'react-icons/fa';
import weatherService from '../services/weatherService';
import WeatherWidget from './WeatherWidget';

const WeatherDashboard = ({ location = 'Hyderabad' }) => {
  const [seasonalAdvice, setSeasonalAdvice] = useState('');
  const [cropRecommendations, setCropRecommendations] = useState([]);
  const [weatherAlerts, setWeatherAlerts] = useState([]);
  const { t } = useTranslation();

  useEffect(() => {
    // Get seasonal recommendations
    const currentMonth = new Date().getMonth() + 1;
    setSeasonalAdvice(weatherService.getSeasonalRecommendations(currentMonth));

    // Generate crop-specific recommendations
    const crops = ['Rice', 'Wheat', 'Cotton', 'Maize'];
    const recommendations = crops.map(crop => ({
      crop,
      recommendation: weatherService.getCropWeatherRecommendations(crop, {
        temp: 32,
        humidity: 65,
        windSpeed: 12,
        condition: 'sunny'
      })
    }));
    setCropRecommendations(recommendations);

    // Generate weather alerts
    const alerts = [];
    if (32 > 35) alerts.push('High temperature alert - Increase irrigation');
    if (65 > 80) alerts.push('High humidity alert - Monitor for fungal diseases');
    if (12 > 15) alerts.push('Strong winds alert - Secure crops');
    setWeatherAlerts(alerts);
  }, [location]);

  return (
    <div style={dashboardContainer}>
      {/* Main Weather Widget */}
      <div style={mainSection}>
        <WeatherWidget location={location} />
      </div>

      {/* Additional Weather Insights */}
      <div style={insightsGrid}>
        {/* Seasonal Recommendations */}
        <div style={insightCard}>
          <div style={cardHeader}>
            <FaCalendarAlt style={{ color: '#28a745', fontSize: '20px' }} />
            <h3 style={cardTitle}>Seasonal Farming Guide</h3>
          </div>
          <div style={cardContent}>
            <p style={adviceText}>{seasonalAdvice}</p>
          </div>
        </div>

        {/* Crop-Specific Weather Advice */}
        <div style={insightCard}>
          <div style={cardHeader}>
            <FaSeedling style={{ color: '#28a745', fontSize: '20px' }} />
            <h3 style={cardTitle}>Crop Weather Recommendations</h3>
          </div>
          <div style={cardContent}>
            {cropRecommendations.map((item, index) => (
              <div key={index} style={cropItem}>
                <strong style={cropName}>{item.crop}:</strong>
                <p style={cropAdvice}>{item.recommendation}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Weather Alerts */}
        <div style={insightCard}>
          <div style={cardHeader}>
            <FaExclamationTriangle style={{ color: '#dc3545', fontSize: '20px' }} />
            <h3 style={cardTitle}>Weather Alerts</h3>
          </div>
          <div style={cardContent}>
            {weatherAlerts.length > 0 ? (
              <ul style={alertList}>
                {weatherAlerts.map((alert, index) => (
                  <li key={index} style={alertItem}>⚠️ {alert}</li>
                ))}
              </ul>
            ) : (
              <p style={noAlerts}>No weather alerts at this time.</p>
            )}
          </div>
        </div>

        {/* Weather Tips */}
        <div style={insightCard}>
          <div style={cardHeader}>
            <FaSun style={{ color: '#FFD700', fontSize: '20px' }} />
            <h3 style={cardTitle}>Weather Tips</h3>
          </div>
          <div style={cardContent}>
            <ul style={tipsList}>
              <li style={tipItem}>🌡️ Monitor temperature for optimal crop growth</li>
              <li style={tipItem}>💧 Adjust irrigation based on humidity levels</li>
              <li style={tipItem}>💨 Avoid spraying during high winds</li>
              <li style={tipItem}>☔ Plan activities around rain forecasts</li>
              <li style={tipItem}>🌱 Choose crops suitable for current conditions</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Weather Data Summary */}
      <div style={summarySection}>
        <h3 style={summaryTitle}>Weather Data Summary</h3>
        <div style={summaryGrid}>
          <div style={summaryItem}>
            <FaThermometerHalf style={{ color: '#FF6B6B', fontSize: '24px' }} />
            <div>
              <h4>Temperature Range</h4>
              <p>Optimal: 20-30°C for most crops</p>
            </div>
          </div>
          <div style={summaryItem}>
            <FaTint style={{ color: '#4682B4', fontSize: '24px' }} />
            <div>
              <h4>Humidity Range</h4>
              <p>Ideal: 60-80% for most crops</p>
            </div>
          </div>
          <div style={summaryItem}>
            <FaWind style={{ color: '#87CEEB', fontSize: '24px' }} />
            <div>
              <h4>Wind Speed</h4>
              <p>Safe: Below 15 km/h for spraying</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Styles
const dashboardContainer = {
  padding: '20px',
  maxWidth: '1400px',
  margin: '0 auto'
};

const mainSection = {
  marginBottom: '30px'
};

const insightsGrid = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
  gap: '20px',
  marginBottom: '30px'
};

const insightCard = {
  backgroundColor: '#fff',
  borderRadius: '12px',
  padding: '20px',
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  border: '1px solid #e9ecef'
};

const cardHeader = {
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  marginBottom: '15px',
  borderBottom: '1px solid #eee',
  paddingBottom: '10px'
};

const cardTitle = {
  margin: 0,
  fontSize: '18px',
  fontWeight: '600',
  color: '#333'
};

const cardContent = {
  fontSize: '14px',
  lineHeight: '1.5',
  color: '#555'
};

const adviceText = {
  margin: 0,
  fontSize: '14px',
  lineHeight: '1.6'
};

const cropItem = {
  marginBottom: '15px',
  paddingBottom: '10px',
  borderBottom: '1px solid #f0f0f0'
};

const cropName = {
  color: '#28a745',
  fontSize: '14px'
};

const cropAdvice = {
  margin: '5px 0 0 0',
  fontSize: '13px',
  color: '#666'
};

const alertList = {
  listStyle: 'none',
  padding: 0,
  margin: 0
};

const alertItem = {
  padding: '8px 0',
  borderBottom: '1px solid #f0f0f0',
  fontSize: '13px',
  color: '#dc3545'
};

const noAlerts = {
  margin: 0,
  color: '#28a745',
  fontStyle: 'italic'
};

const tipsList = {
  listStyle: 'none',
  padding: 0,
  margin: 0
};

const tipItem = {
  padding: '6px 0',
  fontSize: '13px',
  color: '#555'
};

const summarySection = {
  backgroundColor: '#fff',
  borderRadius: '12px',
  padding: '20px',
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  marginTop: '20px'
};

const summaryTitle = {
  margin: '0 0 20px 0',
  fontSize: '20px',
  fontWeight: '600',
  color: '#333',
  textAlign: 'center'
};

const summaryGrid = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
  gap: '20px'
};

const summaryItem = {
  display: 'flex',
  alignItems: 'center',
  gap: '15px',
  padding: '15px',
  backgroundColor: '#f8f9fa',
  borderRadius: '8px',
  border: '1px solid #e9ecef'
};

export default WeatherDashboard; 