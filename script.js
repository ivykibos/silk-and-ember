// Sticky nav scroll effect + logo swap
const navbar = document.getElementById('navbar');
const announcementBar = document.querySelector('.announcement-bar');
const navLogoImg = document.getElementById('nav-logo-img');

function updateNav() {
    const barHeight = announcementBar ? announcementBar.offsetHeight : 0;
    if (window.scrollY > barHeight) {
        navbar.classList.add('scrolled');
        if (navLogoImg) navLogoImg.src = 'Logo-side-dark.svg';
    } else {
        navbar.classList.remove('scrolled');
        if (navLogoImg) navLogoImg.src = 'Logo-side-light.svg';
    }
}

window.addEventListener('scroll', updateNav);
updateNav();

// Hamburger menu
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobile-menu');

if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('open');
        mobileMenu.classList.toggle('open');
        document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
    });
}

function closeMobileMenu() {
    if (hamburger) hamburger.classList.remove('open');
    if (mobileMenu) mobileMenu.classList.remove('open');
    document.body.style.overflow = '';
}

// Search
const searchIcon = document.getElementById('search-icon');
const searchBar = document.getElementById('search-bar');
const searchClose = document.getElementById('search-close');
const searchInput = document.getElementById('search-input');

if (searchIcon && searchBar) {
    searchIcon.addEventListener('click', () => {
        searchBar.classList.add('active');
        if (searchInput) searchInput.focus();
    });
}

if (searchClose && searchBar) {
    searchClose.addEventListener('click', () => {
        searchBar.classList.remove('active');
        if (searchInput) searchInput.value = '';
    });
}

// Order tracking
const orderTrackingLink = document.getElementById('order-tracking-link');
const signinPage = document.getElementById('signin-page');
const signinClose = document.getElementById('signin-close');

if (orderTrackingLink && signinPage) {
    orderTrackingLink.addEventListener('click', () => {
        signinPage.classList.add('active');
        document.body.style.overflow = 'hidden';
    });
}

if (signinClose && signinPage) {
    signinClose.addEventListener('click', () => {
        signinPage.classList.remove('active');
        document.body.style.overflow = '';
    });
}

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        if (signinPage) signinPage.classList.remove('active');
        if (mobileMenu) mobileMenu.classList.remove('open');
        if (hamburger) hamburger.classList.remove('open');
        document.body.style.overflow = '';
    }
});

// Welcome popup
const welcomeOverlay = document.getElementById('welcome-overlay');
const welcomeClose = document.getElementById('welcome-close');
const welcomeSkip = document.getElementById('welcome-skip');
const welcomeBtn = document.getElementById('welcome-btn');

if (welcomeOverlay && !localStorage.getItem('silk_ember_welcomed')) {
    setTimeout(() => {
        welcomeOverlay.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }, 2000);
}

function closeWelcome() {
    if (welcomeOverlay) welcomeOverlay.style.display = 'none';
    document.body.style.overflow = '';
    localStorage.setItem('silk_ember_welcomed', 'true');
}

if (welcomeClose) welcomeClose.addEventListener('click', closeWelcome);
if (welcomeSkip) welcomeSkip.addEventListener('click', closeWelcome);

if (welcomeBtn) {
    welcomeBtn.addEventListener('click', () => {
        const emailInput = document.getElementById('welcome-email');
        const email = emailInput ? emailInput.value : '';
        if (!email || !email.includes('@')) {
            if (emailInput) emailInput.style.borderColor = '#5C3A45';
            return;
        }
        closeWelcome();
        launchConfetti();
        alert('Your 10% off code: WELCOME10 — use it at checkout!');
    });
}

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
        setTimeout(() => confetti.remove(), 3000);
    }
}

// Coming Soon Carousel
const track = document.getElementById('carousel-track');
const slides = document.querySelectorAll('.carousel-slide');
const dots = document.querySelectorAll('.carousel-dot');
const prevBtn = document.getElementById('carousel-prev');
const nextBtn = document.getElementById('carousel-next');
const comingSoon = document.getElementById('coming-soon');

let current = 0;

if (track && slides.length > 0) {
    function goToSlide(index) {
        current = (index + slides.length) % slides.length;
        track.style.transform = `translateX(-${current * 100}%)`;
        dots.forEach(d => d.classList.remove('active'));
        if (dots[current]) dots[current].classList.add('active');
        const bg = slides[current].dataset.bg;
        const text = slides[current].dataset.text;
        if (comingSoon) {
            comingSoon.style.backgroundColor = bg;
            comingSoon.style.color = text;
        }
        document.querySelectorAll('.carousel-arrow, .carousel-dot, .carousel-label, .carousel-name, .carousel-desc, .carousel-notify').forEach(el => {
            el.style.color = text;
            el.style.borderColor = text;
        });
    }

    if (prevBtn) prevBtn.addEventListener('click', () => goToSlide(current - 1));
    if (nextBtn) nextBtn.addEventListener('click', () => goToSlide(current + 1));
    dots.forEach(dot => {
        dot.addEventListener('click', () => goToSlide(parseInt(dot.dataset.index)));
    });

    goToSlide(0);
    setInterval(() => goToSlide(current + 1), 5000);
}

// Pre-order form
const preorderOptions = document.querySelectorAll('.preorder-option');
preorderOptions.forEach(option => {
    option.addEventListener('click', () => {
        preorderOptions.forEach(o => o.classList.remove('selected'));
        option.classList.add('selected');
    });
});

const preorderBtn = document.getElementById('preorder-btn');
if (preorderBtn) {
    preorderBtn.addEventListener('click', () => {
        const scent = document.querySelector('.preorder-option.selected');
        const name = document.getElementById('preorder-name').value;
        const phone = document.getElementById('preorder-phone').value;
        if (!scent) { alert('Please select a scent.'); return; }
        if (!name || !phone) { alert('Please fill in your name and phone number.'); return; }
        const msg = `Hi! I'd like to pre-order a Silk & Ember candle.\n\nScent: ${scent.dataset.scent}\nName: ${name}\nPhone: ${phone}\n\nI have paid KSh 3,500 via M-Pesa to Till No. 1626298.`;
        window.open(`https://wa.me/254102513511?text=${encodeURIComponent(msg)}`, '_blank');
    });
}

// Slots bar
setTimeout(() => {
    const slotsFill = document.getElementById('slots-fill');
    if (slotsFill) slotsFill.style.width = '0%';
}, 500);

// Contact page
const contactLink = document.getElementById('contact-us-link');
const contactPage = document.getElementById('contact-page');
const contactClose = document.getElementById('contact-close');

if (contactLink && contactPage) {
    contactLink.addEventListener('click', (e) => {
        e.preventDefault();
        contactPage.classList.add('active');
        document.body.style.overflow = 'hidden';
    });
}

if (contactClose && contactPage) {
    contactClose.addEventListener('click', () => {
        contactPage.classList.remove('active');
        document.body.style.overflow = '';
    });
}
