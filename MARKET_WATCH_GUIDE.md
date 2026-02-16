# Market Watch Component - Implementation Guide

## Overview
The Market Watch component fetches and displays daily market prices from the data.gov.in Agmarknet API, specifically filtered for Telangana and Andhra Pradesh markets.

## Files Created

### 1. **marketDataService.js** (`src/services/marketDataService.js`)
   - Handles all API interactions with data.gov.in
   - API Key: `579b464db66ec23bdd000001dd6064564c654221741a2945dea1a86d`
   - Functions:
     - `fetchMarketPrices()` - Fetch market data with optional filters
     - `fetchRegionalMarketPrices()` - Fetch data for Telangana & Andhra Pradesh
     - `searchByCommodity()` - Search functionality for commodities
     - `formatMarketData()` - Format raw API data for display

### 2. **MarketWatch.js** (`src/features/farmer/components/MarketWatch.js`)
   - Main component displaying market prices
   - Features:
     - ✅ Table/List display with commodity info
     - ✅ State filter (All/Telangana/Andhra Pradesh)
     - ✅ Search bar for specific crops (Rice, Tomato, Onion, etc.)
     - ✅ Loading state with spinner
     - ✅ Empty state message when no data available
     - ✅ Responsive design (table on desktop, cards on mobile)
     - ✅ Refresh button to reload data
     - ✅ Real-time filtering

### 3. **MarketWatch.css** (`src/features/farmer/components/MarketWatch.css`)
   - Comprehensive styling with responsive design
   - Mobile-friendly card layout
   - Professional color scheme matching the app's theme

### 4. **FarmerDashboard.js** (Updated)
   - Added new "Market Watch" tab
   - Integrated MarketWatch component
   - Added FaStore icon for the tab

## Features Implemented

### 📊 Data Display
- **Commodity Name**: Primary crop name
- **Market (Mandi)**: Market/mandi location
- **Min Price**: Minimum price in rupees
- **Max Price**: Maximum price in rupees
- **Additional Info**: Variety, District, State, Modal Price, Date

### 🔍 Filtering & Search
1. **State Filter**: 
   - All States
   - Telangana only
   - Andhra Pradesh only
   - *Default*: Shows both states

2. **Search Bar**:
   - Real-time search
   - Searches in commodity names and varieties
   - Examples: "Rice", "Tomato", "Onion", "Wheat"

### 🔄 State Management
- **Loading State**: Displays spinner while fetching data
- **Empty State**: Shows "Data not updated for today" when no data available
- **Error Handling**: Graceful error messages with retry option

### 📱 Responsive Design
- Desktop: Full table view with all columns
- Mobile: Card-based layout for better readability
- Breakpoints: 992px, 768px, 480px

## API Configuration

### Data.gov.in Agmarknet API
- **Base URL**: `https://api.data.gov.in/resource`
- **Resource ID**: `9ef84268-d588-465a-a308-a864a43d0070`
- **API Key**: Configured in `marketDataService.js`

### Query Parameters
```javascript
{
  'api-key': 'YOUR_API_KEY',
  'format': 'json',
  'limit': 100,
  'filters[state]': 'TELANGANA',
  'filters[commodity]': 'Rice'
}
```

## Usage

### Accessing Market Watch
1. Log in as a Farmer
2. Navigate to Farmer Dashboard
3. Click on "Market Watch" tab
4. View real-time market prices

### Search for Specific Crop
1. Type crop name in search bar (e.g., "Tomato")
2. Results filter automatically

### Filter by State
1. Use dropdown to select state
2. Options: All States, Telangana, Andhra Pradesh

### Refresh Data
1. Click "Refresh" button
2. Data reloads from API

## Data Structure

### API Response Format
```javascript
{
  commodity: "Rice",
  variety: "Sona Masuri",
  market: "Hyderabad",
  state: "TELANGANA",
  district: "Hyderabad",
  min_price: "2500",
  max_price: "2800",
  modal_price: "2650",
  price_date: "2026-02-17"
}
```

## Customization

### Adding More States
Edit `fetchRegionalMarketPrices()` in `marketDataService.js`:
```javascript
const filteredData = result.data.filter(item => {
  const state = (item.state || '').toUpperCase();
  return state.includes('TELANGANA') || 
         state.includes('ANDHRA') ||
         state.includes('KARNATAKA'); // Add more states
});
```

### Changing API Endpoint
Update `RESOURCE_ID` in `marketDataService.js`:
```javascript
const RESOURCE_ID = 'YOUR_NEW_RESOURCE_ID';
```

### Styling Customization
Modify `MarketWatch.css` to change:
- Colors: Update hex codes
- Layout: Adjust grid/flexbox properties
- Breakpoints: Change media query values

## Translation Keys

Add these keys to your locales files:

```json
{
  "market_watch": "Market Watch",
  "search_commodity": "Search commodity",
  "loading_market_data": "Loading market data...",
  "all_states": "All States"
}
```

## Troubleshooting

### No Data Displayed
1. Check internet connection
2. Verify API key is valid
3. Check browser console for errors
4. API might be temporarily down

### Search Not Working
1. Ensure data has loaded first
2. Try different search terms
3. Check spelling

### Performance Issues
1. Reduce `limit` parameter in API call
2. Implement pagination
3. Add debouncing to search input

## Future Enhancements

### Potential Features
- 📈 Price trend charts
- 📊 Historical data comparison
- 🔔 Price alerts
- 📍 Nearest market finder
- 💾 Export data to CSV
- 📅 Date range filter
- 🏆 Best price highlighter

### API Alternatives
If data.gov.in API has issues:
1. Agmarknet official website scraping
2. NIC Agmarknet APIs
3. State agriculture department APIs
4. Private market data providers

## Notes

- API data may not be available on weekends/holidays
- Market prices are typically updated daily
- Different states may use different naming conventions
- Some mandis might not report data regularly

## Support

For issues or questions:
1. Check API documentation: https://data.gov.in
2. Review browser console logs
3. Verify API key validity
4. Check network requests in DevTools

---

**Implementation Date**: February 17, 2026  
**API Provider**: data.gov.in (Government of India)  
**Coverage**: Telangana & Andhra Pradesh Markets
