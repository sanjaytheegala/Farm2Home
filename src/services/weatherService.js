// Weather Service for Agriculture Portal
// This service can be extended to integrate with real weather APIs like OpenWeatherMap, WeatherAPI, etc.

class WeatherService {
  constructor() {
    // In a real implementation, you would store API keys here
    this.apiKey = process.env.REACT_APP_WEATHER_API_KEY || null;
    this.baseUrl = 'https://api.openweathermap.org/data/2.5';
  }

  // Location mapping for states and districts to available weather data
  getLocationMapping(location) {
    const locationMap = {
      // Telangana districts
      'adilabad': 'hyderabad',
      'bhadradri kothagudem': 'hyderabad',
      'hanumakonda': 'hyderabad',
      'hyderabad': 'hyderabad',
      'jagtial': 'hyderabad',
      'jangaon': 'hyderabad',
      'jayashankar bhupalpally': 'hyderabad',
      'jogulamba gadwal': 'hyderabad',
      'kamareddy': 'hyderabad',
      'karimnagar': 'hyderabad',
      'khammam': 'hyderabad',
      'kumuram bheem': 'hyderabad',
      'mahabubabad': 'hyderabad',
      'mahabubnagar': 'hyderabad',
      'mancherial': 'hyderabad',
      'medak': 'hyderabad',
      'medchal–malkajgiri': 'hyderabad',
      'mulugu': 'hyderabad',
      'nagarkurnool': 'hyderabad',
      'nalgonda': 'hyderabad',
      'narayanpet': 'hyderabad',
      'nirmal': 'hyderabad',
      'nizamabad': 'nizamabad',
      'peddapalli': 'hyderabad',
      'rajanna sircilla': 'hyderabad',
      'rangareddy': 'hyderabad',
      'sangareddy': 'hyderabad',
      'siddipet': 'hyderabad',
      'suryapet': 'hyderabad',
      'vikarabad': 'hyderabad',
      'wanaparthy': 'hyderabad',
      'warangal rural': 'hyderabad',
      'warangal urban': 'hyderabad',
      'yadadri bhuvanagiri': 'hyderabad',
      'telangana': 'hyderabad',
      
      // Maharashtra districts
      'ahmednagar': 'mumbai',
      'akola': 'mumbai',
      'amravati': 'mumbai',
      'aurangabad': 'mumbai',
      'beed': 'mumbai',
      'bhandara': 'mumbai',
      'buldhana': 'mumbai',
      'chandrapur': 'mumbai',
      'dhule': 'mumbai',
      'gadchiroli': 'mumbai',
      'gondia': 'mumbai',
      'hingoli': 'mumbai',
      'jalgaon': 'mumbai',
      'jalna': 'mumbai',
      'kolhapur': 'mumbai',
      'latur': 'mumbai',
      'mumbai': 'mumbai',
      'mumbai city': 'mumbai',
      'mumbai suburban': 'mumbai',
      'nagpur': 'mumbai',
      'nanded': 'mumbai',
      'nashik': 'mumbai',
      'osmanabad': 'mumbai',
      'palghar': 'mumbai',
      'parbhani': 'mumbai',
      'pune': 'mumbai',
      'raigad': 'mumbai',
      'ratnagiri': 'mumbai',
      'sangli': 'mumbai',
      'satara': 'mumbai',
      'sindhudurg': 'mumbai',
      'solapur': 'mumbai',
      'thane': 'mumbai',
      'wardha': 'mumbai',
      'washim': 'mumbai',
      'yavatmal': 'mumbai',
      'maharashtra': 'mumbai',
      
      // Delhi districts
      'central delhi': 'delhi',
      'delhi': 'delhi',
      'east delhi': 'delhi',
      'new delhi': 'delhi',
      'north delhi': 'delhi',
      'north east delhi': 'delhi',
      'north west delhi': 'delhi',
      'shahdara': 'delhi',
      'south delhi': 'delhi',
      'south east delhi': 'delhi',
      'south west delhi': 'delhi',
      'west delhi': 'delhi',
      
      // Karnataka districts
      'bagalkot': 'bangalore',
      'ballari': 'bangalore',
      'belagavi': 'bangalore',
      'bengaluru rural': 'bangalore',
      'bengaluru urban': 'bangalore',
      'bidar': 'bangalore',
      'chamarajanagar': 'bangalore',
      'chikballapur': 'bangalore',
      'chikkamagaluru': 'bangalore',
      'chitradurga': 'bangalore',
      'dakshina kannada': 'bangalore',
      'davanagere': 'bangalore',
      'dharwad': 'bangalore',
      'gadag': 'bangalore',
      'hassan': 'bangalore',
      'haveri': 'bangalore',
      'kalaburagi': 'bangalore',
      'kodagu': 'bangalore',
      'kolar': 'bangalore',
      'koppal': 'bangalore',
      'mandya': 'bangalore',
      'mysuru': 'bangalore',
      'raichur': 'bangalore',
      'ramanagara': 'bangalore',
      'shivamogga': 'bangalore',
      'tumakuru': 'bangalore',
      'udupi': 'bangalore',
      'uttara kannada': 'bangalore',
      'vijayapura': 'bangalore',
      'yadgir': 'bangalore',
      'karnataka': 'bangalore'
    };

    const normalizedLocation = location.toLowerCase().trim();
    return locationMap[normalizedLocation] || 'hyderabad';
  }

  // Simulated weather data for different locations
  getMockWeatherData(location) {
    const weatherData = {
      'hyderabad': {
        current: {
          temp: 32,
          humidity: 65,
          windSpeed: 12,
          condition: 'sunny',
          feelsLike: 35,
          pressure: 1013,
          visibility: 10,
          uvIndex: 8
        },
        forecast: [
          { day: 'Today', temp: 32, condition: 'sunny', humidity: 65, windSpeed: 12 },
          { day: 'Tomorrow', temp: 30, condition: 'cloudy', humidity: 70, windSpeed: 8 },
          { day: 'Day 3', temp: 28, condition: 'rainy', humidity: 85, windSpeed: 15 },
          { day: 'Day 4', temp: 31, condition: 'partly-cloudy', humidity: 60, windSpeed: 10 },
          { day: 'Day 5', temp: 33, condition: 'sunny', humidity: 55, windSpeed: 6 }
        ]
      },
      'mumbai': {
        current: {
          temp: 30,
          humidity: 80,
          windSpeed: 15,
          condition: 'cloudy',
          feelsLike: 33,
          pressure: 1010,
          visibility: 8,
          uvIndex: 6
        },
        forecast: [
          { day: 'Today', temp: 30, condition: 'cloudy', humidity: 80, windSpeed: 15 },
          { day: 'Tomorrow', temp: 29, condition: 'rainy', humidity: 85, windSpeed: 18 },
          { day: 'Day 3', temp: 31, condition: 'partly-cloudy', humidity: 75, windSpeed: 12 },
          { day: 'Day 4', temp: 32, condition: 'sunny', humidity: 70, windSpeed: 10 },
          { day: 'Day 5', temp: 30, condition: 'cloudy', humidity: 78, windSpeed: 14 }
        ]
      },
      'delhi': {
        current: {
          temp: 35,
          humidity: 45,
          windSpeed: 8,
          condition: 'sunny',
          feelsLike: 38,
          pressure: 1008,
          visibility: 12,
          uvIndex: 9
        },
        forecast: [
          { day: 'Today', temp: 35, condition: 'sunny', humidity: 45, windSpeed: 8 },
          { day: 'Tomorrow', temp: 33, condition: 'partly-cloudy', humidity: 50, windSpeed: 10 },
          { day: 'Day 3', temp: 31, condition: 'cloudy', humidity: 60, windSpeed: 12 },
          { day: 'Day 4', temp: 34, condition: 'sunny', humidity: 48, windSpeed: 7 },
          { day: 'Day 5', temp: 36, condition: 'sunny', humidity: 42, windSpeed: 6 }
        ]
      },
      'bangalore': {
        current: {
          temp: 26,
          humidity: 70,
          windSpeed: 10,
          condition: 'partly-cloudy',
          feelsLike: 28,
          pressure: 1015,
          visibility: 15,
          uvIndex: 7
        },
        forecast: [
          { day: 'Today', temp: 26, condition: 'partly-cloudy', humidity: 70, windSpeed: 10 },
          { day: 'Tomorrow', temp: 25, condition: 'rainy', humidity: 80, windSpeed: 12 },
          { day: 'Day 3', temp: 27, condition: 'cloudy', humidity: 75, windSpeed: 8 },
          { day: 'Day 4', temp: 28, condition: 'sunny', humidity: 65, windSpeed: 6 },
          { day: 'Day 5', temp: 26, condition: 'partly-cloudy', humidity: 72, windSpeed: 9 }
        ]
      },
      'nizamabad': {
        current: {
          temp: 34,
          humidity: 60,
          windSpeed: 14,
          condition: 'sunny',
          feelsLike: 37,
          pressure: 1012,
          visibility: 11,
          uvIndex: 9
        },
        forecast: [
          { day: 'Today', temp: 34, condition: 'sunny', humidity: 60, windSpeed: 14 },
          { day: 'Tomorrow', temp: 32, condition: 'partly-cloudy', humidity: 65, windSpeed: 10 },
          { day: 'Day 3', temp: 30, condition: 'cloudy', humidity: 75, windSpeed: 12 },
          { day: 'Day 4', temp: 33, condition: 'sunny', humidity: 58, windSpeed: 8 },
          { day: 'Day 5', temp: 35, condition: 'sunny', humidity: 55, windSpeed: 6 }
        ]
      }
    };

    // Map the location to available weather data
    const mappedLocation = this.getLocationMapping(location);
    return weatherData[mappedLocation] || weatherData['hyderabad'];
  }

  // Real API integration method (commented out for now)
  async getRealWeatherData(location) {
    if (!this.apiKey) {
      throw new Error('Weather API key not configured');
    }

    try {
      // Current weather
      const currentResponse = await fetch(
        `${this.baseUrl}/weather?q=${location}&appid=${this.apiKey}&units=metric`
      );
      const currentData = await currentResponse.json();

      // 5-day forecast
      const forecastResponse = await fetch(
        `${this.baseUrl}/forecast?q=${location}&appid=${this.apiKey}&units=metric`
      );
      const forecastData = await forecastResponse.json();

      return {
        current: {
          temp: currentData.main.temp,
          humidity: currentData.main.humidity,
          windSpeed: currentData.wind.speed,
          condition: currentData.weather[0].main.toLowerCase(),
          feelsLike: currentData.main.feels_like,
          pressure: currentData.main.pressure,
          visibility: currentData.visibility / 1000, // Convert to km
          uvIndex: 0 // Would need separate API call
        },
        forecast: this.processForecastData(forecastData)
      };
    } catch (error) {
      console.error('Error fetching weather data:', error);
      throw error;
    }
  }

  processForecastData(forecastData) {
    // Process the 5-day forecast data from API
    const dailyData = {};
    
    forecastData.list.forEach(item => {
      const date = new Date(item.dt * 1000);
      const day = date.toLocaleDateString('en-US', { weekday: 'short' });
      
      if (!dailyData[day]) {
        dailyData[day] = {
          day: day,
          temp: item.main.temp,
          condition: item.weather[0].main.toLowerCase(),
          humidity: item.main.humidity,
          windSpeed: item.wind.speed
        };
      }
    });

    return Object.values(dailyData).slice(0, 5);
  }

  // Get weather data (currently using mock data)
  async getWeatherData(location) {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For now, return mock data
      // In production, you would call: return await this.getRealWeatherData(location);
      return this.getMockWeatherData(location);
    } catch (error) {
      console.error('Error getting weather data:', error);
      throw error;
    }
  }

  // Get farming advice based on weather conditions
  getFarmingAdvice(weatherData) {
    if (!weatherData) return '';

    const { temp, humidity, windSpeed, condition } = weatherData;
    
    const advice = [];

    // Temperature-based advice
    if (temp > 35) {
      advice.push('High temperature detected. Increase irrigation frequency for sensitive crops.');
    } else if (temp < 20) {
      advice.push('Cool weather conditions. Good for winter crops like wheat and mustard.');
    }

    // Humidity-based advice
    if (humidity > 80) {
      advice.push('High humidity. Monitor for fungal diseases and avoid spraying pesticides.');
    } else if (humidity < 50) {
      advice.push('Low humidity. Consider misting for greenhouse crops.');
    }

    // Wind-based advice
    if (windSpeed > 15) {
      advice.push('Strong winds detected. Secure crops and avoid spraying operations.');
    }

    // Condition-based advice
    if (condition === 'rainy') {
      advice.push('Rainy conditions. Ideal for rice and water-intensive crops. Avoid field operations.');
    } else if (condition === 'sunny' && temp > 30) {
      advice.push('Hot and sunny. Provide shade for sensitive crops and increase watering.');
    }

    return advice.length > 0 ? advice.join(' ') : 'Favorable weather conditions for most crops. Continue regular farming activities.';
  }

  // Get crop-specific weather recommendations
  getCropWeatherRecommendations(crop, weatherData) {
    const recommendations = {
      'rice': {
        ideal: { temp: [25, 35], humidity: [70, 90] },
        advice: 'Rice thrives in warm, humid conditions with standing water.'
      },
      'wheat': {
        ideal: { temp: [15, 25], humidity: [50, 70] },
        advice: 'Wheat prefers cool, moderate humidity conditions.'
      },
      'cotton': {
        ideal: { temp: [25, 35], humidity: [60, 80] },
        advice: 'Cotton needs warm temperatures and moderate humidity.'
      },
      'maize': {
        ideal: { temp: [20, 30], humidity: [60, 80] },
        advice: 'Maize grows well in warm, moderately humid conditions.'
      }
    };

    const cropRec = recommendations[crop.toLowerCase()];
    if (!cropRec) return 'No specific weather recommendations available for this crop.';

    const { temp, humidity } = weatherData;
    const tempInRange = temp >= cropRec.ideal.temp[0] && temp <= cropRec.ideal.temp[1];
    const humidityInRange = humidity >= cropRec.ideal.humidity[0] && humidity <= cropRec.ideal.humidity[1];

    if (tempInRange && humidityInRange) {
      return `Excellent conditions for ${crop}. ${cropRec.advice}`;
    } else {
      return `Weather conditions may not be optimal for ${crop}. ${cropRec.advice}`;
    }
  }

  // Get seasonal farming recommendations
  getSeasonalRecommendations(month) {
    const seasonalAdvice = {
      1: 'Winter crops: Wheat, Barley, Mustard. Prepare for spring planting.',
      2: 'Late winter: Continue wheat cultivation. Start preparing for summer crops.',
      3: 'Spring: Plant summer vegetables and early kharif crops.',
      4: 'Early summer: Plant cotton, maize. Irrigate regularly.',
      5: 'Summer: Focus on irrigation. Plant heat-tolerant crops.',
      6: 'Monsoon onset: Plant rice, pulses. Prepare for kharif season.',
      7: 'Monsoon: Ideal for rice, maize, cotton. Monitor for pests.',
      8: 'Late monsoon: Continue kharif crops. Prepare for rabi season.',
      9: 'Post-monsoon: Harvest kharif crops. Prepare for rabi planting.',
      10: 'Rabi season: Plant wheat, barley, mustard.',
      11: 'Early winter: Continue rabi crops. Protect from cold.',
      12: 'Winter: Maintain rabi crops. Prepare for next cycle.'
    };

    return seasonalAdvice[month] || 'Continue regular farming activities based on local conditions.';
  }
}

export default new WeatherService(); 