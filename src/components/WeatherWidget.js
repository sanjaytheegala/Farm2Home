import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { FaThermometerHalf, FaTint, FaWind, FaSun, FaCloud, FaCloudRain, FaCloudSun } from 'react-icons/fa';
import weatherService from '../services/weatherService';

const WeatherWidget = ({ location = 'Hyderabad' }) => {
  const [weatherData, setWeatherData] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { t } = useTranslation();

  useEffect(() => {
    const fetchWeatherData = async () => {
      setLoading(true);
      try {
        const data = await weatherService.getWeatherData(location);
        setWeatherData(data.current);
        setForecast(data.forecast);
        setError(null);
      } catch (err) {
        setError('Failed to fetch weather data');
      } finally {
        setLoading(false);
      }
    };

    fetchWeatherData();
  }, [location]);

  const getWeatherIcon = (condition) => {
    switch (condition) {
      case 'sunny':
        return <FaSun style={{ color: '#FFD700', fontSize: '24px' }} />;
      case 'cloudy':
        return <FaCloud style={{ color: '#87CEEB', fontSize: '24px' }} />;
      case 'rainy':
        return <FaCloudRain style={{ color: '#4682B4', fontSize: '24px' }} />;
      case 'partly-cloudy':
        return <FaCloudSun style={{ color: '#FFD700', fontSize: '24px' }} />;
      default:
        return <FaSun style={{ color: '#FFD700', fontSize: '24px' }} />;
    }
  };

  const getWeatherAdvice = () => {
    if (!weatherData) return '';
    return weatherService.getFarmingAdvice(weatherData);
  };

  if (loading) {
    return (
      <div style={widgetContainer}>
        <div style={loadingStyle}>
          <div style={spinner}></div>
          <p>Loading weather data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={widgetContainer}>
        <div style={errorStyle}>
          <p>⚠️ {error}</p>
          <button onClick={() => window.location.reload()} style={retryButton}>
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={widgetContainer}>
      <div style={header}>
        <h3 style={title}>🌤️ {t('weather_forecast') || 'Weather Forecast'}</h3>
        <span style={locationText}>{location}</span>
      </div>

      {/* Current Weather */}
      <div style={currentWeather}>
        <div style={currentInfo}>
          <div style={tempSection}>
            <span style={tempValue}>{weatherData.temp}°C</span>
            <span style={feelsLike}>Feels like {weatherData.feelsLike}°C</span>
          </div>
          <div style={weatherIcon}>
            {getWeatherIcon(weatherData.condition)}
          </div>
        </div>

        <div style={weatherDetails}>
          <div style={detailItem}>
            <FaTint style={{ color: '#4682B4' }} />
            <span>{weatherData.humidity}%</span>
            <span style={detailLabel}>Humidity</span>
          </div>
          <div style={detailItem}>
            <FaWind style={{ color: '#87CEEB' }} />
            <span>{weatherData.windSpeed} km/h</span>
            <span style={detailLabel}>Wind</span>
          </div>
          <div style={detailItem}>
            <FaThermometerHalf style={{ color: '#FF6B6B' }} />
            <span>{weatherData.pressure} hPa</span>
            <span style={detailLabel}>Pressure</span>
          </div>
        </div>
      </div>

      {/* Weather Advice */}
      <div style={adviceContainer}>
        <h4 style={adviceTitle}>🌾 Farming Advice</h4>
        <p style={adviceText}>{getWeatherAdvice()}</p>
      </div>

      {/* 5-Day Forecast */}
      <div style={forecastContainer}>
        <h4 style={forecastTitle}>📅 5-Day Forecast</h4>
        <div style={forecastGrid}>
          {forecast.map((day, index) => (
            <div key={index} style={forecastDay}>
              <div style={dayName}>{day.day}</div>
              <div style={dayIcon}>{getWeatherIcon(day.condition)}</div>
              <div style={dayTemp}>{day.temp}°C</div>
              <div style={dayDetails}>
                <span>💧 {day.humidity}%</span>
                <span>💨 {day.windSpeed} km/h</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Styles
const widgetContainer = {
  backgroundColor: '#fff',
  borderRadius: '12px',
  padding: '20px',
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  marginBottom: '20px'
};

const header = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '20px',
  borderBottom: '1px solid #eee',
  paddingBottom: '10px'
};

const title = {
  margin: 0,
  fontSize: '18px',
  fontWeight: '600',
  color: '#333'
};

const locationText = {
  fontSize: '14px',
  color: '#666',
  backgroundColor: '#f0f0f0',
  padding: '4px 8px',
  borderRadius: '4px'
};

const currentWeather = {
  marginBottom: '20px'
};

const currentInfo = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '15px'
};

const tempSection = {
  display: 'flex',
  flexDirection: 'column'
};

const tempValue = {
  fontSize: '32px',
  fontWeight: 'bold',
  color: '#333'
};

const feelsLike = {
  fontSize: '14px',
  color: '#666',
  marginTop: '4px'
};

const weatherIcon = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
};

const weatherDetails = {
  display: 'grid',
  gridTemplateColumns: 'repeat(3, 1fr)',
  gap: '15px'
};

const detailItem = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  textAlign: 'center',
  padding: '10px',
  backgroundColor: '#f8f9fa',
  borderRadius: '8px'
};

const detailLabel = {
  fontSize: '12px',
  color: '#666',
  marginTop: '4px'
};

const adviceContainer = {
  backgroundColor: '#e8f5e8',
  padding: '15px',
  borderRadius: '8px',
  marginBottom: '20px',
  border: '1px solid #d4edda'
};

const adviceTitle = {
  margin: '0 0 10px 0',
  fontSize: '16px',
  fontWeight: '600',
  color: '#155724'
};

const adviceText = {
  margin: 0,
  fontSize: '14px',
  color: '#155724',
  lineHeight: '1.4'
};

const forecastContainer = {
  marginTop: '20px'
};

const forecastTitle = {
  margin: '0 0 15px 0',
  fontSize: '16px',
  fontWeight: '600',
  color: '#333'
};

const forecastGrid = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
  gap: '15px'
};

const forecastDay = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: '15px',
  backgroundColor: '#f8f9fa',
  borderRadius: '8px',
  border: '1px solid #e9ecef'
};

const dayName = {
  fontSize: '14px',
  fontWeight: '600',
  color: '#333',
  marginBottom: '8px'
};

const dayIcon = {
  marginBottom: '8px'
};

const dayTemp = {
  fontSize: '16px',
  fontWeight: 'bold',
  color: '#333',
  marginBottom: '8px'
};

const dayDetails = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  fontSize: '12px',
  color: '#666',
  gap: '2px'
};

const loadingStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '40px 20px'
};

const spinner = {
  width: '40px',
  height: '40px',
  border: '4px solid #f3f3f3',
  borderTop: '4px solid #28a745',
  borderRadius: '50%',
  animation: 'spin 1s linear infinite',
  marginBottom: '15px'
};

const errorStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: '20px',
  color: '#721c24',
  backgroundColor: '#f8d7da',
  borderRadius: '8px',
  border: '1px solid #f5c6cb'
};

const retryButton = {
  backgroundColor: '#dc3545',
  color: '#fff',
  border: 'none',
  padding: '8px 16px',
  borderRadius: '4px',
  cursor: 'pointer',
  marginTop: '10px',
  fontSize: '14px'
};

// Add spinner animation
const style = document.createElement('style');
style.textContent = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;
document.head.appendChild(style);

export default WeatherWidget; 