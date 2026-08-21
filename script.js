// Sticky nav scroll effect + logo swap
const navbar = document.getElementById('navbar');
const announcementBar = document.querySelector('.announcement-bar');
const navLogoImg = document.getElementById('nav-logo-img');
let navUpdateFrame = null;

function updateNav() {
    const barHeight = announcementBar ? announcementBar.offsetHeight : 0;
    if (window.scrollY > barHeight) {
        navbar.classList.add('scrolled');
        if (navLogoImg) navLogoImg.src = 'Logo-side-dark.svg';
    } else {
        navbar.classList.remove('scrolled');
        if (navLogoImg) navLogoImg.src = 'logo-side-light.svg';
    }
}

function requestNavUpdate() {
    if (navUpdateFrame) return;

    navUpdateFrame = requestAnimationFrame(() => {
        navUpdateFrame = null;
        updateNav();
    });
}

window.addEventListener('scroll', requestNavUpdate, { passive: true });
updateNav();

// Hamburger menu toggle
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

// Close mobile menu when clicking outside of it
document.addEventListener('click', (e) => {
    if (mobileMenu && mobileMenu.classList.contains('open')) {
        const clickedInsideMenu = mobileMenu.contains(e.target);
        const clickedInsideHamburger = hamburger && hamburger.contains(e.target);
        
        if (!clickedInsideMenu && !clickedInsideHamburger) {
            closeMobileMenu();
        }
    }
});

// Search functionality
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

// Order tracking / account modal
const orderTrackingLink = document.getElementById('order-tracking-link');
const signinPage = document.getElementById('signin-page');
const signinClose = document.getElementById('signin-close');
const signinWhatsApp = document.querySelector('.signin-shop-btn');

function openSigninModal() {
    if (signinPage) {
        signinPage.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeSigninModal() {
    if (signinPage) {
        signinPage.classList.remove('active');
    }
    document.body.style.overflow = '';
}

if (orderTrackingLink && signinPage) {
    orderTrackingLink.addEventListener('click', openSigninModal);
}

if (signinClose && signinPage) {
    signinClose.addEventListener('click', closeSigninModal);
}

if (signinWhatsApp) {
    signinWhatsApp.addEventListener('click', () => {
        const msg = encodeURIComponent('Hi Silk & Ember, I would like to continue my order / set up my account.');
        window.open(`https://wa.me/254102513511?text=${msg}`, '_blank');
        closeSigninModal();
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
const carousel = document.querySelector('.carousel');
const originalSlides = [...document.querySelectorAll('.carousel-slide')];
const dots = [...document.querySelectorAll('.carousel-dot')];
const prevBtn = document.getElementById('carousel-prev');
const nextBtn = document.getElementById('carousel-next');
const comingSoon = document.getElementById('coming-soon');

let autoAdvance;
let current = 1;
let dragStartX = 0;
let dragCurrentX = 0;
let isDragging = false;

if (track && originalSlides.length > 0) {
    const firstClone = originalSlides[0].cloneNode(true);
    const lastClone = originalSlides[originalSlides.length - 1].cloneNode(true);
    track.insertBefore(lastClone, track.firstChild);
    track.appendChild(firstClone);

    const slides = [...track.children];
    const totalSlides = slides.length;
    const transitionTiming = 'transform 0.8s cubic-bezier(0.77, 0, 0.175, 1)';

    function applyTheme(slide) {
        const bg = slide.dataset.bg;
        const text = slide.dataset.text;
        if (comingSoon) {
            comingSoon.style.backgroundColor = bg;
            comingSoon.style.color = text;
        }
        document.querySelectorAll('.carousel-arrow, .carousel-dot, .carousel-label, .carousel-name, .carousel-desc, .carousel-notify').forEach(el => {
            el.style.color = text;
            el.style.borderColor = text;
        });
    }

    function updateActiveDot(index) {
        const realIndex = (index - 1 + originalSlides.length) % originalSlides.length;
        dots.forEach((dot, dotIndex) => dot.classList.toggle('active', dotIndex === realIndex));
        const slide = originalSlides[realIndex];
        if (slide) applyTheme(slide);
    }

    function goToSlide(index) {
        current = index;
        track.style.transition = transitionTiming;
        track.style.transform = `translateX(-${index * 100}%)`;
        updateActiveDot(index);
    }

    function goNext() {
        if (current >= totalSlides - 1) {
            return;
        }
        goToSlide(current + 1);
    }

    function goPrev() {
        if (current <= 0) {
            return;
        }
        goToSlide(current - 1);
    }

    function resetToStart() {
        track.style.transition = 'none';
        current = 1;
        track.style.transform = 'translateX(-100%)';
        updateActiveDot(current);
        requestAnimationFrame(() => {
            track.style.transition = transitionTiming;
        });
    }

    function resetToEnd() {
        track.style.transition = 'none';
        current = originalSlides.length;
        track.style.transform = `translateX(-${current * 100}%)`;
        updateActiveDot(current);
        requestAnimationFrame(() => {
            track.style.transition = transitionTiming;
        });
    }

    track.addEventListener('transitionend', () => {
        if (current === totalSlides - 1) {
            resetToStart();
        } else if (current === 0) {
            resetToEnd();
        }
    });

    if (prevBtn) prevBtn.addEventListener('click', () => {
        clearInterval(autoAdvance);
        goPrev();
        autoAdvance = setInterval(goNext, 5000);
    });

    if (nextBtn) nextBtn.addEventListener('click', () => {
        clearInterval(autoAdvance);
        goNext();
        autoAdvance = setInterval(goNext, 5000);
    });

    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            clearInterval(autoAdvance);
            goToSlide(index + 1);
            autoAdvance = setInterval(goNext, 5000);
        });
    });

    if (carousel) {
        carousel.addEventListener('wheel', (event) => {
            const delta = event.deltaY || event.deltaX;
            if (Math.abs(delta) === 0) return;
            event.preventDefault();
            clearInterval(autoAdvance);
            if (delta > 0) {
                goNext();
            } else {
                goPrev();
            }
            autoAdvance = setInterval(goNext, 5000);
        }, { passive: false });

        carousel.addEventListener('pointerdown', (event) => {
            isDragging = true;
            dragStartX = event.clientX;
            dragCurrentX = event.clientX;
            clearInterval(autoAdvance);
            track.style.transition = 'none';
            if (event.pointerId !== undefined) {
                track.setPointerCapture(event.pointerId);
            }
        });

        carousel.addEventListener('pointermove', (event) => {
            if (!isDragging) return;
            dragCurrentX = event.clientX;
            const deltaX = dragCurrentX - dragStartX;
            const offset = -(current * 100) + (deltaX / carousel.clientWidth) * 100;
            track.style.transform = `translateX(${offset}%)`;
        });

        carousel.addEventListener('pointerup', () => {
            if (!isDragging) return;
            const deltaX = dragCurrentX - dragStartX;
            isDragging = false;
            if (Math.abs(deltaX) > 60) {
                if (deltaX < 0) {
                    goNext();
                } else {
                    goPrev();
                }
            } else {
                goToSlide(current);
            }
            autoAdvance = setInterval(goNext, 5000);
        });

        carousel.addEventListener('pointerleave', () => {
            if (!isDragging) return;
            const deltaX = dragCurrentX - dragStartX;
            isDragging = false;
            if (Math.abs(deltaX) > 60) {
                if (deltaX < 0) {
                    goNext();
                } else {
                    goPrev();
                }
            } else {
                goToSlide(current);
            }
            autoAdvance = setInterval(goNext, 5000);
        });
    }

    track.style.transition = 'none';
    track.style.transform = 'translateX(-100%)';
    updateActiveDot(current);
    autoAdvance = setInterval(goNext, 5000);
}

// Pre-order form
const preorderOptions = document.querySelectorAll('.preorder-option');

function selectPreorderOption(option) {
    preorderOptions.forEach(o => o.classList.remove('selected'));
    if (option) option.classList.add('selected');
}

preorderOptions.forEach(option => {
    option.addEventListener('click', () => {
        selectPreorderOption(option);
    });
});

const collectionPreorderLinks = document.querySelectorAll('.candle-preorder');
collectionPreorderLinks.forEach(link => {
    link.addEventListener('click', () => {
        const scent = link.dataset.scent;
        const matchedOption = Array.from(preorderOptions).find(option => option.dataset.scent === scent);
        if (matchedOption) {
            selectPreorderOption(matchedOption);
        }
    });
});

const preorderBtn = document.getElementById('preorder-btn');
if (preorderBtn) {
    preorderBtn.addEventListener('click', () => {
        const scent = document.querySelector('.preorder-option.selected');
        const name = document.getElementById('preorder-name')?.value;
        const phone = document.getElementById('preorder-phone')?.value;

        if (!scent) {
            alert('Please select a scent.');
            return;
        }

        if (!name || !phone) {
            openSigninModal();
            return;
        }

        const msg = `Hi! I'd like to pre-order a Silk & Ember candle.\n\nScent: ${scent.dataset.scent}\nName: ${name}\nPhone: ${phone}\n\nI have paid KSh 3,500 via M-Pesa to Till No. 1626298.`;
        window.open(`https://wa.me/254102513511?text=${encodeURIComponent(msg)}`, '_blank');
    });
}

const notifyButtons = document.querySelectorAll('.carousel-notify');
notifyButtons.forEach(button => {
    button.addEventListener('click', openSigninModal);
});

// Slots bar animation
setTimeout(() => {
    const slotsFill = document.getElementById('slots-fill');
    if (slotsFill) slotsFill.style.width = '0%';
}, 500);

// Contact page modal
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