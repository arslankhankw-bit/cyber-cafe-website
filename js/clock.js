// Time zones configuration
const timeZones = {
    newyork: { timezone: 'America/New_York', name: 'New York', country: '🇺🇸' },
    mexicocity: { timezone: 'America/Mexico_City', name: 'Mexico City', country: '🇲🇽' },
    saopaulo: { timezone: 'America/Sao_Paulo', name: 'São Paulo', country: '🇧🇷' },
    london: { timezone: 'Europe/London', name: 'London', country: '🇬🇧' },
    berlin: { timezone: 'Europe/Berlin', name: 'Berlin', country: '🇩🇪' },
    dubai: { timezone: 'Asia/Dubai', name: 'Dubai', country: '🇦🇪' },
    delhi: { timezone: 'Asia/Kolkata', name: 'New Delhi', country: '🇮🇳' },
    bangkok: { timezone: 'Asia/Bangkok', name: 'Bangkok', country: '🇹🇭' },
    shanghai: { timezone: 'Asia/Shanghai', name: 'Shanghai', country: '🇨🇳' },
    tokyo: { timezone: 'Asia/Tokyo', name: 'Tokyo', country: '🇯🇵' },
    sydney: { timezone: 'Australia/Sydney', name: 'Sydney', country: '🇦🇺' },
    auckland: { timezone: 'Pacific/Auckland', name: 'Auckland', country: '🇳🇿' }
};

// Settings
let currentFormat = '12'; // 12 or 24 hour format
let updateSpeed = 1000; // milliseconds
let updateInterval = null;

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    initializeClocks();
    setupEventListeners();
    updateAllClocks();
});

// Initialize clocks
function initializeClocks() {
    // Set initial theme
    const savedTheme = localStorage.getItem('clockTheme') || 'dark';
    if (savedTheme === 'light') {
        document.documentElement.classList.add('light-mode');
        document.getElementById('toggleTheme').innerHTML = '<i class="fas fa-sun"></i> Light Mode';
    }

    // Set initial format from localStorage
    const savedFormat = localStorage.getItem('timeFormat') || '12';
    currentFormat = savedFormat;
    document.getElementById('timeFormat').value = currentFormat;

    // Set initial update speed
    document.getElementById('clockSpeed').value = updateSpeed;
}

// Setup event listeners
function setupEventListeners() {
    // Time format change
    document.getElementById('timeFormat').addEventListener('change', (e) => {
        currentFormat = e.target.value;
        localStorage.setItem('timeFormat', currentFormat);
        updateAllClocks();
    });

    // Update speed change
    document.getElementById('clockSpeed').addEventListener('change', (e) => {
        updateSpeed = parseInt(e.target.value);
        clearInterval(updateInterval);
        startClockUpdates();
    });

    // Theme toggle
    document.getElementById('toggleTheme').addEventListener('click', () => {
        const isDark = document.documentElement.classList.toggle('light-mode');
        const theme = isDark ? 'light' : 'dark';
        localStorage.setItem('clockTheme', theme);
        document.getElementById('toggleTheme').innerHTML = isDark 
            ? '<i class="fas fa-sun"></i> Light Mode' 
            : '<i class="fas fa-moon"></i> Dark Mode';
    });

    // Start continuous updates
    startClockUpdates();
}

// Start clock updates
function startClockUpdates() {
    updateInterval = setInterval(updateAllClocks, updateSpeed);
}

// Update all clocks
function updateAllClocks() {
    const now = new Date();

    // Update each timezone
    for (const [key, tzData] of Object.entries(timeZones)) {
        updateClock(key, tzData);
    }

    // Update UTC/Server time
    updateUTCClock(now);

    // Update DST information
    updateDSTInfo();
}

// Update individual clock
function updateClock(key, tzData) {
    try {
        // Get time in specific timezone
        const formatter = new Intl.DateTimeFormat('en-US', {
            timeZone: tzData.timezone,
            hour: 'numeric',
            minute: '2-digit',
            second: '2-digit',
            hour12: currentFormat === '12',
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        const parts = new Intl.DateTimeFormat('en-US', {
            timeZone: tzData.timezone,
            hour: 'numeric',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
        }).formatToParts(new Date());

        // Build time string
        let timeString = formatter.format(new Date());
        const timeMatch = timeString.match(/\d{1,2}:\d{2}:\d{2}\s?(AM|PM)?/);
        const dateMatch = timeString.match(/(\w+,\s\w+\s\d{1,2})/);

        let hours = parseInt(parts.find(p => p.type === 'hour').value);
        let minutes = parts.find(p => p.type === 'minute').value;
        let seconds = parts.find(p => p.type === 'second').value;

        // Format time
        let displayTime;
        if (currentFormat === '24') {
            displayTime = `${String(hours).padStart(2, '0')}:${minutes}:${seconds}`;
        } else {
            const period = hours >= 12 ? 'PM' : 'AM';
            const displayHours = hours % 12 || 12;
            displayTime = `${String(displayHours).padStart(2, '0')}:${minutes}:${seconds} ${period}`;
        }

        // Update time display
        const timeElement = document.getElementById(`time-${key}`);
        if (timeElement) {
            timeElement.textContent = displayTime;
        }

        // Calculate and display UTC offset
        const utcDate = new Date();
        const tzDate = new Date(utcDate.toLocaleString('en-US', { timeZone: tzData.timezone }));
        const offset = (tzDate - utcDate) / (1000 * 60 * 60);
        const offsetHours = Math.floor(offset);
        const offsetMinutes = Math.abs((offset % 1) * 60);
        const offsetString = `UTC${offsetHours >= 0 ? '+' : ''}${offsetHours}${offsetMinutes > 0 ? ':' + String(offsetMinutes).padStart(2, '0') : ''}`;

        const offsetElement = document.getElementById(`offset-${key}`);
        if (offsetElement) {
            offsetElement.textContent = offsetString;
        }
    } catch (error) {
        console.error(`Error updating clock for ${key}:`, error);
    }
}

// Update UTC/Server time
function updateUTCClock(now) {
    const formatter = new Intl.DateTimeFormat('en-US', {
        timeZone: 'UTC',
        hour: 'numeric',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    const formattedUTC = formatter.format(now);
    const utcParts = formattedUTC.match(/(\d{1,2}):(\d{2}):(\d{2})/);

    if (utcParts) {
        const hours = String(utcParts[1]).padStart(2, '0');
        const minutes = utcParts[2];
        const seconds = utcParts[3];
        const timeString = `${hours}:${minutes}:${seconds} UTC`;

        const timeElement = document.getElementById('time-utc');
        if (timeElement) {
            timeElement.textContent = timeString;
        }

        // Extract and update date
        const dateMatch = formattedUTC.match(/(\w+,\s\w+\s\d{1,2},\s\d{4})/);
        if (dateMatch) {
            const dateElement = document.getElementById('date-utc');
            if (dateElement) {
                dateElement.textContent = dateMatch[1];
            }
        }
    }
}

// Update DST information
function updateDSTInfo() {
    const now = new Date();
    const dstInfo = document.getElementById('dst-info');
    if (!dstInfo) return;

    const dstStatuses = [];

    // Check DST for major locations
    const checkLocations = [
        { name: 'New York', timezone: 'America/New_York' },
        { name: 'London', timezone: 'Europe/London' },
        { name: 'Tokyo', timezone: 'Asia/Tokyo' }
    ];

    checkLocations.forEach(loc => {
        const tzName = new Intl.DateTimeFormat('en-US', {
            timeZone: loc.timezone,
            timeZoneName: 'long'
        }).formatToParts(now).find(part => part.type === 'timeZoneName')?.value;

        if (tzName) {
            const isDST = tzName.includes('Daylight') || tzName.includes('Summer');
            const status = `${loc.name}: ${isDST ? '✓ DST Active' : '✗ Standard Time'}`;
            dstStatuses.push(`<li>${status}</li>`);
        }
    });

    if (dstStatuses.length > 0) {
        dstInfo.innerHTML = dstStatuses.join('');
    }
}

// Utility: Get time difference from UTC
function getUTCOffset(timezone) {
    const now = new Date();
    const utcDate = new Date(now.toLocaleString('en-US', { timeZone: 'UTC' }));
    const tzDate = new Date(now.toLocaleString('en-US', { timeZone: timezone }));
    return (tzDate - utcDate) / (1000 * 60 * 60);
}

// Export functions for potential external use
window.clockApp = {
    updateAllClocks,
    getCurrentFormat: () => currentFormat,
    setFormat: (format) => {
        currentFormat = format;
        document.getElementById('timeFormat').value = format;
        localStorage.setItem('timeFormat', format);
        updateAllClocks();
    },
    getUpdateSpeed: () => updateSpeed,
    setUpdateSpeed: (speed) => {
        updateSpeed = speed;
        document.getElementById('clockSpeed').value = speed;
        clearInterval(updateInterval);
        startClockUpdates();
    }
};

// Handle visibility change to save resources
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        clearInterval(updateInterval);
    } else {
        startClockUpdates();
        updateAllClocks();
    }
});

console.log('Digital Clock with Time Zones loaded successfully!');
console.log('Available commands:', window.clockApp);