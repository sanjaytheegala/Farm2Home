# Market Watch - Debugging & Testing Guide

## 🧪 How to Test if Data is Real

### Method 1: Browser Console Logs

When you open the Market Watch component, the browser console will show detailed logs:

```
🔍 Market Data API Request URL: https://api.data.gov.in/resource/...
📊 Raw API Response: { records: [...], total: 100 }
📦 Records Count: 100
📋 Sample Record: { commodity: "Rice", state: "TELANGANA", ... }
🔑 Available Fields: ["commodity", "state", "market", "min_price", ...]
```

**Steps:**
1. Open your app in the browser
2. Press `F12` or right-click → "Inspect" → "Console" tab
3. Go to Farmer Dashboard → Market Watch tab
4. Watch the console for logs

### Method 2: Test API Directly in Console

Run this command in your browser console:
```javascript
window.testMarketAPI()
```

This will:
- ✅ Test the API connection
- ✅ Show first 5 records
- ✅ Display all available field names
- ✅ Show if data is being received

### Method 3: Test API in Browser

Open this URL directly in your browser (this is NOT code, just a real URL to visit):
```
https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070?api-key=579b464db66ec23bdd000001dd6064564c654221741a2945dea1a86d&format=json&limit=10
```

You should see JSON response with real market data.

### Method 4: Use Postman or Thunder Client

1. Open Postman (or install Thunder Client VS Code extension)
2. Create GET request to:
   ```
   https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070
   ```
3. Add query parameters:
   - `api-key`: `579b464db66ec23bdd000001dd6064564c654221741a2945dea1a86d`
   - `format`: `json`
   - `limit`: `10`
4. Send request and check response

## 🔍 What to Look For

### ✅ API is Working if You See:
- HTTP Status: 200 OK
- Response has `records` array
- Records have fields like: `commodity`, `state`, `market`, `price`
- Records array length > 0

### ❌ API Issues if You See:
- HTTP Status: 401/403 (Invalid API key)
- HTTP Status: 404 (Wrong resource ID)
- HTTP Status: 429 (Rate limit exceeded)
- Empty records array (No data available)
- CORS errors (API blocking browser requests)

## 🛠️ Troubleshooting

### Issue 1: "No data available for today"

**Possible Reasons:**
1. ✅ API is working but no data for Telangana/AP
2. ❌ Wrong field name for "state" in API
3. ❌ State names don't match our filter

**Fix:**
Check console logs for:
```
💡 Available states in data: ["KARNATAKA", "MAHARASHTRA", ...]
```

If you don't see "TELANGANA" or "ANDHRA", the API might:
- Use different spellings
- Not have data for these states today
- Need different filtering logic

### Issue 2: API Returns Data but Fields Don't Match

**Symptoms:**
- Table shows "N/A" everywhere
- Prices show as "₹0"
- No commodity names

**Fix:**
Check console log:
```
🔑 Available Fields: ["item_name", "mandi_name", "price_min", ...]
```

If field names are different, update `formatMarketData()` in:
`src/services/marketDataService.js`

Example: If API uses `item_name` instead of `commodity`:
```javascript
export const formatMarketData = (item) => {
  return {
    commodity: item.item_name || item.commodity || 'N/A',  // Try both
    // ... rest of fields
  };
};
```

### Issue 3: CORS Error

**Error Message:**
```
Access to fetch at 'https://api.data.gov.in/...' has been blocked by CORS policy
```

**Possible Solutions:**

1. **Check if API allows browser requests**
   - Some government APIs only work from server-side
   - May need to create a backend proxy

2. **Use Browser Extension (Temporary)**
   - Install "CORS Unblock" extension (Chrome/Edge)
   - ⚠️ Only for development testing!

3. **Create Backend Proxy** (Recommended for production)
   - Add proxy in `package.json`:
     ```json
     "proxy": "https://api.data.gov.in"
     ```
   - Or create Express.js backend endpoint

### Issue 4: Wrong Resource ID

**Symptoms:**
- 404 Error
- "Resource not found"

**Solution:**
Find correct resource ID from data.gov.in:

1. Go to: https://data.gov.in
2. Search for "agmarknet" or "market prices"
3. Find the dataset
4. Copy the resource ID from URL
5. Update `RESOURCE_ID` in `marketDataService.js`:
   ```javascript
   const RESOURCE_ID = 'YOUR_CORRECT_RESOURCE_ID';
   ```

### Issue 5: Invalid API Key

**Symptoms:**
- 401 Unauthorized
- 403 Forbidden
- "Invalid API key" message

**Solution:**
1. Verify API key is still valid
2. Check for typos in the key
3. May need to regenerate key from data.gov.in
4. Update in `marketDataService.js`:
   ```javascript
   const API_KEY = 'YOUR_NEW_API_KEY';
   ```

## 📊 Understanding the Data Flow

```
1. User opens Market Watch
   ↓
2. MarketWatch.js calls fetchRegionalMarketPrices()
   ↓
3. marketDataService.js makes API request
   ↓
4. API returns JSON: { records: [...] }
   ↓
5. Filter for Telangana/Andhra Pradesh
   ↓
6. formatMarketData() maps fields
   ↓
7. Display in table/cards
```

Each step logs to console with emoji prefix:
- 🔍 API request
- 📊 Raw response
- 🎯 Filtered data
- 🔧 Formatting
- ✅ Success
- ❌ Error

## 🎯 Quick Checklist

Before reporting issues, verify:

- [ ] Console shows API request URL
- [ ] Console shows raw API response
- [ ] Response has `records` array
- [ ] `records.length > 0`
- [ ] Field names match your expectations
- [ ] State names include TELANGANA/ANDHRA
- [ ] No CORS errors
- [ ] No 401/403/404 errors
- [ ] Filters are working (search, state dropdown)

## 📞 Next Steps

If data still doesn't show:

1. **Copy console logs** - Share all console output
2. **Copy API response** - Share raw JSON response
3. **Check field names** - List actual field names from API
4. **Verify states** - List states that ARE in the data

Then we can:
- Adjust field mappings
- Fix state filtering
- Update resource ID
- Create backend proxy if needed

## 🔗 Useful Links

- **data.gov.in**: https://data.gov.in
- **API Documentation**: https://data.gov.in/help/how-use-datasets-apis
- **Agmarknet Official**: https://agmarknet.gov.in
- **API Key Registration**: https://data.gov.in/user/register

---

**Remember**: The data fetching is REAL, not random. If you see "N/A" or no data, it's an API configuration issue, not fake data.
