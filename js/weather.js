// Weather API Configuration
const API_CONFIG = {
    // Using Open-Meteo API (free, no key required)
    baseURL: 'https://api.open-meteo.com/v1',
    geocodingURL: 'https://geocoding-api.open-meteo.com/v1'
};

let currentLocationData = null;
let recentSearches = JSON.parse(localStorage.getItem('weatherSearches')) || [];

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    setupEventListeners();
    loadRecentSearches();
    loadDefaultLocation();
});

// Setup event listeners
function setupEventListeners() {
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');
    const locationBtn = document.getElementById('locationBtn');

    // Search functionality
    searchBtn.addEventListener('click', () => searchWeather());
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') searchWeather();
    });

    // Search suggestions
    searchInput.addEventListener('input', debounce(() => {
        const query = searchInput.value.trim();
        if (query.length > 2) {
            showSuggestions(query);
        } else {
            hideSuggestions();
        }
    }, 300));

    // Location button
    locationBtn.addEventListener('click', () => getUserLocation());
}

// Search weather by city
function searchWeather() {
    const searchInput = document.getElementById('searchInput');
    const city = searchInput.value.trim();

    if (!city) {
        showError('Please enter a city name');
        return;
    }

    fetchWeatherByCityName(city);
    hideSuggestions();
}

// Fetch weather by city name
async function fetchWeatherByCityName(cityName) {
    try {
        showLoading();
        hideError();

        // Geocode city name to coordinates
        const response = await fetch(
            `${API_CONFIG.geocodingURL}/search?name=${encodeURIComponent(cityName)}&count=1&language=en&format=json`
        );

        if (!response.ok) throw new Error('Failed to geocode location');
        const data = await response.json();

        if (!data.results || data.results.length === 0) {
            showError('City not found. Please try another search.');
            hideLoading();
            return;
        }

        const location = data.results[0];
        await fetchWeatherByCoordinates(location.latitude, location.longitude, location.name);
        addToRecentSearches(location.name);
    } catch (error) {
        console.error('Error fetching weather:', error);
        showError('Failed to fetch weather data. Please try again.');
    }
}

// Fetch weather by coordinates
async function fetchWeatherByCoordinates(lat, lon, locationName) {
    try {
        showLoading();
        hideError();

        // Main weather data
        const weatherResponse = await fetch(
            `${API_CONFIG.baseURL}/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m,pressure_msl,cloud_cover,visibility,uv_index&hourly=temperature_2m,relative_humidity_2m,precipitation_probability,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,precipitation_sum,precipitation_probability_max&timezone=auto&forecast_days=7`
        );

        if (!weatherResponse.ok) throw new Error('Failed to fetch weather');
        const weatherData = await weatherResponse.json();

        // Air quality data
        const aqiResponse = await fetch(
            `${API_CONFIG.baseURL}/air-quality?latitude=${lat}&longitude=${lon}&current=us_aqi,pm10,pm2_5,nitrogen_dioxide,sulphur_dioxide,ozone&timezone=auto`
        );

        let aqiData = null;
        if (aqiResponse.ok) {
            aqiData = await aqiResponse.json();
        }

        // Store location data
        currentLocationData = {
            name: locationName,
            latitude: lat,
            longitude: lon,
            weather: weatherData,
            aqi: aqiData
        };

        displayWeather(currentLocationData);
        hideLoading();
    } catch (error) {
        console.error('Error fetching weather:', error);
        showError('Failed to fetch weather data. Please try again.');
        hideLoading();
    }
}

// Get user's current location
function getUserLocation() {
    if ('geolocation' in navigator) {
        document.getElementById('searchBtn').disabled = true;
        showLoading();

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                // Get location name from coordinates
                getLocationName(latitude, longitude);
                document.getElementById('searchBtn').disabled = false;
            },
            (error) => {
                console.error('Geolocation error:', error);
                showError('Unable to get your location. Please enable location services.');
                hideLoading();
                document.getElementById('searchBtn').disabled = false;
            }
        );
    } else {
        showError('Geolocation is not supported in your browser.');
    }
}

// Get location name from coordinates
async function getLocationName(lat, lon) {
    try {
        const response = await fetch(
            `${API_CONFIG.geocodingURL}/reverse?latitude=${lat}&longitude=${lon}&language=en&format=json`
        );
        const data = await response.json();
        const locationName = data.results?.[0]?.name || 'Your Location';
        await fetchWeatherByCoordinates(lat, lon, locationName);
    } catch (error) {
        await fetchWeatherByCoordinates(lat, lon, 'Your Location');
    }
}

// Display weather information
function displayWeather(data) {
    const weather = data.weather;
    const current = weather.current;
    const daily = weather.daily;
    const hourly = weather.hourly;

    // Current weather
    displayCurrentWeather(data);

    // Extended details
    displayExtendedDetails(current, daily[0]);

    // Forecast
    displayForecast(daily);

    // Hourly
    displayHourlyForecast(hourly);

    // Air Quality
    if (data.aqi) {
        displayAirQuality(data.aqi);
    }

    // Show content
    document.getElementById('weatherContent').classList.remove('hidden');
}

// Display current weather
function displayCurrentWeather(data) {
    const current = data.weather.current;
    const daily = data.weather.daily;

    // Update location
    document.getElementById('cityName').textContent = data.name;
    document.getElementById('locationDetails').textContent = `${data.latitude.toFixed(2)}° N, ${data.longitude.toFixed(2)}° E`;
    document.getElementById('lastUpdate').textContent = `Updated: ${new Date(current.time).toLocaleString()}`;

    // Temperature
    const temp = Math.round(current.temperature_2m);
    document.getElementById('temperature').textContent = `${temp}°C`;

    // Weather description
    const weatherCode = current.weather_code;
    const description = getWeatherDescription(weatherCode);
    document.getElementById('weatherDesc').textContent = description.main;
    document.getElementById('weatherDetails').textContent = `Feels like ${Math.round(current.apparent_temperature)}°C`;

    // Weather icon
    const icon = getWeatherIcon(weatherCode);
    document.getElementById('weatherIcon').src = icon;
    document.getElementById('weatherIcon').alt = description.main;

    // Quick stats
    document.getElementById('humidity').textContent = `${current.relative_humidity_2m}%`;
    document.getElementById('windSpeed').textContent = `${(current.wind_speed_10m / 3.6).toFixed(1)} m/s`;
    document.getElementById('pressure').textContent = `${current.pressure_msl} hPa`;
    document.getElementById('visibility').textContent = `${(current.visibility / 1000).toFixed(1)} km`;
    document.getElementById('cloudCover').textContent = `${current.cloud_cover}%`;
    document.getElementById('uvIndex').textContent = current.uv_index.toFixed(1);
}

// Display extended details
function displayExtendedDetails(current, dailyData) {
    document.getElementById('feelsLike').textContent = `${Math.round(current.apparent_temperature)}°C`;
    document.getElementById('tempMin').textContent = `${Math.round(dailyData.temperature_2m_min)}°C`;
    document.getElementById('tempMax').textContent = `${Math.round(dailyData.temperature_2m_max)}°C`;
    document.getElementById('precipitation').textContent = `${dailyData.precipitation_sum.toFixed(1)} mm`;

    // Sunrise/Sunset
    const sunrise = new Date(dailyData.sunrise);
    const sunset = new Date(dailyData.sunset);
    document.getElementById('sunrise').textContent = sunrise.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    document.getElementById('sunset').textContent = sunset.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

    // Day length
    const dayLength = (new Date(dailyData.sunset) - new Date(dailyData.sunrise)) / (1000 * 60 * 60);
    document.getElementById('dayLength').textContent = `${dayLength.toFixed(1)} hours`;

    // Dew point (estimated)
    const dewPoint = estimateDewPoint(current.temperature_2m, current.relative_humidity_2m);
    document.getElementById('dewPoint').textContent = `${Math.round(dewPoint)}°C`;
}

// Display forecast
function displayForecast(daily) {
    const forecastGrid = document.getElementById('forecastGrid');
    forecastGrid.innerHTML = '';

    for (let i = 1; i < daily.time.length; i++) {
        const date = new Date(daily.time[i]);
        const weatherCode = daily.weather_code[i];
        const desc = getWeatherDescription(weatherCode);
        const icon = getWeatherIcon(weatherCode);
        const precipitation = daily.precipitation_probability_max[i];

        const card = document.createElement('div');
        card.className = 'forecast-card';
        card.innerHTML = `
            <div class="date">${date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</div>
            <img src="${icon}" alt="${desc.main}">
            <div class="temp">${Math.round(daily.temperature_2m_max[i])}°</div>
            <div class="desc">${desc.main}</div>
            <div class="chance">💧 ${precipitation}%</div>
        `;
        forecastGrid.appendChild(card);
    }
}

// Display hourly forecast
function displayHourlyForecast(hourly) {
    const hourlyGrid = document.getElementById('hourlyGrid');
    hourlyGrid.innerHTML = '';

    // Show next 24 hours
    for (let i = 0; i < Math.min(24, hourly.time.length); i++) {
        const date = new Date(hourly.time[i]);
        const temp = Math.round(hourly.temperature_2m[i]);
        const weatherCode = hourly.weather_code[i];
        const icon = getWeatherIcon(weatherCode);
        const precipitation = hourly.precipitation_probability[i];

        const card = document.createElement('div');
        card.className = 'hourly-card';
        card.innerHTML = `
            <div class="time">${date.toLocaleTimeString('en-US', { hour: '2-digit' })}</div>
            <img src="${icon}" alt="Weather">
            <div class="temp">${temp}°</div>
        `;
        hourlyGrid.appendChild(card);
    }
}

// Display air quality
function displayAirQuality(aqiData) {
    const current = aqiData.current;
    const aqi = Math.round(current.us_aqi);
    const aqiLabel = getAQILabel(aqi);

    document.getElementById('aqiValue').textContent = aqi;
    document.getElementById('aqiLabel').textContent = aqiLabel;

    // Pollutants
    const pollutantsGrid = document.getElementById('pollutantsGrid');
    pollutantsGrid.innerHTML = '';

    const pollutants = [
        { name: 'PM2.5', value: current.pm2_5, unit: 'µg/m³' },
        { name: 'PM10', value: current.pm10, unit: 'µg/m³' },
        { name: 'NO₂', value: current.nitrogen_dioxide, unit: 'µg/m³' },
        { name: 'SO₂', value: current.sulphur_dioxide, unit: 'µg/m³' },
        { name: 'O₃', value: current.ozone, unit: 'µg/m³' }
    ];

    pollutants.forEach(p => {
        if (p.value !== null) {
            const div = document.createElement('div');
            div.className = 'pollutant';
            div.innerHTML = `
                <div class="name">${p.name}</div>
                <div class="value">${Math.round(p.value)} <span style="font-size: 0.8rem;">${p.unit}</span></div>
            `;
            pollutantsGrid.appendChild(div);
        }
    });
}

// Show suggestions
async function showSuggestions(query) {
    try {
        const response = await fetch(
            `${API_CONFIG.geocodingURL}/search?name=${encodeURIComponent(query)}&count=5&language=en&format=json`
        );
        const data = await response.json();
        const suggestionsDiv = document.getElementById('suggestions');

        if (data.results && data.results.length > 0) {
            suggestionsDiv.innerHTML = data.results.map(result => `
                <div class="suggestion-item" onclick="selectSuggestion('${result.name}')">
                    ${result.name}${result.admin1 ? ', ' + result.admin1 : ''}${result.country ? ', ' + result.country : ''}
                </div>
            `).join('');
            suggestionsDiv.classList.add('show');
        }
    } catch (error) {
        console.error('Error fetching suggestions:', error);
    }
}

// Select suggestion
function selectSuggestion(cityName) {
    document.getElementById('searchInput').value = cityName;
    hideSuggestions();
    fetchWeatherByCityName(cityName);
}

// Hide suggestions
function hideSuggestions() {
    document.getElementById('suggestions').classList.remove('show');
}

// Recent searches
function addToRecentSearches(city) {
    recentSearches = recentSearches.filter(s => s !== city);
    recentSearches.unshift(city);
    recentSearches = recentSearches.slice(0, 5);
    localStorage.setItem('weatherSearches', JSON.stringify(recentSearches));
    loadRecentSearches();
}

function loadRecentSearches() {
    const recentList = document.getElementById('recentList');
    if (recentSearches.length === 0) {
        recentList.innerHTML = '<p class="empty">No recent searches</p>';
        return;
    }

    recentList.innerHTML = recentSearches.map(city => `
        <div class="recent-item">
            <span onclick="fetchWeatherByCityName('${city}')" style="cursor: pointer;">${city}</span>
            <span class="remove" onclick="removeRecent('${city}')">✕</span>
        </div>
    `).join('');
}

function removeRecent(city) {
    recentSearches = recentSearches.filter(s => s !== city);
    localStorage.setItem('weatherSearches', JSON.stringify(recentSearches));
    loadRecentSearches();
}

// Load default location
function loadDefaultLocation() {
    const lastCity = localStorage.getItem('lastWeatherCity');
    if (lastCity) {
        document.getElementById('searchInput').value = lastCity;
        fetchWeatherByCityName(lastCity);
    } else {
        document.getElementById('searchInput').value = 'London';
        fetchWeatherByCityName('London');
    }
}

// Utility functions
function getWeatherDescription(code) {
    const descriptions = {
        0: { main: 'Clear sky', icon: '☀️' },
        1: { main: 'Mainly clear', icon: '🌤️' },
        2: { main: 'Partly cloudy', icon: '⛅' },
        3: { main: 'Overcast', icon: '☁️' },
        45: { main: 'Foggy', icon: '🌫️' },
        48: { main: 'Depositing rime fog', icon: '🌫️' },
        51: { main: 'Light drizzle', icon: '🌦️' },
        53: { main: 'Moderate drizzle', icon: '🌧️' },
        55: { main: 'Dense drizzle', icon: '🌧️' },
        61: { main: 'Slight rain', icon: '🌧️' },
        63: { main: 'Moderate rain', icon: '🌧️' },
        65: { main: 'Heavy rain', icon: '⛈️' },
        71: { main: 'Slight snow', icon: '🌨️' },
        73: { main: 'Moderate snow', icon: '🌨️' },
        75: { main: 'Heavy snow', icon: '🌨️' },
        77: { main: 'Snow grains', icon: '🌨️' },
        80: { main: 'Slight rain showers', icon: '🌦️' },
        81: { main: 'Moderate rain showers', icon: '🌧️' },
        82: { main: 'Violent rain showers', icon: '⛈️' },
        85: { main: 'Slight snow showers', icon: '🌨️' },
        86: { main: 'Heavy snow showers', icon: '🌨️' },
        80: { main: 'Thunderstorm', icon: '⛈️' },
        81: { main: 'Thunderstorm with rain', icon: '⛈️' },
        82: { main: 'Thunderstorm with heavy rain', icon: '⛈️' },
        85: { main: 'Thunderstorm with light hail', icon: '⛈️' },
        86: { main: 'Thunderstorm with heavy hail', icon: '⛈️' }
    };
    return descriptions[code] || { main: 'Unknown', icon: '❓' };
}

function getWeatherIcon(code) {
    // Using Open-Meteo weather icons
    const iconMap = {
        0: '01d.png', // Clear
        1: '02d.png', // Mainly clear
        2: '03d.png', // Partly cloudy
        3: '04d.png', // Overcast
        45: '50d.png', // Foggy
        48: '50d.png', // Rime fog
        51: '09d.png', // Drizzle
        53: '09d.png',
        55: '09d.png',
        61: '10d.png', // Rain
        63: '10d.png',
        65: '10d.png',
        71: '13d.png', // Snow
        73: '13d.png',
        75: '13d.png',
        77: '13d.png',
        80: '09d.png', // Showers
        81: '10d.png',
        82: '10d.png',
        85: '13d.png',
        86: '13d.png'
    };
    const iconCode = iconMap[code] || '04d.png';
    return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
}

function getAQILabel(aqi) {
    if (aqi <= 50) return '✓ Good';
    if (aqi <= 100) return '⚠ Moderate';
    if (aqi <= 150) return '⚠ Unhealthy for Sensitive Groups';
    if (aqi <= 200) return '🚨 Unhealthy';
    if (aqi <= 300) return '🚨 Very Unhealthy';
    return '💀 Hazardous';
}

function estimateDewPoint(temp, humidity) {
    // Magnus formula for dew point estimation
    const a = 17.27;
    const b = 237.7;
    const ln = Math.log((humidity / 100) * Math.exp((a * temp) / (b + temp)));
    return (b * ln) / (a - ln);
}

// UI Utilities
function showLoading() {
    document.getElementById('loading').classList.remove('hidden');
}

function hideLoading() {
    document.getElementById('loading').classList.add('hidden');
}

function showError(message) {
    const errorDiv = document.getElementById('error');
    document.getElementById('errorText').textContent = message;
    errorDiv.classList.remove('hidden');
}

function hideError() {
    document.getElementById('error').classList.add('hidden');
}

// Debounce utility
function debounce(func, delay) {
    let timeoutId;
    return function (...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func(...args), delay);
    };
}

console.log('Weather Dashboard loaded successfully!');