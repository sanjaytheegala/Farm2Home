/**
 * Market Data Service
 * Fetches daily market prices from data.gov.in Agmarknet API
 * 
 * DEBUGGING:
 * - Open browser console to see detailed logs
 * - Run window.testMarketAPI() in console to test API directly
 * - Check console for actual field names if data doesn't display correctly
 * 
 * EXPECTED API RESPONSE STRUCTURE:
 * {
 *   "records": [
 *     {
 *       "commodity": "Rice",
 *       "state": "TELANGANA",
 *       "market": "Hyderabad",
 *       "min_price": "2500",
 *       "max_price": "2800",
 *       ...
 *     }
 *   ],
 *   "total": 100
 * }
 */

const API_KEY = '579b464db66ec23bdd000001dd6064564c654221741a2945dea1a86d';
const BASE_URL = 'https://api.data.gov.in/resource';

// API endpoint for market prices
// Note: The actual endpoint may vary. Common endpoints include:
// - Current daily prices: /9ef84268-d588-465a-a308-a864a43d0070
// - Historical prices: Different resource IDs
const RESOURCE_ID = '9ef84268-d588-465a-a308-a864a43d0070';

/**
 * Fetch daily market prices from Agmarknet API
 * @param {Object} filters - Query filters for API
 * @param {string} filters.state - State name (optional)
 * @param {string} filters.commodity - Commodity name (optional)
 * @param {number} filters.limit - Number of records to fetch (default: 100)
 * @returns {Promise<Object>} API response with market data
 */
export const fetchMarketPrices = async (filters = {}) => {
  try {
    const { state = '', commodity = '', limit = 100 } = filters;
    
    // Build query parameters
    const params = new URLSearchParams({
      'api-key': API_KEY,
      format: 'json',
      limit: limit.toString(),
    });

    // Add optional filters
    if (state) {
      params.append('filters[state]', state);
    }
    if (commodity) {
      params.append('filters[commodity]', commodity);
    }

    const url = `${BASE_URL}/${RESOURCE_ID}?${params.toString()}`;
    
    console.log('🔍 Market Data API Request URL:', url);
    
    const response = await fetch(url);
    
    if (!response.ok) {
      console.error('❌ API Response Error:', response.status, response.statusText);
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();
    
    console.log('📊 Raw API Response:', data);
    console.log('📦 Records Count:', data.records?.length || 0);
    
    if (data.records && data.records.length > 0) {
      console.log('📋 Sample Record:', data.records[0]);
      console.log('🔑 Available Fields:', Object.keys(data.records[0]));
    }
    
    return {
      success: true,
      data: data.records || [],
      count: data.total || 0,
      message: 'Data fetched successfully'
    };
  } catch (error) {
    console.error('Error fetching market prices:', error);
    return {
      success: false,
      data: [],
      count: 0,
      error: error.message,
      message: 'Failed to fetch market data'
    };
  }
};

/**
 * Fetch market prices for specific states (Telangana or Andhra Pradesh)
 * @param {string} commodity - Optional commodity name to filter
 * @returns {Promise<Object>} Filtered market data
 */
export const fetchRegionalMarketPrices = async (commodity = '') => {
  try {
    console.log('🌍 Fetching regional market prices for:', commodity || 'All commodities');
    
    // Fetch data without state filter first (as API might use different state names)
    const result = await fetchMarketPrices({ commodity, limit: 500 });
    
    if (!result.success) {
      console.error('❌ Failed to fetch market prices:', result.error);
      return result;
    }

    console.log('📊 Total records fetched:', result.data.length);

    // Filter for Telangana and Andhra Pradesh
    // The API might use variations like "TELANGANA", "Telangana", "ANDHRA PRADESH", etc.
    const filteredData = result.data.filter(item => {
      const state = (item.state || '').toUpperCase();
      return state.includes('TELANGANA') || 
             state.includes('ANDHRA') || 
             state.includes('ANDHRA PRADESH');
    });

    console.log('🎯 Filtered records (Telangana/AP):', filteredData.length);
    
    if (filteredData.length > 0) {
      console.log('✅ Sample filtered record:', filteredData[0]);
    } else {
      console.warn('⚠️ No records found for Telangana/Andhra Pradesh');
      console.log('💡 Available states in data:', 
        [...new Set(result.data.map(item => item.state))].slice(0, 10)
      );
    }

    return {
      success: true,
      data: filteredData,
      count: filteredData.length,
      message: 'Regional data fetched successfully'
    };
  } catch (error) {
    console.error('❌ Error fetching regional market prices:', error);
    return {
      success: false,
      data: [],
      count: 0,
      error: error.message,
      message: 'Failed to fetch regional market data'
    };
  }
};

/**
 * Search market prices by commodity name
 * @param {string} searchQuery - Commodity name to search
 * @param {Array} data - Market data array to search within
 * @returns {Array} Filtered results
 */
export const searchByCommodity = (searchQuery, data) => {
  if (!searchQuery || !data || !Array.isArray(data)) {
    return data || [];
  }

  const query = searchQuery.toLowerCase().trim();
  
  return data.filter(item => {
    const commodity = (item.commodity || '').toLowerCase();
    const variety = (item.variety || '').toLowerCase();
    
    return commodity.includes(query) || variety.includes(query);
  });
};

/**
 * Format price data for display
 * @param {Object} item - Market data item
 * @returns {Object} Formatted item
 */
export const formatMarketData = (item) => {
  console.log('🔧 Formatting item:', item);
  
  const formatted = {
    commodity: item.commodity || 'N/A',
    variety: item.variety || '',
    market: item.market || item.mandi || 'N/A',
    state: item.state || 'N/A',
    district: item.district || '',
    minPrice: item.min_price || item.modal_price || '0',
    maxPrice: item.max_price || item.modal_price || '0',
    modalPrice: item.modal_price || '0',
    priceDate: item.price_date || item.arrival_date || new Date().toISOString().split('T')[0],
    arrivals: item.arrivals || '',
  };
  
  return formatted;
};

/**
 * TEST HELPER - Call this from browser console to test API
 * Usage: window.testMarketAPI()
 */
export const testMarketAPI = async () => {
  console.log('🧪 Testing Market Data API...');
  console.log('═'.repeat(50));
  
  try {
    const result = await fetchMarketPrices({ limit: 5 });
    
    console.log('✅ API Test Results:');
    console.log('Success:', result.success);
    console.log('Count:', result.count);
    console.log('Records:', result.data.length);
    
    if (result.data.length > 0) {
      console.log('\n📋 First Record:');
      console.table(result.data[0]);
      
      console.log('\n🔑 All Available Fields:');
      console.log(Object.keys(result.data[0]));
    }
    
    return result;
  } catch (error) {
    console.error('❌ API Test Failed:', error);
    return { error };
  }
};

// Make test function available globally for console testing
if (typeof window !== 'undefined') {
  window.testMarketAPI = testMarketAPI;
  console.log('💡 Test function available: window.testMarketAPI()');
}

export default {
  fetchMarketPrices,
  fetchRegionalMarketPrices,
  searchByCommodity,
  formatMarketData,
  testMarketAPI
};
