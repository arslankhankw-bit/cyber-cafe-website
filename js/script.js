// Mobile Menu Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

if (hamburger) {
    hamburger.addEventListener('click', () => {
        navMenu.style.display = navMenu.style.display === 'flex' ? 'none' : 'flex';
    });

    // Close menu when link is clicked
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.style.display = 'none';
        });
    });
}

// Form Submission
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const formData = new FormData(contactForm);
        const data = {
            name: formData.get('name') || document.querySelector('.contact-form input[type="text"]').value,
            email: formData.get('email') || document.querySelector('.contact-form input[type="email"]').value,
            subject: formData.get('subject') || document.querySelectorAll('.contact-form input')[2].value,
            message: formData.get('message') || document.querySelector('.contact-form textarea').value
        };

        console.log('Form submitted:', data);
        alert('Thank you! We will get back to you soon.');
        contactForm.reset();
    });
}

// Smooth Scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

// Add scroll animation
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.boxShadow = '0 4px 20px rgba(30, 136, 229, 0.3)';
    } else {
        navbar.style.boxShadow = '0 2px 10px rgba(30, 136, 229, 0.2)';
    }
});

// Initialize page
document.addEventListener('DOMContentLoaded', () => {
    console.log('CyberHub India website loaded successfully!');
});
