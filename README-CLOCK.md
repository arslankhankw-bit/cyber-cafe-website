# Digital Clock with Time Zones

A beautiful, interactive digital clock that displays the current time across 12 different time zones around the world.

## Features

### 🌍 Time Zones Displayed
1. **New York** (EST/EDT - UTC-5/-4)
2. **Mexico City** (CST/CDT - UTC-6/-5)
3. **São Paulo** (BRT/BRST - UTC-3/-2)
4. **London** (GMT/BST - UTC+0/+1)
5. **Berlin** (CET/CEST - UTC+1/+2)
6. **Dubai** (GST - UTC+4)
7. **New Delhi** (IST - UTC+5:30)
8. **Bangkok** (ICT - UTC+7)
9. **Shanghai** (CST - UTC+8)
10. **Tokyo** (JST - UTC+9)
11. **Sydney** (AEST/AEDT - UTC+10/+11)
12. **Auckland** (NZST/NZDT - UTC+12/+13)

### ✨ Functionality

**Real-time Updates**
- Automatic clock updates with configurable refresh speeds
- Precise time calculation using Intl API
- Smooth transitions between updates

**Time Format Options**
- 12-Hour Format (with AM/PM)
- 24-Hour Format
- Toggle between formats with instant updates

**Customizable Update Speed**
- Normal (1 second)
- Fast (0.1 second)
- Very Fast (0.01 second)
- Adjust for performance optimization

**Theme Support**
- Dark Mode (default, cyberpunk aesthetic)
- Light Mode (clean, professional)
- One-click theme toggle
- Theme preference saved to localStorage

**UTC/Server Time Display**
- Dedicated server time section
- Always shows Coordinated Universal Time
- Pulsing animation for emphasis

**Daylight Saving Time (DST)**
- Automatic DST detection
- Real-time DST status for major locations
- Updates reflect DST changes

**User-Friendly Design**
- Responsive grid layout
- Hover effects on clock cards
- Country flags for quick identification
- Smooth animations
- Clear timezone information

## File Structure

```
cyber-cafe-website/
├── clock.html              # Main clock page
├── css/
│   └── clock.css          # Clock styling
├── js/
│   └── clock.js           # Clock functionality
└── README-CLOCK.md        # This file
```

## How to Use

1. **Open the clock.html** in your web browser
2. **Select time format** from the dropdown (12-hour or 24-hour)
3. **Adjust update speed** based on your needs
4. **Toggle theme** using the Dark/Light mode button
5. **View UTC time** in the dedicated server section
6. **Check DST status** in the information panel

## Technical Details

### Technologies Used
- **HTML5**: Semantic markup
- **CSS3**: Modern styling with CSS variables and animations
- **Vanilla JavaScript**: No external dependencies for core functionality
- **Intl API**: Native timezone handling

### Browser Compatibility
- Chrome/Chromium (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

### Performance Features
- Efficient interval management
- Resource cleanup on page visibility change
- Optimized DOM updates
- CSS animations for smooth visuals

## Customization

### Adding New Time Zones

Edit `js/clock.js` and add to the `timeZones` object:

```javascript
newtimezone: { timezone: 'Region/City', name: 'Display Name', country: '🌍' }
```

Then add corresponding HTML in `clock.html`:

```html
<div class="clock-card">
    <div class="card-header">
        <h2>🌍 City Name</h2>
        <p class="timezone">TZ (UTC±X)</p>
    </div>
    <div class="digital-display">
        <div class="time" id="time-newtimezone">00:00:00</div>
        <div class="date" id="date-newtimezone">Monday, Jan 1</div>
    </div>
    <div class="card-footer">
        <small id="offset-newtimezone">UTC±X</small>
    </div>
</div>
```

### Changing Colors

Modify CSS variables in `clock.css`:

```css
:root {
    --primary-color: #00d4ff;      /* Main accent color */
    --secondary-color: #ff00ff;    /* Gradient color */
    --dark-bg: #0a0e27;           /* Background */
    /* ... more variables */
}
```

### Adjusting Update Speed

Modify the default update speed in `js/clock.js`:

```javascript
let updateSpeed = 1000; // milliseconds (1 second)
```

## API Reference

Access the clock app via `window.clockApp`:

```javascript
// Update all clocks manually
window.clockApp.updateAllClocks();

// Get current time format
window.clockApp.getCurrentFormat(); // Returns '12' or '24'

// Set time format
window.clockApp.setFormat('24'); // Switch to 24-hour format

// Get update speed
window.clockApp.getUpdateSpeed(); // Returns milliseconds

// Set update speed
window.clockApp.setUpdateSpeed(500); // Update every 500ms
```

## Local Storage

The app saves user preferences:
- `clockTheme`: Stores 'dark' or 'light' theme
- `timeFormat`: Stores '12' or '24' hour format

## Animations

**Built-in Animations:**
- Slide Down: Header entrance
- Fade In: Control panel
- Scale In: Clock cards
- Float: Subtle card movement
- Pulse: Server time section

## Tips for Best Experience

1. **Performance**: Use "Normal" update speed for better performance
2. **Visibility**: The clock pauses when tab is not visible (saves CPU)
3. **Accuracy**: Times are calculated client-side based on device timezone
4. **DST**: Automatic DST handling (no manual adjustment needed)
5. **Mobile**: Fully responsive on all screen sizes

## Troubleshooting

**Clock not updating?**
- Check browser console for errors
- Ensure JavaScript is enabled
- Try refreshing the page

**Times incorrect?**
- Verify your device system time is correct
- Check timezone settings in your OS
- Browser automatically uses system timezone

**Performance issues?**
- Reduce update speed to "Normal" (1 second)
- Close other browser tabs
- Update your browser to latest version

## Browser Support

| Browser | Support | Notes |
|---------|---------|-------|
| Chrome | ✅ Full | Excellent performance |
| Firefox | ✅ Full | Excellent performance |
| Safari | ✅ Full | Works on iOS and macOS |
| Edge | ✅ Full | Based on Chromium |
| IE 11 | ❌ No | Not supported |

## Future Enhancements

- [ ] Analog clock faces alongside digital displays
- [ ] Timezone search/filter functionality
- [ ] Alarm setup for multiple timezones
- [ ] Time zone converter tool
- [ ] Meeting time finder
- [ ] Timezone widget for websites
- [ ] PWA (Progressive Web App) support
- [ ] Sound notifications

## License

Free to use and modify for personal and commercial projects.

## Support

For issues or feature requests, please check the main repository documentation.

---

**Created with ❤️ for global time tracking**