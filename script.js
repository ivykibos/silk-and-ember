// Sticky nav scroll effect + logo swap
const navbar = document.getElementById('navbar');
const announcementBar = document.querySelector('.announcement-bar');
const navLogoImg = document.getElementById('nav-logo-img');

function updateNav() {
    const barHeight = announcementBar.offsetHeight;
    if (window.scrollY > barHeight) {
        navbar.classList.add('scrolled');
        if (navLogoImg) navLogoImg.src = 'Logo-side-dark.svg';
    } else {
        navbar.classList.remove('scrolled');
        if (navLogoImg) navLogoImg.src = 'logo-side-light.svg';
    }
}

window.addEventListener('scroll', updateNav);
updateNav();

// Hamburger menu
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobile-menu');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    mobileMenu.classList.toggle('open');
    document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
});

function closeMobileMenu() {
    hamburger.classList.remove('open');
    mobileMenu.classList.remove('open');
    document.body.style.overflow = '';
}
const searchIcon = document.getElementById('search-icon');
const searchBar = document.getElementById('search-bar');
const searchClose = document.getElementById('search-close');
const searchInput = document.getElementById('search-input');

searchIcon.addEventListener('click', () => {
    searchBar.classList.add('active');
    searchInput.focus();
});

searchClose.addEventListener('click', () => {
    searchBar.classList.remove('active');
    searchInput.value = '';
});
const orderTrackingLink = document.getElementById('order-tracking-link');
const signinPage = document.getElementById('signin-page');
const signinClose = document.getElementById('signin-close');

orderTrackingLink.addEventListener('click', () => {
    signinPage.classList.add('active');
    document.body.style.overflow = 'hidden';
});

signinClose.addEventListener('click', () => {
    signinPage.classList.remove('active');
    document.body.style.overflow = '';
});

// Close on Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        signinPage.classList.remove('active');
        document.body.style.overflow = '';
    }
});
// Welcome popup
const welcomeOverlay = document.getElementById('welcome-overlay');
const welcomeClose = document.getElementById('welcome-close');
const welcomeSkip = document.getElementById('welcome-skip');
const welcomeBtn = document.getElementById('welcome-btn');

if (!localStorage.getItem('silk_ember_welcomed')) {
    setTimeout(() => {
        welcomeOverlay.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }, 2000);
}

function closeWelcome() {
    welcomeOverlay.style.display = 'none';
    document.body.style.overflow = '';
    localStorage.setItem('silk_ember_welcomed', 'true');
}

welcomeClose.addEventListener('click', closeWelcome);
welcomeSkip.addEventListener('click', closeWelcome);

welcomeBtn.addEventListener('click', () => {
    const email = document.getElementById('welcome-email').value;
    if (!email || !email.includes('@')) {
        document.getElementById('welcome-email').style.borderColor = '#5C3A45';
        return;
    }
    console.log('Email captured:', email);
    closeWelcome();
    launchConfetti();
    alert('Your 10% off code: WELCOME10 — use it at checkout!');
});
function launchConfetti() {
    const colors = ['#8B5A2B', '#F2E8DC', '#5C3A45', '#C4A882', '#2B1D14'];
    const count = 120;

    for (let i = 0; i < count; i++) {
        const confetti = document.createElement('div');
        confetti.style.cssText = `
            position: fixed;
            top: -10px;
            left: ${Math.random() * 100}vw;
            width: ${Math.random() * 8 + 4}px;
            height: ${Math.random() * 8 + 4}px;
            background: ${colors[Math.floor(Math.random() * colors.length)]};
            z-index: 99999;
            border-radius: ${Math.random() > 0.5 ? '50%' : '0'};
            animation: confettiFall ${Math.random() * 2 + 2}s ease-out forwards;
            animation-delay: ${Math.random() * 0.5}s;
        `;
        document.body.appendChild(confetti);

        // Remove after animation
        setTimeout(() => confetti.remove(), 3000);
    }
}// Coming Soon Carousel
const track = document.getElementById('carousel-track');
const slides = document.querySelectorAll('.carousel-slide');
const dots = document.querySelectorAll('.carousel-dot');
const prevBtn = document.getElementById('carousel-prev');
const nextBtn = document.getElementById('carousel-next');
const comingSoon = document.getElementById('coming-soon');

let current = 0;

function goToSlide(index) {
    current = (index + slides.length) % slides.length;

    // Slide the track
    track.style.transform = `translateX(-${current * 100}%)`;

    // Update dots
    dots.forEach(d => d.classList.remove('active'));
    dots[current].classList.add('active');

    // Update background and text color
    const bg = slides[current].dataset.bg;
    const text = slides[current].dataset.text;
    comingSoon.style.backgroundColor = bg;
    comingSoon.style.color = text;

    // Update arrow and element colors
    document.querySelectorAll('.carousel-arrow, .carousel-dot, .carousel-label, .carousel-name, .carousel-desc, .carousel-notify').forEach(el => {
        el.style.color = text;
        el.style.borderColor = text;
    });
}

prevBtn.addEventListener('click', () => goToSlide(current - 1));
nextBtn.addEventListener('click', () => goToSlide(current + 1));
dots.forEach(dot => {
    dot.addEventListener('click', () => goToSlide(parseInt(dot.dataset.index)));
});

goToSlide(0);
setInterval(() => goToSlide(current + 1), 5000);
// Pre-order form
const preorderOptions = document.querySelectorAll('.preorder-option');
preorderOptions.forEach(option => {
    option.addEventListener('click', () => {
        preorderOptions.forEach(o => o.classList.remove('selected'));
        option.classList.add('selected');
    });
});

document.getElementById('preorder-btn').addEventListener('click', () => {
    const scent = document.querySelector('.preorder-option.selected');
    const name = document.getElementById('preorder-name').value;
    const phone = document.getElementById('preorder-phone').value;

    if (!scent) {
        alert('Please select a scent.');
        return;
    }
    if (!name || !phone) {
        alert('Please fill in your name and phone number.');
        return;
    }

    const msg = `Hi! I'd like to pre-order a Silk & Ember candle.\n\nScent: ${scent.dataset.scent}\nName: ${name}\nPhone: ${phone}\n\nI have completed my M-Pesa payment.`;
    window.open(`https://wa.me/254102513511?text=${encodeURIComponent(msg)}`, '_blank');
});

// Slots bar animation
setTimeout(() => {
    document.getElementById('slots-fill').style.width = '0%';
}, 500);
const contactLink = document.getElementById('contact-us-link'); // Add this ID to your Contact Us footer link
const contactPage = document.getElementById('contact-page');
const contactClose = document.getElementById('contact-close');

if (contactLink) {
    contactLink.addEventListener('click', (e) => {
        e.preventDefault();
        contactPage.classList.add('active');
        document.body.style.overflow = 'hidden';
    });
}

if (contactClose) {
    contactClose.addEventListener('click', () => {
        contactPage.classList.remove('active');
        document.body.style.overflow = '';
    });
}