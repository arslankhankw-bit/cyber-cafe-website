// Booking Form Calculator
const durationSelect = document.getElementById('duration');
const planSelect = document.getElementById('plan');
const servicesCheckboxes = document.querySelectorAll('input[name="services"]');
const sessionCostSpan = document.getElementById('sessionCost');
const servicesCostSpan = document.getElementById('servicesCost');
const totalCostSpan = document.getElementById('totalCost');
const bookingForm = document.getElementById('bookingForm');

const planPrices = {
    casual: 5,
    pro: 8,
    elite: 12
};

const servicesPrices = {
    snacks: 5,
    drinks: 3,
    recording: 10,
    tournament: 15
};

function calculateCost() {
    const duration = parseInt(durationSelect.value) || 0;
    const plan = planSelect.value;
    const planPrice = planPrices[plan] || 0;
    
    // Calculate session cost
    const sessionCost = duration * planPrice;
    sessionCostSpan.textContent = '$' + sessionCost.toFixed(2);
    
    // Calculate services cost
    let servicesCost = 0;
    servicesCheckboxes.forEach(checkbox => {
        if (checkbox.checked) {
            servicesCost += servicesPrices[checkbox.value] || 0;
        }
    });
    servicesCostSpan.textContent = '$' + servicesCost.toFixed(2);
    
    // Calculate total
    const totalCost = sessionCost + servicesCost;
    totalCostSpan.textContent = '$' + totalCost.toFixed(2);
}

// Event listeners for cost calculation
if (durationSelect) {
    durationSelect.addEventListener('change', calculateCost);
}
if (planSelect) {
    planSelect.addEventListener('change', calculateCost);
}
servicesCheckboxes.forEach(checkbox => {
    checkbox.addEventListener('change', calculateCost);
});

// Set minimum date to today
if (document.getElementById('date')) {
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('date').setAttribute('min', today);
}

// Booking Form Submission
if (bookingForm) {
    bookingForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Validate form
        if (!this.checkValidity()) {
            alert('Please fill in all required fields.');
            return;
        }
        
        // Get form values
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const phone = document.getElementById('phone').value;
        const date = document.getElementById('date').value;
        const time = document.getElementById('time').value;
        const duration = document.getElementById('duration').value;
        const plan = document.getElementById('plan').value;
        const station = document.getElementById('station').value;
        const total = totalCostSpan.textContent;
        
        // Create booking summary
        let bookingSummary = `
BOOKING CONFIRMATION
${'='.repeat(50)}

Guest Information:
- Name: ${name}
- Email: ${email}
- Phone: ${phone}

Booking Details:
- Date: ${new Date(date).toLocaleDateString()}
- Time: ${time}
- Duration: ${duration} hour(s)
- Gaming Plan: ${plan}
- Station: ${station}

Total Cost: ${total}

${'='.repeat(50)}
Thank you for booking with CyberHub!
Please arrive 10 minutes before your session.
        `;
        
        // Show confirmation
        alert(bookingSummary);
        
        // Log booking (in real app, this would be sent to a server)
        console.log('Booking Details:', {
            name,
            email,
            phone,
            date,
            time,
            duration,
            plan,
            station,
            total
        });
        
        // Reset form
        this.reset();
        calculateCost();
    });
}

// Set default time to current time
if (document.getElementById('time')) {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    document.getElementById('time').value = `${hours}:${minutes}`;
}

// Mobile Menu Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

if (hamburger) {
    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        hamburger.classList.toggle('active');
    });
}

// Smooth Scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

console.log('Booking Page Loaded Successfully!');