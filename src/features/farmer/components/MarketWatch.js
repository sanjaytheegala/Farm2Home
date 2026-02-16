import React, { useState, useEffect } from 'react';
import { 
  fetchRegionalMarketPrices, 
  searchByCommodity, 
  formatMarketData 
} from '../../../services/marketDataService';
import { useTranslation } from 'react-i18next';
import { 
  FaSearch, 
  FaSync, 
  FaChartLine, 
  FaMapMarkerAlt,
  FaLeaf,
  FaRupeeSign
} from 'react-icons/fa';
import './MarketWatch.css';

const MarketWatch = () => {
  const { t } = useTranslation();
  
  // State management
  const [marketData, setMarketData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedState, setSelectedState] = useState('ALL');
  const [lastUpdated, setLastUpdated] = useState(null);

  // Fetch market data on component mount
  useEffect(() => {
    fetchMarketData();
  }, []);

  // Apply filters when search query or state filter changes
  useEffect(() => {
    applyFilters();
  }, [searchQuery, selectedState, marketData]);

  /**
   * Fetch market data from API
   */
  const fetchMarketData = async () => {
    setLoading(true);
    setError(null);

    console.log('🚀 MarketWatch: Starting data fetch...');

    try {
      const result = await fetchRegionalMarketPrices();
      
      console.log('📦 MarketWatch: Fetch result:', {
        success: result.success,
        count: result.count,
        dataLength: result.data?.length || 0
      });
      
      if (result.success && result.data.length > 0) {
        // Format the data
        const formattedData = result.data.map(item => formatMarketData(item));
        console.log('✅ MarketWatch: Data formatted successfully');
        console.log('📊 MarketWatch: Sample formatted data:', formattedData[0]);
        
        setMarketData(formattedData);
        setLastUpdated(new Date());
      } else {
        console.warn('⚠️ MarketWatch: No data available');
        setMarketData([]);
        setError(result.message || 'No data available for today');
      }
    } catch (err) {
      console.error('❌ MarketWatch: Error fetching data:', err);
      setError('Failed to load market data. Please try again later.');
      setMarketData([]);
    } finally {
      setLoading(false);
      console.log('🏁 MarketWatch: Fetch complete');
    }
  };

  /**
   * Apply search and state filters to market data
   */
  const applyFilters = () => {
    let filtered = [...marketData];

    // Apply state filter
    if (selectedState !== 'ALL') {
      filtered = filtered.filter(item => {
        const state = (item.state || '').toUpperCase();
        return state.includes(selectedState);
      });
    }

    // Apply search filter
    if (searchQuery.trim()) {
      filtered = searchByCommodity(searchQuery, filtered);
    }

    setFilteredData(filtered);
  };

  /**
   * Handle search input change
   */
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  /**
   * Handle state filter change
   */
  const handleStateFilterChange = (e) => {
    setSelectedState(e.target.value);
  };

  /**
   * Handle refresh button click
   */
  const handleRefresh = () => {
    setSearchQuery('');
    setSelectedState('ALL');
    fetchMarketData();
  };

  /**
   * Format price for display
   */
  const formatPrice = (price) => {
    if (!price || price === '0' || price === 'N/A') return 'N/A';
    return `₹${parseFloat(price).toLocaleString('en-IN')}`;
  };

  /**
   * Get unique states from data
   */
  const getUniqueStates = () => {
    const states = [...new Set(marketData.map(item => item.state))];
    return states.filter(state => state && state !== 'N/A');
  };

  return (
    <div className="market-watch-container">
      {/* Header Section */}
      <div className="market-watch-header">
        <div className="market-watch-title-section">
          <FaChartLine className="market-watch-icon" />
          <h2 className="market-watch-title">
            {t('market_watch') || 'Market Watch'}
          </h2>
        </div>
        <div className="market-watch-subtitle">
          <FaMapMarkerAlt style={{ marginRight: '8px', color: '#28a745' }} />
          Telangana & Andhra Pradesh Markets
        </div>
        {lastUpdated && (
          <div className="market-watch-last-updated">
            Last updated: {lastUpdated.toLocaleTimeString()}
          </div>
        )}
      </div>

      {/* Controls Section */}
      <div className="market-watch-controls">
        {/* Search Bar */}
        <div className="market-watch-search-container">
          <FaSearch className="market-watch-search-icon" />
          <input
            type="text"
            className="market-watch-search-input"
            placeholder={t('search_commodity') || 'Search commodity (e.g., Rice, Tomato, Onion)...'}
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </div>

        {/* State Filter */}
        <div className="market-watch-filter-container">
          <select
            className="market-watch-filter-select"
            value={selectedState}
            onChange={handleStateFilterChange}
          >
            <option value="ALL">All States</option>
            <option value="TELANGANA">Telangana</option>
            <option value="ANDHRA">Andhra Pradesh</option>
          </select>
        </div>

        {/* Refresh Button */}
        <button
          className="market-watch-refresh-button"
          onClick={handleRefresh}
          disabled={loading}
        >
          <FaSync className={loading ? 'rotating' : ''} />
          {loading ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>

      {/* Content Section */}
      <div className="market-watch-content">
        {loading ? (
          // Loading State
          <div className="market-watch-loading">
            <div className="market-watch-spinner"></div>
            <p>{t('loading_market_data') || 'Loading market data...'}</p>
          </div>
        ) : error || filteredData.length === 0 ? (
          // Empty State / Error State
          <div className="market-watch-empty">
            <FaLeaf className="market-watch-empty-icon" />
            <h3>
              {error || 'Data not updated for today'}
            </h3>
            <p>
              {error 
                ? 'Please check your internet connection and try again.'
                : 'Market prices will be updated soon. Please check back later.'}
            </p>
            <button 
              className="market-watch-refresh-button"
              onClick={handleRefresh}
            >
              <FaSync /> Try Again
            </button>
          </div>
        ) : (
          // Data Table
          <>
            <div className="market-watch-stats">
              <span>
                Showing <strong>{filteredData.length}</strong> {filteredData.length === 1 ? 'entry' : 'entries'}
              </span>
            </div>

            <div className="market-watch-table-container">
              <table className="market-watch-table">
                <thead>
                  <tr>
                    <th>
                      <FaLeaf style={{ marginRight: '6px' }} />
                      Commodity
                    </th>
                    <th>Variety</th>
                    <th>
                      <FaMapMarkerAlt style={{ marginRight: '6px' }} />
                      Market (Mandi)
                    </th>
                    <th>State</th>
                    <th>District</th>
                    <th>
                      <FaRupeeSign style={{ marginRight: '6px' }} />
                      Min Price
                    </th>
                    <th>
                      <FaRupeeSign style={{ marginRight: '6px' }} />
                      Max Price
                    </th>
                    <th>Modal Price</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.map((item, index) => (
                    <tr key={index} className="market-watch-table-row">
                      <td className="market-watch-commodity">
                        <strong>{item.commodity}</strong>
                      </td>
                      <td>{item.variety || '-'}</td>
                      <td className="market-watch-market">{item.market}</td>
                      <td>{item.state}</td>
                      <td>{item.district || '-'}</td>
                      <td className="market-watch-price market-watch-min-price">
                        {formatPrice(item.minPrice)}
                      </td>
                      <td className="market-watch-price market-watch-max-price">
                        {formatPrice(item.maxPrice)}
                      </td>
                      <td className="market-watch-price">
                        {formatPrice(item.modalPrice)}
                      </td>
                      <td className="market-watch-date">
                        {item.priceDate}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View (for responsive design) */}
            <div className="market-watch-card-container">
              {filteredData.map((item, index) => (
                <div key={index} className="market-watch-card">
                  <div className="market-watch-card-header">
                    <h3>{item.commodity}</h3>
                    {item.variety && <span className="market-watch-card-variety">{item.variety}</span>}
                  </div>
                  <div className="market-watch-card-body">
                    <div className="market-watch-card-row">
                      <FaMapMarkerAlt />
                      <span><strong>Market:</strong> {item.market}</span>
                    </div>
                    <div className="market-watch-card-row">
                      <span><strong>Location:</strong> {item.district}, {item.state}</span>
                    </div>
                    <div className="market-watch-card-prices">
                      <div className="market-watch-card-price-item">
                        <span className="market-watch-card-price-label">Min Price</span>
                        <span className="market-watch-card-price-value market-watch-min-price">
                          {formatPrice(item.minPrice)}
                        </span>
                      </div>
                      <div className="market-watch-card-price-item">
                        <span className="market-watch-card-price-label">Max Price</span>
                        <span className="market-watch-card-price-value market-watch-max-price">
                          {formatPrice(item.maxPrice)}
                        </span>
                      </div>
                    </div>
                    <div className="market-watch-card-footer">
                      <span>{item.priceDate}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default MarketWatch;
