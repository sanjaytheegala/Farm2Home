import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { FaLeaf, FaThermometerHalf, FaCalendarAlt, FaChartLine, FaSeedling, FaWater, FaMapMarkerAlt, FaMoneyBillWave, FaStar, FaDownload, FaBookmark, FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const CropRecommendation = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    soilType: '',
    climate: '',
    season: '',
    waterAvailability: '',
    landSize: '',
    budget: '',
    experience: '',
    marketPreference: '',
    location: ''
  });

  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(true);
  const [selectedCrop, setSelectedCrop] = useState(null);
  const [savedRecommendations, setSavedRecommendations] = useState([]);
  const [showSaved, setShowSaved] = useState(false);

  // Enhanced soil types with more details
  const soilTypes = [
    { value: 'clay', label: t('soil_clay') || 'Clay Soil', description: t('soil_clay_desc') || 'Heavy, retains water well, good for rice and wheat', characteristics: [t('soil_clay_char1') || 'High water retention', t('soil_clay_char2') || 'Rich in minerals', t('soil_clay_char3') || 'Good for paddy crops'] },
    { value: 'sandy', label: t('soil_sandy') || 'Sandy Soil', description: t('soil_sandy_desc') || 'Light, well-draining, good for root vegetables', characteristics: [t('soil_sandy_char1') || 'Fast drainage', t('soil_sandy_char2') || 'Warms quickly', t('soil_sandy_char3') || 'Good for root crops'] },
    { value: 'loamy', label: t('soil_loamy') || 'Loamy Soil', description: t('soil_loamy_desc') || 'Balanced, ideal for most crops', characteristics: [t('soil_loamy_char1') || 'Perfect balance', t('soil_loamy_char2') || 'High fertility', t('soil_loamy_char3') || 'Best for most crops'] },
    { value: 'silt', label: t('soil_silt') || 'Silt Soil', description: t('soil_silt_desc') || 'Fine particles, good for vegetables and fruits', characteristics: [t('soil_silt_char1') || 'Smooth texture', t('soil_silt_char2') || 'Good moisture retention', t('soil_silt_char3') || 'Ideal for vegetables'] },
    { value: 'red', label: t('soil_red') || 'Red Soil', description: t('soil_red_desc') || 'Rich in iron, good for pulses and oilseeds', characteristics: [t('soil_red_char1') || 'Iron rich', t('soil_red_char2') || 'Slightly acidic', t('soil_red_char3') || 'Good for pulses'] },
    { value: 'black', label: t('soil_black') || 'Black Soil', description: t('soil_black_desc') || 'High fertility, excellent for cotton and sugarcane', characteristics: [t('soil_black_char1') || 'High fertility', t('soil_black_char2') || 'Rich in minerals', t('soil_black_char3') || 'Excellent for cash crops'] }
  ];

  // Enhanced climate zones
  const climates = [
    { value: 'tropical', label: t('climate_tropical') || 'Tropical', description: t('climate_tropical_desc') || 'Hot and humid, year-round growing', characteristics: [t('climate_tropical_char1') || 'High temperature', t('climate_tropical_char2') || 'High humidity', t('climate_tropical_char3') || 'Year-round growing'] },
    { value: 'subtropical', label: t('climate_subtropical') || 'Subtropical', description: t('climate_subtropical_desc') || 'Warm with distinct seasons', characteristics: [t('climate_subtropical_char1') || 'Moderate temperature', t('climate_subtropical_char2') || 'Distinct seasons', t('climate_subtropical_char3') || 'Good for diverse crops'] },
    { value: 'temperate', label: t('climate_temperate') || 'Temperate', description: t('climate_temperate_desc') || 'Moderate temperatures, seasonal changes', characteristics: [t('climate_temperate_char1') || 'Moderate climate', t('climate_temperate_char2') || 'Seasonal changes', t('climate_temperate_char3') || 'Good for grains'] },
    { value: 'arid', label: t('climate_arid') || 'Arid', description: t('climate_arid_desc') || 'Hot and dry, limited rainfall', characteristics: [t('climate_arid_char1') || 'Low rainfall', t('climate_arid_char2') || 'High temperature', t('climate_arid_char3') || 'Drought-resistant crops'] },
    { value: 'semi_arid', label: t('climate_semi_arid') || 'Semi-Arid', description: t('climate_semi_arid_desc') || 'Moderate rainfall, drought-resistant crops', characteristics: [t('climate_semi_arid_char1') || 'Moderate rainfall', t('climate_semi_arid_char2') || 'Drought-resistant', t('climate_semi_arid_char3') || 'Mixed farming'] }
  ];

  // Enhanced seasons
  const seasons = [
    { value: 'kharif', label: t('season_kharif') || 'Kharif (Monsoon)', description: t('season_kharif_desc') || 'June-October, rice, maize, cotton', characteristics: [t('season_kharif_char1') || 'Monsoon season', t('season_kharif_char2') || 'High rainfall', t('season_kharif_char3') || 'Rice, maize, cotton'] },
    { value: 'rabi', label: t('season_rabi') || 'Rabi (Winter)', description: t('season_rabi_desc') || 'October-March, wheat, barley, mustard', characteristics: [t('season_rabi_char1') || 'Winter season', t('season_rabi_char2') || 'Moderate rainfall', t('season_rabi_char3') || 'Wheat, barley, mustard'] },
    { value: 'zaid', label: t('season_zaid') || 'Zaid (Summer)', description: t('season_zaid_desc') || 'March-June, vegetables, fruits', characteristics: [t('season_zaid_char1') || 'Summer season', t('season_zaid_char2') || 'Irrigation needed', t('season_zaid_char3') || 'Vegetables, fruits'] }
  ];

  // Enhanced water availability
  const waterOptions = [
    { value: 'high', label: t('water_high') || 'High (Irrigation available)', description: t('water_high_desc') || 'Can grow water-intensive crops', characteristics: [t('water_high_char1') || 'Full irrigation', t('water_high_char2') || 'Water-intensive crops', t('water_high_char3') || 'High yield potential'] },
    { value: 'moderate', label: t('water_moderate') || 'Moderate', description: t('water_moderate_desc') || 'Balanced water usage crops', characteristics: [t('water_moderate_char1') || 'Partial irrigation', t('water_moderate_char2') || 'Balanced crops', t('water_moderate_char3') || 'Moderate yield'] },
    { value: 'low', label: t('water_low') || 'Low (Rainfed)', description: t('water_low_desc') || 'Drought-resistant crops recommended', characteristics: [t('water_low_char1') || 'Rainfed farming', t('water_low_char2') || 'Drought-resistant', t('water_low_char3') || 'Low water usage'] }
  ];

  // Enhanced experience levels
  const experienceLevels = [
    { value: 'beginner', label: t('exp_beginner') || 'Beginner (0-2 years)', description: t('exp_beginner_desc') || 'Easy to grow crops', characteristics: [t('exp_beginner_char1') || 'Simple techniques', t('exp_beginner_char2') || 'Low risk', t('exp_beginner_char3') || 'Easy maintenance'] },
    { value: 'intermediate', label: t('exp_intermediate') || 'Intermediate (3-5 years)', description: t('exp_intermediate_desc') || 'Moderate complexity crops', characteristics: [t('exp_intermediate_char1') || 'Moderate techniques', t('exp_intermediate_char2') || 'Medium risk', t('exp_intermediate_char3') || 'Some expertise needed'] },
    { value: 'expert', label: t('exp_expert') || 'Expert (5+ years)', description: t('exp_expert_desc') || 'Advanced farming techniques', characteristics: [t('exp_expert_char1') || 'Advanced techniques', t('exp_expert_char2') || 'High risk', t('exp_expert_char3') || 'Expert knowledge'] }
  ];

  // Enhanced market preferences
  const marketPreferences = [
    { value: 'local', label: t('market_local') || 'Local Market', description: t('market_local_desc') || 'Fresh produce for nearby markets', characteristics: [t('market_local_char1') || 'Nearby markets', t('market_local_char2') || 'Fresh produce', t('market_local_char3') || 'Quick sales'] },
    { value: 'export', label: t('market_export') || 'Export Market', description: t('market_export_desc') || 'High-value crops for international markets', characteristics: [t('market_export_char1') || 'International markets', t('market_export_char2') || 'High value', t('market_export_char3') || 'Quality standards'] },
    { value: 'processing', label: t('market_processing') || 'Processing Industry', description: t('market_processing_desc') || 'Crops for food processing', characteristics: [t('market_processing_char1') || 'Bulk supply', t('market_processing_char2') || 'Processing units', t('market_processing_char3') || 'Contract farming'] },
    { value: 'organic', label: t('market_organic') || 'Organic Market', description: t('market_organic_desc') || 'Certified organic produce', characteristics: [t('market_organic_char1') || 'Certified organic', t('market_organic_char2') || 'Premium pricing', t('market_organic_char3') || 'Natural methods'] }
  ];


  // Enhanced AI-based crop recommendation algorithm
  const generateRecommendations = (data) => {
    setLoading(true);
    
    // Simulate AI processing time
    setTimeout(() => {
      const recommendations = [];
      
      // Enhanced crop database with more details
      const cropDatabase = {
        // Cereals
        rice: {
          nameKey: 'crop_rice',
          scientificName: 'Oryza sativa',
          soil: ['clay', 'loamy'],
          climate: ['tropical', 'subtropical'],
          season: ['kharif'],
          water: ['high'],
          experience: ['beginner', 'intermediate'],
          market: ['local', 'export'],
          profitLevel: 'high',
          riskLevel: 'low',
          durationKey: 'crop_duration_rice',
          investmentKey: 'crop_investment_rice',
          investmentMax: 25000,
          yieldKey: 'crop_yield_rice',
          bestPractices: ['bp_proper_water_management', 'bp_timely_transplantation', 'bp_balanced_fertilization'],
          challenges: ['ch_water_requirement', 'ch_pest_management', 'ch_labor_intensive'],
          marketTrendsKey: 'crop_market_trends_rice',
          sustainabilityKey: 'crop_sustainability_rice'
        },
        wheat: {
          nameKey: 'crop_wheat',
          scientificName: 'Triticum aestivum',
          soil: ['loamy', 'clay'],
          climate: ['temperate', 'subtropical'],
          season: ['rabi'],
          water: ['moderate'],
          experience: ['beginner', 'intermediate'],
          market: ['local', 'processing'],
          profitLevel: 'medium',
          riskLevel: 'low',
          durationKey: 'crop_duration_wheat',
          investmentKey: 'crop_investment_wheat',
          investmentMax: 20000,
          yieldKey: 'crop_yield_wheat',
          bestPractices: ['bp_timely_sowing', 'bp_proper_irrigation', 'bp_disease_management'],
          challenges: ['ch_market_price_fluctuations', 'ch_disease_control', 'ch_storage_issues'],
          marketTrendsKey: 'crop_market_trends_wheat',
          sustainabilityKey: 'crop_sustainability_wheat'
        },
        maize: {
          nameKey: 'crop_maize',
          scientificName: 'Zea mays',
          soil: ['loamy', 'sandy'],
          climate: ['tropical', 'subtropical'],
          season: ['kharif', 'zaid'],
          water: ['moderate'],
          experience: ['beginner', 'intermediate'],
          market: ['processing', 'local'],
          profitLevel: 'medium',
          riskLevel: 'medium',
          durationKey: 'crop_duration_maize',
          investmentKey: 'crop_investment_maize',
          investmentMax: 18000,
          yieldKey: 'crop_yield_maize',
          bestPractices: ['bp_hybrid_seeds', 'bp_proper_spacing', 'bp_timely_harvesting'],
          challenges: ['ch_pest_management', 'ch_market_price_fluctuations', 'ch_storage'],
          marketTrendsKey: 'crop_market_trends_maize',
          sustainabilityKey: 'crop_sustainability_maize'
        },
        
        // Pulses
        chickpea: {
          nameKey: 'crop_chickpea',
          scientificName: 'Cicer arietinum',
          soil: ['loamy', 'sandy'],
          climate: ['temperate', 'subtropical'],
          season: ['rabi'],
          water: ['low', 'moderate'],
          experience: ['beginner'],
          market: ['local', 'export'],
          profitLevel: 'high',
          riskLevel: 'low',
          durationKey: 'crop_duration_chickpea',
          investmentKey: 'crop_investment_chickpea',
          investmentMax: 15000,
          yieldKey: 'crop_yield_chickpea',
          bestPractices: ['bp_proper_seed_treatment', 'bp_disease_management', 'bp_timely_harvesting'],
          challenges: ['ch_disease_susceptibility', 'ch_market_price_fluctuations', 'ch_market_access'],
          marketTrendsKey: 'crop_market_trends_chickpea',
          sustainabilityKey: 'crop_sustainability_chickpea'
        },
        
        // Oilseeds
        groundnut: {
          nameKey: 'crop_groundnut',
          scientificName: 'Arachis hypogaea',
          soil: ['sandy', 'loamy'],
          climate: ['tropical', 'subtropical'],
          season: ['kharif', 'rabi'],
          water: ['moderate'],
          experience: ['intermediate'],
          market: ['processing', 'export'],
          profitLevel: 'high',
          riskLevel: 'medium',
          durationKey: 'crop_duration_groundnut',
          investmentKey: 'crop_investment_groundnut',
          investmentMax: 20000,
          yieldKey: 'crop_yield_groundnut',
          bestPractices: ['bp_proper_spacing', 'bp_disease_control', 'bp_timely_harvesting'],
          challenges: ['ch_aflatoxin_management', 'ch_market_price_fluctuations', 'ch_storage_issues'],
          marketTrendsKey: 'crop_market_trends_groundnut',
          sustainabilityKey: 'crop_sustainability_groundnut'
        },
        
        // Vegetables
        tomato: {
          nameKey: 'crop_tomato',
          scientificName: 'Solanum lycopersicum',
          soil: ['loamy', 'sandy'],
          climate: ['tropical', 'subtropical'],
          season: ['zaid', 'rabi'],
          water: ['high'],
          experience: ['intermediate'],
          market: ['local', 'processing'],
          profitLevel: 'very_high',
          riskLevel: 'high',
          durationKey: 'crop_duration_tomato',
          investmentKey: 'crop_investment_tomato',
          investmentMax: 40000,
          yieldKey: 'crop_yield_tomato',
          bestPractices: ['bp_staking', 'bp_disease_management', 'bp_regular_harvesting'],
          challenges: ['ch_price_fluctuations', 'ch_disease_management', 'ch_labor_intensive'],
          marketTrendsKey: 'crop_market_trends_tomato',
          sustainabilityKey: 'crop_sustainability_tomato'
        },
        
        // Fruits
        mango: {
          nameKey: 'crop_mango',
          scientificName: 'Mangifera indica',
          soil: ['loamy', 'sandy'],
          climate: ['tropical', 'subtropical'],
          season: ['zaid'],
          water: ['moderate'],
          experience: ['expert'],
          market: ['local', 'export'],
          profitLevel: 'very_high',
          riskLevel: 'medium',
          durationKey: 'crop_duration_mango',
          investmentKey: 'crop_investment_mango',
          investmentMax: 80000,
          yieldKey: 'crop_yield_mango',
          bestPractices: ['bp_proper_pruning', 'bp_disease_management', 'bp_quality_maintenance'],
          challenges: ['ch_long_gestation_period', 'ch_disease_management', 'ch_market_competition'],
          marketTrendsKey: 'crop_market_trends_mango',
          sustainabilityKey: 'crop_sustainability_mango'
        },
        
        // Cash Crops
        cotton: {
          nameKey: 'crop_cotton',
          scientificName: 'Gossypium hirsutum',
          soil: ['black', 'loamy'],
          climate: ['tropical', 'subtropical'],
          season: ['kharif'],
          water: ['moderate'],
          experience: ['intermediate', 'expert'],
          market: ['processing', 'export'],
          profitLevel: 'high',
          riskLevel: 'medium',
          durationKey: 'crop_duration_cotton',
          investmentKey: 'crop_investment_cotton',
          investmentMax: 25000,
          yieldKey: 'crop_yield_cotton',
          bestPractices: ['bp_pest_management', 'bp_proper_spacing', 'bp_quality_picking'],
          challenges: ['ch_pest_management', 'ch_price_fluctuations', 'ch_labor_intensive'],
          marketTrendsKey: 'crop_market_trends_cotton',
          sustainabilityKey: 'crop_sustainability_cotton'
        }
      };

      // Enhanced AI scoring algorithm
      const calculateScore = (crop, data) => {
        let score = 0;
        
        // Soil compatibility (25 points)
        if (crop.soil.includes(data.soilType)) score += 25;
        
        // Climate compatibility (20 points)
        if (crop.climate.includes(data.climate)) score += 20;
        
        // Season compatibility (15 points)
        if (crop.season.includes(data.season)) score += 15;
        
        // Water availability (15 points)
        if (crop.water.includes(data.waterAvailability)) score += 15;
        
        // Experience level (10 points)
        if (crop.experience.includes(data.experience)) score += 10;
        
        // Market preference bonus (5 points)
        if (crop.market.includes(data.marketPreference)) score += 5;
        
        // Budget consideration (10 points)
        const cropInvestment = crop.investmentMax || 50000;
        const userBudget = parseInt(data.budget) || 50000;
        if (cropInvestment <= userBudget) score += 10;
        
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
            suitability: score >= 80 ? 'excellent' : score >= 60 ? 'good' : 'fair',
            matchPercentage: score
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
      marketPreference: '',
      location: ''
    });
    setRecommendations([]);
    setShowForm(true);
    setSelectedCrop(null);
  };

  const saveRecommendation = (crop) => {
    const savedCrop = {
      ...crop,
      savedAt: new Date().toISOString(),
      formData: formData
    };
    setSavedRecommendations([...savedRecommendations, savedCrop]);
    console.log('Recommendation saved!');
  };

  const downloadReport = (crop) => {
    const report = `
  ${t('crop_recommendation_report') || 'Crop Recommendation Report'}
  =========================

  ${t('crop_label') || 'Crop'}: ${t(crop.nameKey) || crop.key}
  ${t('scientific_name') || 'Scientific Name'}: ${crop.scientificName}
  ${t('suitability_score') || 'Suitability Score'}: ${crop.score}/100
  ${t('match_percentage') || 'Match Percentage'}: ${crop.matchPercentage}%

  ${t('report_details') || 'Details'}:
  - ${t('profit_potential') || 'Profit Potential'}: ${t(`level_${crop.profitLevel}`) || crop.profitLevel}
  - ${t('risk_level') || 'Risk Level'}: ${t(`level_${crop.riskLevel}`) || crop.riskLevel}
  - ${t('duration') || 'Duration'}: ${t(crop.durationKey) || ''}
  - ${t('investment') || 'Investment'}: ${t(crop.investmentKey) || ''}
  - ${t('expected_yield') || 'Expected Yield'}: ${t(crop.yieldKey) || ''}

  ${t('best_practices') || 'Best Practices'}:
  ${crop.bestPractices.map((practiceKey) => `• ${t(practiceKey) || practiceKey}`).join('\n')}

  ${t('challenges') || 'Challenges'}:
  ${crop.challenges.map((challengeKey) => `• ${t(challengeKey) || challengeKey}`).join('\n')}

  ${t('market_trends') || 'Market Trends'}: ${t(crop.marketTrendsKey) || ''}
  ${t('sustainability') || 'Sustainability'}: ${t(crop.sustainabilityKey) || ''}

  ${t('generated_on') || 'Generated on'}: ${new Date().toLocaleDateString()}
    `;
    
    const blob = new Blob([report], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${crop.key}_recommendation.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div style={container}>
      <div style={{maxWidth: '1200px', margin: '0 auto'}}>
      {/* Navigation Header */}
      <div style={navHeader}>
        <button onClick={() => navigate(-1)} style={navButton}>
          <FaChevronLeft style={{ marginRight: '8px' }} />
          {t('back') || 'Back'}
        </button>
        <div style={header}>
          <FaSeedling style={{ fontSize: 32, color: '#fff', marginRight: 12, filter: 'drop-shadow(1px 1px 2px rgba(0,0,0,0.5))' }} />
          <h1 style={title}>{t('crop_recommendations') || 'Crop Recommendations'}</h1>
        </div>
        <button onClick={() => navigate(1)} style={navButton}>
          {t('forward') || 'Forward'}
          <FaChevronRight style={{ marginLeft: '8px' }} />
        </button>
      </div>

      {/* Navigation Tabs */}
      <div style={tabContainer}>
        <button 
          style={!showSaved ? activeTabStyle : tabStyle}
          onClick={() => { setShowSaved(false); setShowForm(true); }}
        >
          {t('new_analysis') || 'New Analysis'}
        </button>
        <button 
          style={showSaved ? activeTabStyle : tabStyle}
          onClick={() => { setShowSaved(true); setShowForm(false); }}
        >
          {t('saved_recommendations') || 'Saved Recommendations'} ({savedRecommendations.length})
        </button>
      </div>

      {showSaved ? (
        <div style={savedContainer}>
          <h2 style={sectionTitle}>{t('saved_recommendations') || 'Saved Recommendations'}</h2>
          {savedRecommendations.length === 0 ? (
            <p style={emptyMessage}>{t('no_saved_recommendations') || 'No saved recommendations yet.'}</p>
          ) : (
            <div style={savedGrid}>
              {savedRecommendations.map((crop, index) => (
                <div key={index} style={savedCard}>
                  <h3>{t(crop.nameKey) || crop.key}</h3>
                  <p>{t('score') || 'Score'}: {crop.score}/100</p>
                  <p>{t('saved_on') || 'Saved'}: {new Date(crop.savedAt).toLocaleDateString()}</p>
                  <button onClick={() => setSelectedCrop(crop)} style={viewButton}>
                    {t('view_details') || 'View Details'}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : showForm ? (
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
              {formData.soilType && (
                <div style={characteristicsBox}>
                  <h4>{t('characteristics') || 'Characteristics'}:</h4>
                  <ul>
                    {soilTypes.find(s => s.value === formData.soilType)?.characteristics.map((char, i) => (
                      <li key={i}>{char}</li>
                    ))}
                  </ul>
                </div>
              )}
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
                placeholder={t('enter_land_size') || 'Enter land size in acres'}
                min="0.1"
                step="0.1"
              />
            </div>

            {/* Budget */}
            <div style={inputGroup}>
              <label style={label}>
                <FaMoneyBillWave style={{ marginRight: 8 }} />
                {t('budget_per_acre') || 'Budget per Acre (₹)'}
              </label>
              <input 
                type="number" 
                value={formData.budget} 
                onChange={(e) => handleInputChange('budget', e.target.value)}
                style={input}
                placeholder={t('enter_budget') || 'Enter budget in ₹'}
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
                <option value="">{t('select_experience_level') || 'Select Experience Level'}</option>
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
                <option value="">{t('select_market_preference') || 'Select Market Preference'}</option>
                {marketPreferences.map(market => (
                  <option key={market.value} value={market.value}>
                    {market.label} - {market.description}
                  </option>
                ))}
              </select>
            </div>

            {/* Location */}
            <div style={inputGroup}>
              <label style={label}>
                <FaMapMarkerAlt style={{ marginRight: 8 }} />
                {t('location_optional') || 'Location (Optional)'}
              </label>
              <input 
                type="text" 
                value={formData.location} 
                onChange={(e) => handleInputChange('location', e.target.value)}
                style={input}
                placeholder={t('enter_location') || 'Enter your location for better recommendations'}
              />
            </div>
          </div>

          <button type="submit" style={submitButton}>
            {t('get_crop_recommendations') || 'Get Crop Recommendations'}
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
                <div style={headerActions}>
                  <button onClick={resetForm} style={resetButton}>
                    {t('new_analysis') || 'New Analysis'}
                  </button>
                </div>
              </div>

              <div style={recommendationsGrid}>
                {recommendations.map((crop, index) => (
                  <div key={crop.key} style={cropCard}>
                    <div style={cardHeader}>
                      <h3 style={cropName}>{t(crop.nameKey) || crop.key}</h3>
                      <div style={scoreBadge(crop.suitability)}>
                        {crop.score}/100
                      </div>
                    </div>
                    
                    <div style={suitabilityBadge(crop.suitability)}>
                      {t('suitability_match', { suitability: t(`suitability_${crop.suitability}`) }) || `${crop.suitability} Match`}
                    </div>

                    <div style={cropDetails}>
                      <div style={detailRow}>
                        <span style={detailLabel}>{t('scientific_name') || 'Scientific Name'}:</span>
                        <span>{crop.scientificName}</span>
                      </div>
                      <div style={detailRow}>
                        <span style={detailLabel}>{t('profit_potential') || 'Profit Potential'}:</span>
                        <span style={profitBadge(crop.profitLevel)}>{t(`level_${crop.profitLevel}`) || crop.profitLevel}</span>
                      </div>
                      
                      <div style={detailRow}>
                        <span style={detailLabel}>{t('risk_level') || 'Risk Level'}:</span>
                        <span style={riskBadge(crop.riskLevel)}>{t(`level_${crop.riskLevel}`) || crop.riskLevel}</span>
                      </div>
                      
                      <div style={detailRow}>
                        <span style={detailLabel}>{t('duration') || 'Duration'}:</span>
                        <span>{t(crop.durationKey) || ''}</span>
                      </div>
                      
                      <div style={detailRow}>
                        <span style={detailLabel}>{t('investment') || 'Investment'}:</span>
                        <span>{t(crop.investmentKey) || ''}</span>
                      </div>
                      
                      <div style={detailRow}>
                        <span style={detailLabel}>{t('expected_yield') || 'Expected Yield'}:</span>
                        <span>{t(crop.yieldKey) || ''}</span>
                      </div>
                    </div>

                    <div style={cardActions}>
                      <button onClick={() => setSelectedCrop(crop)} style={primaryButton}>
                        <FaStar style={{ marginRight: '4px' }} />
                        {t('view_details') || 'View Details'}
                      </button>
                      <button onClick={() => saveRecommendation(crop)} style={secondaryButton}>
                        <FaBookmark style={{ marginRight: '4px' }} />
                        {t('save') || 'Save'}
                      </button>
                      <button onClick={() => downloadReport(crop)} style={downloadButton}>
                        <FaDownload style={{ marginRight: '4px' }} />
                        {t('download') || 'Download'}
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
                    <h4>{t('crop_rotation') || 'Crop Rotation'}</h4>
                    <p>{t('rotation_insight') || 'Implementing crop rotation can improve soil health and reduce pest pressure. Consider alternating between different crop families.'}</p>
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

      {/* Crop Detail Modal */}
      {selectedCrop && (
        <div style={modalOverlay} onClick={() => setSelectedCrop(null)}>
          <div style={modalContent} onClick={(e) => e.stopPropagation()}>
            <div style={modalHeader}>
              <h2>{t(selectedCrop.nameKey) || selectedCrop.key}</h2>
              <button onClick={() => setSelectedCrop(null)} style={closeModalButton}>×</button>
            </div>
            <div style={modalBody}>
              <div style={modalSection}>
                <h3>{t('basic_information') || 'Basic Information'}</h3>
                <p><strong>{t('scientific_name') || 'Scientific Name'}:</strong> {selectedCrop.scientificName}</p>
                <p><strong>{t('suitability_score') || 'Suitability Score'}:</strong> {selectedCrop.score}/100</p>
                <p><strong>{t('match_percentage') || 'Match Percentage'}:</strong> {selectedCrop.matchPercentage}%</p>
              </div>
              
              <div style={modalSection}>
                <h3>{t('economic_details') || 'Economic Details'}</h3>
                <p><strong>{t('profit_potential') || 'Profit Potential'}:</strong> {t(`level_${selectedCrop.profitLevel}`) || selectedCrop.profitLevel}</p>
                <p><strong>{t('risk_level') || 'Risk Level'}:</strong> {t(`level_${selectedCrop.riskLevel}`) || selectedCrop.riskLevel}</p>
                <p><strong>{t('investment') || 'Investment'}:</strong> {t(selectedCrop.investmentKey) || ''}</p>
                <p><strong>{t('expected_yield') || 'Expected Yield'}:</strong> {t(selectedCrop.yieldKey) || ''}</p>
                <p><strong>{t('duration') || 'Duration'}:</strong> {t(selectedCrop.durationKey) || ''}</p>
              </div>
              
              <div style={modalSection}>
                <h3>{t('best_practices') || 'Best Practices'}</h3>
                <ul>
                  {selectedCrop.bestPractices.map((practiceKey, index) => (
                    <li key={index}>{t(practiceKey) || practiceKey}</li>
                  ))}
                </ul>
              </div>
              
              <div style={modalSection}>
                <h3>{t('challenges') || 'Challenges'}</h3>
                <ul>
                  {selectedCrop.challenges.map((challengeKey, index) => (
                    <li key={index}>{t(challengeKey) || challengeKey}</li>
                  ))}
                </ul>
              </div>
              
              <div style={modalSection}>
                <h3>{t('market_and_sustainability') || 'Market & Sustainability'}</h3>
                <p><strong>{t('market_trends') || 'Market Trends'}:</strong> {t(selectedCrop.marketTrendsKey) || ''}</p>
                <p><strong>{t('sustainability') || 'Sustainability'}:</strong> {t(selectedCrop.sustainabilityKey) || ''}</p>
              </div>
            </div>
            <div style={modalFooter}>
              <button onClick={() => saveRecommendation(selectedCrop)} style={saveButton}>
                <FaBookmark style={{ marginRight: '4px' }} />
                {t('save_recommendation') || 'Save Recommendation'}
              </button>
              <button onClick={() => downloadReport(selectedCrop)} style={downloadButton}>
                <FaDownload style={{ marginRight: '4px' }} />
                {t('download_report') || 'Download Report'}
              </button>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
};

// Enhanced Styles
const container = {
  width: '100%',
  minHeight: '100vh',
  padding: '20px',
  fontFamily: 'Arial, sans-serif',
  backgroundImage: 'url(https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=1920)',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  backgroundAttachment: 'fixed',
  position: 'relative'
};

const navHeader = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: '20px',
  padding: '10px 0'
};

const navButton = {
  backgroundColor: '#28a745',
  color: 'white',
  border: 'none',
  padding: '10px 16px',
  borderRadius: '6px',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  fontSize: '14px',
  fontWeight: '600',
  transition: 'all 0.3s'
};

const header = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  textAlign: 'center',
  flex: 1
};

const title = {
  fontSize: '2.5em',
  color: '#fff',
  margin: 0,
  textShadow: '2px 2px 4px rgba(0,0,0,0.7)'
};

const description = {
  textAlign: 'center',
  fontSize: '16px',
  color: '#fff',
  marginBottom: '30px',
  lineHeight: '1.6',
  textShadow: '1px 1px 3px rgba(0,0,0,0.7)',
  maxWidth: '1200px',
  margin: '0 auto 30px'
};

const tabContainer = {
  display: 'flex',
  justifyContent: 'center',
  gap: '10px',
  marginBottom: '30px'
};

const tabStyle = {
  padding: '12px 24px',
  border: '2px solid #28a745',
  backgroundColor: 'transparent',
  color: '#28a745',
  borderRadius: '8px',
  cursor: 'pointer',
  fontSize: '16px',
  fontWeight: '600',
  transition: 'all 0.3s'
};

const activeTabStyle = {
  ...tabStyle,
  backgroundColor: '#28a745',
  color: '#fff'
};

const formStyle = {
  background: 'transparent',
  padding: '30px',
  borderRadius: '12px',
  marginBottom: '30px',
  maxWidth: '1200px',
  margin: '0 auto'
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
  color: '#fff',
  display: 'flex',
  alignItems: 'center',
  textShadow: '1px 1px 3px rgba(0,0,0,0.5)',
  fontSize: '14px'
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

const characteristicsBox = {
  marginTop: '10px',
  padding: '10px',
  backgroundColor: '#f8f9fa',
  borderRadius: '6px',
  fontSize: '14px'
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

const headerActions = {
  display: 'flex',
  gap: '10px'
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
  background: suitability === 'excellent' ? '#28a745' : suitability === 'good' ? '#ffc107' : '#dc3545',
  color: '#fff',
  padding: '4px 12px',
  borderRadius: '20px',
  fontSize: '14px',
  fontWeight: '600'
});

const suitabilityBadge = (suitability) => ({
  background: suitability === 'excellent' ? '#d4edda' : suitability === 'good' ? '#fff3cd' : '#f8d7da',
  color: suitability === 'excellent' ? '#155724' : suitability === 'good' ? '#856404' : '#721c24',
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

const profitBadge = (profitLevel) => ({
  background: profitLevel === 'very_high' ? '#28a745' : profitLevel === 'high' ? '#20c997' : '#ffc107',
  color: '#fff',
  padding: '2px 8px',
  borderRadius: '4px',
  fontSize: '12px',
  fontWeight: '600'
});

const riskBadge = (riskLevel) => ({
  background: riskLevel === 'low' ? '#28a745' : riskLevel === 'medium' ? '#ffc107' : '#dc3545',
  color: '#fff',
  padding: '2px 8px',
  borderRadius: '4px',
  fontSize: '12px',
  fontWeight: '600'
});

const cardActions = {
  display: 'flex',
  gap: '10px',
  flexWrap: 'wrap'
};

const primaryButton = {
  background: '#007bff',
  color: '#fff',
  padding: '8px 16px',
  border: 'none',
  borderRadius: '6px',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  fontSize: '14px'
};

const secondaryButton = {
  background: '#6c757d',
  color: '#fff',
  padding: '8px 16px',
  border: 'none',
  borderRadius: '6px',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  fontSize: '14px'
};

const downloadButton = {
  background: '#28a745',
  color: '#fff',
  padding: '8px 16px',
  border: 'none',
  borderRadius: '6px',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  fontSize: '14px'
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

const savedContainer = {
  background: '#fff',
  padding: '30px',
  borderRadius: '12px',
  boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
};

const sectionTitle = {
  fontSize: '2rem',
  fontWeight: 'bold',
  marginBottom: '30px',
  color: '#333'
};

const emptyMessage = {
  textAlign: 'center',
  color: '#666',
  fontSize: '16px'
};

const savedGrid = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
  gap: '20px'
};

const savedCard = {
  border: '1px solid #e0e0e0',
  borderRadius: '8px',
  padding: '15px',
  background: '#f8f9fa'
};

const viewButton = {
  background: '#007bff',
  color: '#fff',
  border: 'none',
  padding: '8px 16px',
  borderRadius: '6px',
  cursor: 'pointer',
  marginTop: '10px'
};

const modalOverlay = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0,0,0,0.5)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 1000
};

const modalContent = {
  background: '#fff',
  borderRadius: '12px',
  maxWidth: '600px',
  width: '90%',
  maxHeight: '80vh',
  overflow: 'auto'
};

const modalHeader = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '20px',
  borderBottom: '1px solid #eee'
};

const closeModalButton = {
  background: 'transparent',
  border: 'none',
  fontSize: '24px',
  cursor: 'pointer',
  color: '#666'
};

const modalBody = {
  padding: '20px'
};

const modalSection = {
  marginBottom: '20px'
};

const modalFooter = {
  padding: '20px',
  borderTop: '1px solid #eee',
  display: 'flex',
  gap: '10px',
  justifyContent: 'flex-end'
};

const saveButton = {
  background: '#28a745',
  color: '#fff',
  border: 'none',
  padding: '10px 20px',
  borderRadius: '6px',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center'
};

export default CropRecommendation; 