import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { FaLeaf, FaThermometerHalf, FaCalendarAlt, FaChartLine, FaSeedling, FaWater } from 'react-icons/fa';

const CropRecommendation = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    soilType: '',
    climate: '',
    season: '',
    waterAvailability: '',
    landSize: '',
    budget: '',
    experience: '',
    marketPreference: ''
  });

  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(true);

  // Soil types with characteristics
  const soilTypes = [
    { value: 'clay', label: 'Clay Soil', description: 'Heavy, retains water well, good for rice and wheat' },
    { value: 'sandy', label: 'Sandy Soil', description: 'Light, well-draining, good for root vegetables' },
    { value: 'loamy', label: 'Loamy Soil', description: 'Balanced, ideal for most crops' },
    { value: 'silt', label: 'Silt Soil', description: 'Fine particles, good for vegetables and fruits' },
    { value: 'red', label: 'Red Soil', description: 'Rich in iron, good for pulses and oilseeds' },
    { value: 'black', label: 'Black Soil', description: 'High fertility, excellent for cotton and sugarcane' }
  ];

  // Climate zones
  const climates = [
    { value: 'tropical', label: 'Tropical', description: 'Hot and humid, year-round growing' },
    { value: 'subtropical', label: 'Subtropical', description: 'Warm with distinct seasons' },
    { value: 'temperate', label: 'Temperate', description: 'Moderate temperatures, seasonal changes' },
    { value: 'arid', label: 'Arid', description: 'Hot and dry, limited rainfall' },
    { value: 'semi_arid', label: 'Semi-Arid', description: 'Moderate rainfall, drought-resistant crops' }
  ];

  // Seasons
  const seasons = [
    { value: 'kharif', label: 'Kharif (Monsoon)', description: 'June-October, rice, maize, cotton' },
    { value: 'rabi', label: 'Rabi (Winter)', description: 'October-March, wheat, barley, mustard' },
    { value: 'zaid', label: 'Zaid (Summer)', description: 'March-June, vegetables, fruits' }
  ];

  // Water availability
  const waterOptions = [
    { value: 'high', label: 'High (Irrigation available)', description: 'Can grow water-intensive crops' },
    { value: 'moderate', label: 'Moderate', description: 'Balanced water usage crops' },
    { value: 'low', label: 'Low (Rainfed)', description: 'Drought-resistant crops recommended' }
  ];

  // Experience levels
  const experienceLevels = [
    { value: 'beginner', label: 'Beginner (0-2 years)', description: 'Easy to grow crops' },
    { value: 'intermediate', label: 'Intermediate (3-5 years)', description: 'Moderate complexity crops' },
    { value: 'expert', label: 'Expert (5+ years)', description: 'Advanced farming techniques' }
  ];

  // Market preferences
  const marketPreferences = [
    { value: 'local', label: 'Local Market', description: 'Fresh produce for nearby markets' },
    { value: 'export', label: 'Export Market', description: 'High-value crops for international markets' },
    { value: 'processing', label: 'Processing Industry', description: 'Crops for food processing' },
    { value: 'organic', label: 'Organic Market', description: 'Certified organic produce' }
  ];

  // AI-based crop recommendation algorithm
  const generateRecommendations = (data) => {
    setLoading(true);
    
    // Simulate AI processing time
    setTimeout(() => {
      const recommendations = [];
      
      // Crop database with characteristics
      const cropDatabase = {
        // Cereals
        rice: {
          name: 'Rice',
          soil: ['clay', 'loamy'],
          climate: ['tropical', 'subtropical'],
          season: ['kharif'],
          water: ['high'],
          experience: ['beginner', 'intermediate'],
          market: ['local', 'export'],
          profit: 'High',
          risk: 'Low',
          duration: '120-150 days',
          investment: '₹15,000-25,000 per acre',
          yield: '2-3 tons per acre'
        },
        wheat: {
          name: 'Wheat',
          soil: ['loamy', 'clay'],
          climate: ['temperate', 'subtropical'],
          season: ['rabi'],
          water: ['moderate'],
          experience: ['beginner', 'intermediate'],
          market: ['local', 'processing'],
          profit: 'Medium',
          risk: 'Low',
          duration: '110-130 days',
          investment: '₹12,000-20,000 per acre',
          yield: '2-2.5 tons per acre'
        },
        maize: {
          name: 'Maize',
          soil: ['loamy', 'sandy'],
          climate: ['tropical', 'subtropical'],
          season: ['kharif', 'zaid'],
          water: ['moderate'],
          experience: ['beginner', 'intermediate'],
          market: ['processing', 'local'],
          profit: 'Medium',
          risk: 'Medium',
          duration: '90-110 days',
          investment: '₹10,000-18,000 per acre',
          yield: '2.5-3.5 tons per acre'
        },
        
        // Pulses
        chickpea: {
          name: 'Chickpea',
          soil: ['loamy', 'sandy'],
          climate: ['temperate', 'subtropical'],
          season: ['rabi'],
          water: ['low', 'moderate'],
          experience: ['beginner'],
          market: ['local', 'export'],
          profit: 'High',
          risk: 'Low',
          duration: '120-140 days',
          investment: '₹8,000-15,000 per acre',
          yield: '1-1.5 tons per acre'
        },
        pigeonPea: {
          name: 'Pigeon Pea',
          soil: ['loamy', 'sandy'],
          climate: ['tropical', 'subtropical'],
          season: ['kharif'],
          water: ['low'],
          experience: ['intermediate'],
          market: ['local', 'processing'],
          profit: 'Medium',
          risk: 'Low',
          duration: '150-180 days',
          investment: '₹6,000-12,000 per acre',
          yield: '1-1.2 tons per acre'
        },
        
        // Oilseeds
        groundnut: {
          name: 'Groundnut',
          soil: ['sandy', 'loamy'],
          climate: ['tropical', 'subtropical'],
          season: ['kharif', 'rabi'],
          water: ['moderate'],
          experience: ['intermediate'],
          market: ['processing', 'export'],
          profit: 'High',
          risk: 'Medium',
          duration: '120-140 days',
          investment: '₹12,000-20,000 per acre',
          yield: '1.5-2 tons per acre'
        },
        soybean: {
          name: 'Soybean',
          soil: ['loamy', 'clay'],
          climate: ['tropical', 'subtropical'],
          season: ['kharif'],
          water: ['moderate'],
          experience: ['intermediate'],
          market: ['processing', 'export'],
          profit: 'High',
          risk: 'Medium',
          duration: '90-120 days',
          investment: '₹10,000-18,000 per acre',
          yield: '1.5-2.5 tons per acre'
        },
        
        // Vegetables
        tomato: {
          name: 'Tomato',
          soil: ['loamy', 'sandy'],
          climate: ['tropical', 'subtropical'],
          season: ['zaid', 'rabi'],
          water: ['high'],
          experience: ['intermediate'],
          market: ['local', 'processing'],
          profit: 'Very High',
          risk: 'High',
          duration: '90-120 days',
          investment: '₹25,000-40,000 per acre',
          yield: '15-25 tons per acre'
        },
        onion: {
          name: 'Onion',
          soil: ['loamy', 'sandy'],
          climate: ['tropical', 'subtropical'],
          season: ['rabi'],
          water: ['moderate'],
          experience: ['beginner', 'intermediate'],
          market: ['local', 'processing'],
          profit: 'High',
          risk: 'Medium',
          duration: '90-110 days',
          investment: '₹20,000-35,000 per acre',
          yield: '8-12 tons per acre'
        },
        
        // Fruits
        mango: {
          name: 'Mango',
          soil: ['loamy', 'sandy'],
          climate: ['tropical', 'subtropical'],
          season: ['zaid'],
          water: ['moderate'],
          experience: ['expert'],
          market: ['local', 'export'],
          profit: 'Very High',
          risk: 'Medium',
          duration: '3-5 years (first harvest)',
          investment: '₹50,000-80,000 per acre',
          yield: '8-12 tons per acre (mature trees)'
        },
        
        // Cash Crops
        cotton: {
          name: 'Cotton',
          soil: ['black', 'loamy'],
          climate: ['tropical', 'subtropical'],
          season: ['kharif'],
          water: ['moderate'],
          experience: ['intermediate', 'expert'],
          market: ['processing', 'export'],
          profit: 'High',
          risk: 'Medium',
          duration: '150-180 days',
          investment: '₹15,000-25,000 per acre',
          yield: '2-3 quintals per acre'
        },
        sugarcane: {
          name: 'Sugarcane',
          soil: ['black', 'loamy'],
          climate: ['tropical', 'subtropical'],
          season: ['kharif'],
          water: ['high'],
          experience: ['intermediate', 'expert'],
          market: ['processing'],
          profit: 'Medium',
          risk: 'Low',
          duration: '12-18 months',
          investment: '₹30,000-50,000 per acre',
          yield: '60-80 tons per acre'
        }
      };

      // AI scoring algorithm
      const calculateScore = (crop, data) => {
        let score = 0;
        
        // Soil compatibility (30 points)
        if (crop.soil.includes(data.soilType)) score += 30;
        
        // Climate compatibility (25 points)
        if (crop.climate.includes(data.climate)) score += 25;
        
        // Season compatibility (20 points)
        if (crop.season.includes(data.season)) score += 20;
        
        // Water availability (15 points)
        if (crop.water.includes(data.waterAvailability)) score += 15;
        
        // Experience level (10 points)
        if (crop.experience.includes(data.experience)) score += 10;
        
        // Market preference bonus
        if (crop.market.includes(data.marketPreference)) score += 5;
        
        return score;
      };

      // Generate recommendations
      Object.entries(cropDatabase).forEach(([key, crop]) => {
        const score = calculateScore(crop, data);
        if (score >= 50) { // Minimum threshold
          recommendations.push({
            ...crop,
            score,
            key,
            suitability: score >= 80 ? 'Excellent' : score >= 60 ? 'Good' : 'Fair'
          });
        }
      });

      // Sort by score and take top 5
      recommendations.sort((a, b) => b.score - a.score);
      setRecommendations(recommendations.slice(0, 5));
      setLoading(false);
      setShowForm(false);
    }, 2000);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    generateRecommendations(formData);
  };

  const resetForm = () => {
    setFormData({
      soilType: '',
      climate: '',
      season: '',
      waterAvailability: '',
      landSize: '',
      budget: '',
      experience: '',
      marketPreference: ''
    });
    setRecommendations([]);
    setShowForm(true);
  };

  return (
    <div style={container}>
      <div style={header}>
        <FaSeedling style={{ fontSize: 32, color: '#28a745', marginRight: 12 }} />
        <h1 style={title}>{t('ai_crop_recommendations') || 'AI Crop Recommendations'}</h1>
      </div>
      
      <p style={description}>
        {t('crop_recommendation_description') || 
         'Get personalized crop recommendations based on your soil type, climate, season, and farming experience. Our AI analyzes multiple factors to suggest the most profitable and suitable crops for your farm.'}
      </p>

      {showForm ? (
        <form onSubmit={handleSubmit} style={formStyle}>
          <div style={formGrid}>
            {/* Soil Type */}
            <div style={inputGroup}>
              <label style={label}>
                <FaLeaf style={{ marginRight: 8 }} />
                {t('soil_type') || 'Soil Type'}
              </label>
              <select 
                value={formData.soilType} 
                onChange={(e) => handleInputChange('soilType', e.target.value)}
                style={select}
                required
              >
                <option value="">{t('select_soil_type') || 'Select Soil Type'}</option>
                {soilTypes.map(soil => (
                  <option key={soil.value} value={soil.value}>
                    {soil.label} - {soil.description}
                  </option>
                ))}
              </select>
            </div>

            {/* Climate */}
            <div style={inputGroup}>
              <label style={label}>
                <FaThermometerHalf style={{ marginRight: 8 }} />
                {t('climate') || 'Climate'}
              </label>
              <select 
                value={formData.climate} 
                onChange={(e) => handleInputChange('climate', e.target.value)}
                style={select}
                required
              >
                <option value="">{t('select_climate') || 'Select Climate'}</option>
                {climates.map(climate => (
                  <option key={climate.value} value={climate.value}>
                    {climate.label} - {climate.description}
                  </option>
                ))}
              </select>
            </div>

            {/* Season */}
            <div style={inputGroup}>
              <label style={label}>
                <FaCalendarAlt style={{ marginRight: 8 }} />
                {t('season') || 'Season'}
              </label>
              <select 
                value={formData.season} 
                onChange={(e) => handleInputChange('season', e.target.value)}
                style={select}
                required
              >
                <option value="">{t('select_season') || 'Select Season'}</option>
                {seasons.map(season => (
                  <option key={season.value} value={season.value}>
                    {season.label} - {season.description}
                  </option>
                ))}
              </select>
            </div>

            {/* Water Availability */}
            <div style={inputGroup}>
              <label style={label}>
                <FaWater style={{ marginRight: 8 }} />
                {t('water_availability') || 'Water Availability'}
              </label>
              <select 
                value={formData.waterAvailability} 
                onChange={(e) => handleInputChange('waterAvailability', e.target.value)}
                style={select}
                required
              >
                <option value="">{t('select_water_availability') || 'Select Water Availability'}</option>
                {waterOptions.map(water => (
                  <option key={water.value} value={water.value}>
                    {water.label} - {water.description}
                  </option>
                ))}
              </select>
            </div>

            {/* Land Size */}
            <div style={inputGroup}>
              <label style={label}>
                {t('land_size') || 'Land Size (Acres)'}
              </label>
              <input 
                type="number" 
                value={formData.landSize} 
                onChange={(e) => handleInputChange('landSize', e.target.value)}
                style={input}
                placeholder="Enter land size in acres"
                min="0.1"
                step="0.1"
              />
            </div>

            {/* Budget */}
            <div style={inputGroup}>
              <label style={label}>
                {t('budget') || 'Budget per Acre (₹)'}
              </label>
              <input 
                type="number" 
                value={formData.budget} 
                onChange={(e) => handleInputChange('budget', e.target.value)}
                style={input}
                placeholder="Enter budget in ₹"
                min="1000"
                step="1000"
              />
            </div>

            {/* Experience Level */}
            <div style={inputGroup}>
              <label style={label}>
                {t('farming_experience') || 'Farming Experience'}
              </label>
              <select 
                value={formData.experience} 
                onChange={(e) => handleInputChange('experience', e.target.value)}
                style={select}
                required
              >
                <option value="">{t('select_experience') || 'Select Experience Level'}</option>
                {experienceLevels.map(exp => (
                  <option key={exp.value} value={exp.value}>
                    {exp.label} - {exp.description}
                  </option>
                ))}
              </select>
            </div>

            {/* Market Preference */}
            <div style={inputGroup}>
              <label style={label}>
                <FaChartLine style={{ marginRight: 8 }} />
                {t('market_preference') || 'Market Preference'}
              </label>
              <select 
                value={formData.marketPreference} 
                onChange={(e) => handleInputChange('marketPreference', e.target.value)}
                style={select}
                required
              >
                <option value="">{t('select_market') || 'Select Market Preference'}</option>
                {marketPreferences.map(market => (
                  <option key={market.value} value={market.value}>
                    {market.label} - {market.description}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button type="submit" style={submitButton}>
            {t('get_recommendations') || 'Get AI Recommendations'}
          </button>
        </form>
      ) : (
        <div style={resultsContainer}>
          {loading ? (
            <div style={loadingStyle}>
              <div style={spinner}></div>
              <p>{t('analyzing_data') || 'Analyzing your farm data...'}</p>
              <p style={{ fontSize: '14px', color: '#666' }}>
                {t('ai_processing') || 'Our AI is processing soil, climate, and market data to find the best crops for you.'}
              </p>
            </div>
          ) : (
            <>
              <div style={resultsHeader}>
                <h2>{t('your_recommendations') || 'Your Personalized Crop Recommendations'}</h2>
                <button onClick={resetForm} style={resetButton}>
                  {t('new_analysis') || 'New Analysis'}
                </button>
              </div>

              <div style={recommendationsGrid}>
                {recommendations.map((crop, index) => (
                  <div key={crop.key} style={cropCard}>
                    <div style={cardHeader}>
                      <h3 style={cropName}>{crop.name}</h3>
                      <div style={scoreBadge(crop.suitability)}>
                        {crop.score}/100
                      </div>
                    </div>
                    
                    <div style={suitabilityBadge(crop.suitability)}>
                      {crop.suitability} Match
                    </div>

                    <div style={cropDetails}>
                      <div style={detailRow}>
                        <span style={detailLabel}>{t('profit_potential') || 'Profit Potential'}:</span>
                        <span style={profitBadge(crop.profit)}>{crop.profit}</span>
                      </div>
                      
                      <div style={detailRow}>
                        <span style={detailLabel}>{t('risk_level') || 'Risk Level'}:</span>
                        <span style={riskBadge(crop.risk)}>{crop.risk}</span>
                      </div>
                      
                      <div style={detailRow}>
                        <span style={detailLabel}>{t('duration') || 'Duration'}:</span>
                        <span>{crop.duration}</span>
                      </div>
                      
                      <div style={detailRow}>
                        <span style={detailLabel}>{t('investment') || 'Investment'}:</span>
                        <span>{crop.investment}</span>
                      </div>
                      
                      <div style={detailRow}>
                        <span style={detailLabel}>{t('expected_yield') || 'Expected Yield'}:</span>
                        <span>{crop.yield}</span>
                      </div>
                    </div>

                    <div style={cardActions}>
                      <button style={primaryButton}>
                        {t('view_details') || 'View Details'}
                      </button>
                      <button style={secondaryButton}>
                        {t('add_to_plan') || 'Add to Plan'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div style={insightsSection}>
                <h3>{t('ai_insights') || 'AI Insights'}</h3>
                <div style={insightsGrid}>
                  <div style={insightCard}>
                    <h4>{t('market_trends') || 'Market Trends'}</h4>
                    <p>{t('market_insight') || 'Current market prices are favorable for pulses and oilseeds. Consider diversifying your crop portfolio.'}</p>
                  </div>
                  <div style={insightCard}>
                    <h4>{t('weather_forecast') || 'Weather Forecast'}</h4>
                    <p>{t('weather_insight') || 'Expected normal monsoon this year. Good conditions for kharif crops like rice and maize.'}</p>
                  </div>
                  <div style={insightCard}>
                    <h4>{t('soil_health') || 'Soil Health'}</h4>
                    <p>{t('soil_insight') || 'Your soil type is suitable for multiple crops. Consider crop rotation to maintain soil fertility.'}</p>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

// Styles
const container = {
  maxWidth: '1200px',
  margin: '0 auto',
  padding: '20px',
  fontFamily: 'Arial, sans-serif'
};

const header = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: '20px',
  textAlign: 'center'
};

const title = {
  fontSize: '2.5em',
  color: '#22543d',
  margin: 0
};

const description = {
  textAlign: 'center',
  fontSize: '16px',
  color: '#666',
  marginBottom: '30px',
  lineHeight: '1.6'
};

const formStyle = {
  background: '#fff',
  padding: '30px',
  borderRadius: '12px',
  boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
  marginBottom: '30px'
};

const formGrid = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
  gap: '20px',
  marginBottom: '30px'
};

const inputGroup = {
  display: 'flex',
  flexDirection: 'column'
};

const label = {
  fontWeight: '600',
  marginBottom: '8px',
  color: '#333',
  display: 'flex',
  alignItems: 'center'
};

const input = {
  padding: '12px',
  border: '1px solid #ddd',
  borderRadius: '6px',
  fontSize: '16px'
};

const select = {
  padding: '12px',
  border: '1px solid #ddd',
  borderRadius: '6px',
  fontSize: '16px',
  backgroundColor: '#fff'
};

const submitButton = {
  background: '#28a745',
  color: '#fff',
  padding: '15px 30px',
  border: 'none',
  borderRadius: '8px',
  fontSize: '18px',
  fontWeight: '600',
  cursor: 'pointer',
  width: '100%',
  transition: 'background 0.3s'
};

const resultsContainer = {
  background: '#fff',
  padding: '30px',
  borderRadius: '12px',
  boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
};

const loadingStyle = {
  textAlign: 'center',
  padding: '60px 20px'
};

const spinner = {
  width: '50px',
  height: '50px',
  border: '4px solid #f3f3f3',
  borderTop: '4px solid #28a745',
  borderRadius: '50%',
  animation: 'spin 1s linear infinite',
  margin: '0 auto 20px'
};

const resultsHeader = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '30px'
};

const resetButton = {
  background: '#6c757d',
  color: '#fff',
  padding: '10px 20px',
  border: 'none',
  borderRadius: '6px',
  cursor: 'pointer'
};

const recommendationsGrid = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
  gap: '20px',
  marginBottom: '30px'
};

const cropCard = {
  border: '1px solid #e0e0e0',
  borderRadius: '12px',
  padding: '20px',
  background: '#fff',
  boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
  transition: 'transform 0.2s',
  cursor: 'pointer'
};

const cardHeader = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '15px'
};

const cropName = {
  margin: 0,
  fontSize: '1.5em',
  color: '#22543d'
};

const scoreBadge = (suitability) => ({
  background: suitability === 'Excellent' ? '#28a745' : suitability === 'Good' ? '#ffc107' : '#dc3545',
  color: '#fff',
  padding: '4px 12px',
  borderRadius: '20px',
  fontSize: '14px',
  fontWeight: '600'
});

const suitabilityBadge = (suitability) => ({
  background: suitability === 'Excellent' ? '#d4edda' : suitability === 'Good' ? '#fff3cd' : '#f8d7da',
  color: suitability === 'Excellent' ? '#155724' : suitability === 'Good' ? '#856404' : '#721c24',
  padding: '6px 12px',
  borderRadius: '6px',
  fontSize: '14px',
  fontWeight: '600',
  marginBottom: '15px',
  display: 'inline-block'
});

const cropDetails = {
  marginBottom: '20px'
};

const detailRow = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '8px',
  padding: '4px 0'
};

const detailLabel = {
  fontWeight: '600',
  color: '#666'
};

const profitBadge = (profit) => ({
  background: profit === 'Very High' ? '#28a745' : profit === 'High' ? '#20c997' : '#ffc107',
  color: '#fff',
  padding: '2px 8px',
  borderRadius: '4px',
  fontSize: '12px',
  fontWeight: '600'
});

const riskBadge = (risk) => ({
  background: risk === 'Low' ? '#28a745' : risk === 'Medium' ? '#ffc107' : '#dc3545',
  color: '#fff',
  padding: '2px 8px',
  borderRadius: '4px',
  fontSize: '12px',
  fontWeight: '600'
});

const cardActions = {
  display: 'flex',
  gap: '10px'
};

const primaryButton = {
  background: '#007bff',
  color: '#fff',
  padding: '8px 16px',
  border: 'none',
  borderRadius: '6px',
  cursor: 'pointer',
  flex: 1
};

const secondaryButton = {
  background: '#6c757d',
  color: '#fff',
  padding: '8px 16px',
  border: 'none',
  borderRadius: '6px',
  cursor: 'pointer',
  flex: 1
};

const insightsSection = {
  marginTop: '40px',
  padding: '20px',
  background: '#f8f9fa',
  borderRadius: '8px'
};

const insightsGrid = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
  gap: '20px',
  marginTop: '20px'
};

const insightCard = {
  background: '#fff',
  padding: '15px',
  borderRadius: '8px',
  border: '1px solid #e0e0e0'
};

// Add CSS animation
const style = document.createElement('style');
style.textContent = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;
document.head.appendChild(style);

export default CropRecommendation; 