// Smooth scrolling for navigation links
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

// Add scroll effect to navbar
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.boxShadow = '0 4px 20px rgba(0,0,0,0.2)';
    } else {
        navbar.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
    }
});

// Animate elements on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animation = 'fadeInUp 0.6s ease forwards';
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe all service cards and price cards
document.querySelectorAll('.service-card, .price-card, .contact-card').forEach(card => {
    card.style.opacity = '0';
    observer.observe(card);
});

// Add animation keyframe
const style = document.createElement('style');
style.innerHTML = `
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(style);

// Mobile menu toggle (if needed in future)
function toggleMobileMenu() {
    const navLinks = document.querySelector('.nav-links');
    if (navLinks) {
        navLinks.classList.toggle('active');
    }
}

// Booking form functionality
function bookService(service) {
    const hours = prompt(`Enter number of hours for ${service}:`, '1');
    if (hours && !isNaN(hours) && hours > 0) {
        alert(`Booking confirmed for ${hours} hour(s) of ${service}. Please visit our center to complete the booking.`);
    }
}

// Console welcome message
console.log('%cWelcome to AK Travels!', 'font-size: 24px; color: #FF6B35; font-weight: bold;');
console.log('%cYour trusted cyber cafe & print services hub', 'font-size: 14px; color: #004E89;');
console.log('Contact us for more information!');
