# Weather Dashboard

A comprehensive weather dashboard that fetches real-time weather data from the free Open-Meteo API. No API key required!

## Features

### 🌍 Core Features

**Real-Time Weather Data**
- Current temperature and conditions
- Feels-like temperature
- Humidity, wind speed, pressure
- Visibility and cloud cover
- UV index

**Comprehensive Forecasts**
- 7-day weather forecast
- Hourly forecast (24 hours)
- Precipitation probability
- Min/max temperatures
- Sunrise/sunset times

**Air Quality Information**
- Air Quality Index (AQI)
- Pollutant levels (PM2.5, PM10, NO₂, SO₂, O₃)
- AQI category labels

**User-Friendly Interface**
- Search by city name
- Geolocation support (use your current location)
- Auto-complete suggestions
- Recent searches history
- Responsive design (desktop, tablet, mobile)

## File Structure

```
cyber-cafe-website/
├── weather.html              # Main weather dashboard page
├── css/
│   └── weather.css          # Weather dashboard styling
├── js/
│   └── weather.js           # Weather functionality
└── README-WEATHER.md        # This file
```

## How to Use

1. **Open weather.html** in your web browser
2. **Search for a city** by typing in the search box
3. **Use suggestions** to quickly select a location
4. **Click "My Location"** to use geolocation
5. **Check recent searches** to quickly revisit previous locations
6. **View detailed information** about current weather and forecasts

## API Information

### Open-Meteo API
- **URL**: https://api.open-meteo.com/v1
- **Type**: RESTful API
- **Authentication**: None (free public API)
- **Rate Limit**: None specified
- **CORS**: Enabled

### Endpoints Used

**1. Forecast Endpoint**
```
GET /forecast?latitude=LAT&longitude=LON&current=...&hourly=...&daily=...&timezone=auto
```

**2. Geocoding Endpoint**
```
GET https://geocoding-api.open-meteo.com/v1/search?name=CITY&count=5
```

**3. Reverse Geocoding**
```
GET https://geocoding-api.open-meteo.com/v1/reverse?latitude=LAT&longitude=LON
```

**4. Air Quality Endpoint**
```
GET /air-quality?latitude=LAT&longitude=LON&current=...
```

## Technical Details

### Technologies Used
- **HTML5**: Semantic markup
- **CSS3**: Modern styling with animations
- **Vanilla JavaScript**: No external dependencies
- **Fetch API**: For HTTP requests
- **localStorage**: For storing preferences and search history
- **Geolocation API**: For user location

### Browser Compatibility
- Chrome/Chromium (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers

## Features Explained

### Search Functionality
- Type city name to get suggestions
- Debounced input for performance
- Click suggestion to fetch weather
- Press Enter to search

### Geolocation
- "My Location" button uses browser's Geolocation API
- Converts coordinates to city name
- Fetches weather for your location

### Recent Searches
- Automatically saves up to 5 recent searches
- Stored in localStorage
- Click to quickly fetch that location's weather
- Remove button to delete from history

### Weather Information Displayed

**Current Conditions**
- Temperature (Celsius)
- Weather description
- Weather icon
- Feels-like temperature

**Quick Stats**
- Humidity (%)
- Wind Speed (m/s)
- Pressure (hPa)
- Visibility (km)
- Cloud Cover (%)
- UV Index

**Extended Details**
- Feels Like temperature
- Min/Max temperatures
- Dew Point
- Sunrise/Sunset times
- Day Length
- Precipitation (mm)

**Forecasts**
- 7-day forecast with:
  - High/Low temperatures
  - Weather conditions
  - Precipitation chance
  
- Hourly forecast (24 hours) with:
  - Hourly temperature
  - Weather conditions
  - Hourly icons

**Air Quality**
- AQI value and category
- Pollutant levels:
  - PM2.5 (Fine particulates)
  - PM10 (Coarse particulates)
  - NO₂ (Nitrogen Dioxide)
  - SO₂ (Sulfur Dioxide)
  - O₃ (Ozone)

## Customization

### Change Default Location

Edit `js/weather.js`:
```javascript
function loadDefaultLocation() {
    // Change 'London' to your preferred city
    document.getElementById('searchInput').value = 'London';
    fetchWeatherByCityName('London');
}
```

### Change Temperature Units

Modify API request in `fetchWeatherByCoordinates()`:
```javascript
// Add &temperature_unit=fahrenheit to URL for Fahrenheit
```

### Customize Colors

Edit CSS variables in `css/weather.css`:
```css
:root {
    --primary-color: #00d4ff;      /* Main accent */
    --secondary-color: #ff00ff;    /* Secondary accent */
    /* ... more variables */
}
```

### Add More Weather Parameters

Modify the API request in `fetchWeatherByCoordinates()`:
```javascript
// Add parameters to current= and daily= query strings
```

## Weather Codes Reference

The API uses WMO weather codes:
- 0: Clear sky
- 1-2: Mainly/Partly cloudy
- 3: Overcast
- 45-48: Foggy
- 51-55: Drizzle
- 61-65: Rain
- 71-75: Snow
- 80-82: Rain showers
- 85-86: Snow showers

## AQI Scale

- 0-50: Good ✓
- 51-100: Moderate ⚠
- 101-150: Unhealthy for Sensitive Groups ⚠
- 151-200: Unhealthy 🚨
- 201-300: Very Unhealthy 🚨
- 300+: Hazardous 💀

## Performance Optimization

1. **Debouncing**: Search suggestions debounced to 300ms
2. **Caching**: Weather data stored in memory
3. **localStorage**: Stores search history
4. **Lazy Loading**: Data fetched only when needed
5. **Responsive Images**: Weather icons from CDN

## Privacy

- No user data is stored permanently
- Location data used only for weather fetching
- No tracking or analytics
- All API calls go directly to Open-Meteo
- Search history stored locally only

## Troubleshooting

**Weather data not loading?**
- Check internet connection
- Verify city name spelling
- Try a different city
- Check browser console for errors

**Geolocation not working?**
- Enable location permissions in browser
- Check if HTTPS or localhost
- Some browsers require user confirmation

**Old data showing?**
- Refresh the page (Ctrl+F5)
- Clear localStorage
- Check system time

## API Rate Limits

- Open-Meteo has no rate limits for free tier
- Up to 10,000 API calls per day
- Recommended to cache data locally

## Browser Support

| Feature | Support |
|---------|----------|
| Fetch API | ✅ All modern browsers |
| localStorage | ✅ All modern browsers |
| Geolocation | ✅ All modern browsers |
| CSS Grid | ✅ All modern browsers |
| CSS Variables | ✅ All modern browsers |

## Future Enhancements

- [ ] Multiple location comparison
- [ ] Weather alerts and warnings
- [ ] Historical weather data
- [ ] Weather maps visualization
- [ ] Export weather data
- [ ] Favorite locations
- [ ] Temperature unit toggle (°C/°F)
- [ ] Wind speed unit toggle
- [ ] Weather notifications
- [ ] PWA (Progressive Web App) support

## API Documentation

For more information about Open-Meteo API:
- Website: https://open-meteo.com
- Documentation: https://open-meteo.com/en/docs
- Weather API Docs: https://open-meteo.com/en/docs
- Air Quality Docs: https://open-meteo.com/en/docs/air-quality-api

## License

Free to use and modify for personal and commercial projects.

## Support

For issues or feature requests, check the main repository documentation.

---

**Created with ❤️ for weather enthusiasts**