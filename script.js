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

function closeSearchBar() {
    if (searchBar) searchBar.classList.remove('active');
    if (searchInput) searchInput.value = '';
}

if (searchIcon && searchBar) {
    searchIcon.addEventListener('click', () => {
        searchBar.classList.toggle('active');
        if (searchInput) searchInput.focus();
    });
}

if (searchClose && searchBar) {
    searchClose.addEventListener('click', () => {
        closeSearchBar();
    });
}

document.addEventListener('click', (e) => {
    const clickedInsideSearch = searchBar && searchBar.contains(e.target);
    const clickedSearchButton = searchIcon && searchIcon.contains(e.target);

    if (searchBar && searchBar.classList.contains('active') && !clickedInsideSearch && !clickedSearchButton) {
        closeSearchBar();
    }
});

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
        closeSearchBar();
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
        const slideWidthPx = carousel ? carousel.clientWidth : 0;
        current = index;
        track.style.transition = transitionTiming;
        track.style.transform = `translateX(-${index * slideWidthPx}px)`;
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
        const slideWidthPx = carousel ? carousel.clientWidth : 0;
        track.style.transition = 'none';
        current = 1;
        track.style.transform = `translateX(-${slideWidthPx}px)`;
        updateActiveDot(current);
        requestAnimationFrame(() => {
            track.style.transition = transitionTiming;
        });
    }

    function resetToEnd() {
        const slideWidthPx = carousel ? carousel.clientWidth : 0;
        track.style.transition = 'none';
        current = originalSlides.length;
        track.style.transform = `translateX(-${current * slideWidthPx}px)`;
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
            const offset = -(current * carousel.clientWidth) + deltaX;
            track.style.transform = `translateX(${offset}px)`;
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
    track.style.transform = `translateX(-${carousel ? carousel.clientWidth : 0}px)`;
    updateActiveDot(current);
    autoAdvance = setInterval(goNext, 5000);
}

// ============================================================
// DUAL-TIER CHECKOUT — Kurinuki (KSh 6,500) + Studio (KSh 4,500)
// ============================================================

// Track which tier's button was last clicked so the COMPLETE
// handler knows which form + amount to send to Make.
let activeTier = null; // 'kurinuki' | 'studio'

// ---------- Tier config ----------
const TIERS = {
    kurinuki: {
        formId:       'kurinuki-form',
        btnId:        'kurinuki-btn',
        scentSelectId:'kurinuki-scent',
        optionsId:    'kurinuki-scent-options',
        nameId:       'kurinuki-name',
        phoneId:      'kurinuki-phone',
        emailId:      'kurinuki-email',
        amount:       6500,
        label:        'Kurinuki Vessel — Batch 001',
    },
    studio: {
        formId:       'studio-form',
        btnId:        'studio-btn',
        scentSelectId:'studio-scent',
        optionsId:    'studio-scent-options',
        nameId:       'studio-name',
        phoneId:      'studio-phone',
        emailId:      'studio-email',
        amount:       4500,
        label:        'Studio Collection — Glass Vessel',
    }
};

// ---------- Scent pill selection ----------
function initScentOptions(optionsId, scentSelectId) {
    const container = document.getElementById(optionsId);
    const select    = document.getElementById(scentSelectId);
    if (!container) return;

    const options = container.querySelectorAll('.preorder-option');

    options.forEach(opt => {
        opt.addEventListener('click', () => {
            options.forEach(o => o.classList.remove('selected'));
            opt.classList.add('selected');
            if (select) select.value = opt.dataset.scent;
        });
    });

    if (select) {
        select.addEventListener('change', () => {
            const match = [...options].find(o => o.dataset.scent === select.value);
            options.forEach(o => o.classList.remove('selected'));
            if (match) match.classList.add('selected');
        });
    }
}

initScentOptions(TIERS.kurinuki.optionsId, TIERS.kurinuki.scentSelectId);
initScentOptions(TIERS.studio.optionsId,   TIERS.studio.scentSelectId);

// ---------- Collection card links pre-fill form ----------
document.querySelectorAll('.candle-preorder').forEach(link => {
    link.addEventListener('click', () => {
        const scent = link.dataset.scent;
        const tier  = link.dataset.tier; // 'kurinuki' | 'studio'
        if (!tier || !TIERS[tier]) return;

        const cfg       = TIERS[tier];
        const container = document.getElementById(cfg.optionsId);
        const select    = document.getElementById(cfg.scentSelectId);
        if (container) {
            const options = container.querySelectorAll('.preorder-option');
            options.forEach(o => o.classList.remove('selected'));
            const match = [...options].find(o => o.dataset.scent === scent);
            if (match) match.classList.add('selected');
        }
        if (select) select.value = scent;
    });
});

// ---------- Validate + arm IntaSend button ----------
function armTierButton(tierKey) {
    const cfg = TIERS[tierKey];
    const btn = document.getElementById(cfg.btnId);
    if (!btn) return;

    btn.addEventListener('click', (event) => {
        const select = document.getElementById(cfg.scentSelectId);
        const scentValue = select ? select.value : '';
        const name  = document.getElementById(cfg.nameId)?.value.trim();
        const phone = document.getElementById(cfg.phoneId)?.value.trim();
        const email = document.getElementById(cfg.emailId)?.value.trim();

        if (!scentValue) {
            alert('Please choose your scent to continue.');
            event.stopImmediatePropagation();
            return;
        }
        if (!name || !phone || !email) {
            alert('Please complete your name, contact number, and email before continuing.');
            event.stopImmediatePropagation();
            return;
        }

        // Record which tier is paying so COMPLETE handler uses the right form
        activeTier = tierKey;
        // Let IntaSend's own handler take over — it reads data-amount from the button
    });
}

armTierButton('kurinuki');
armTierButton('studio');

// ---------- Async-safe Make webhook (fixes race condition) ----------
async function sendToMake(form, paymentResults) {
    if (!form) return;

    // Mark as paid
    const hiddenStatus = form.querySelector('input[name="Fulfillment Status"]');
    if (hiddenStatus) hiddenStatus.value = 'Paid';

    const formData = new FormData(form);

    // Attach IntaSend transaction data
    if (paymentResults?.invoice) {
        if (paymentResults.invoice.invoice_id) {
            formData.set('Payment Reference', paymentResults.invoice.invoice_id);
        }
        const amountPaid = paymentResults.invoice.net_amount || paymentResults.invoice.value;
        if (amountPaid) formData.set('Amount Paid', amountPaid);
    }

    // CRITICAL: await the fetch before redirecting — this is what kills the race condition.
    // mode: no-cors means we won't get a readable response but Make still receives the payload.
    try {
        await fetch(form.action, {
            method: 'POST',
            body:   formData,
            mode:   'no-cors',
            keepalive: true  // allows request to outlive page navigation as a safety net
        });
    } catch (err) {
        console.warn('Make webhook error:', err);
        // Don't block redirect on network error — data is best-effort
    }
}

// ---------- IntaSend COMPLETE handler ----------
// IntaSend fires a global 'COMPLETE' event on window when payment succeeds.
window.addEventListener('COMPLETE', async (e) => {
    const paymentResults = e.detail || {};
    const tier = activeTier;
    const cfg  = tier ? TIERS[tier] : null;
    const form = cfg ? document.getElementById(cfg.formId) : null;

    // Send to Make first, THEN redirect — no more race condition
    await sendToMake(form, paymentResults);
    window.location.href = 'allocation-secured.html';
});

// FAILED event
window.addEventListener('FAILED', (e) => {
    console.error('IntaSend payment failed:', e.detail);
    alert('Payment could not be completed. Please try again or contact us on WhatsApp.');
});

// ---------- Prevent native form submit ----------
['kurinuki-form', 'studio-form'].forEach(id => {
    const f = document.getElementById(id);
    if (f) f.addEventListener('submit', e => e.preventDefault());
});

// ---------- Slots bar animation ----------
setTimeout(() => {
    const fills = ['kurinuki-slots-fill', 'slots-fill'];
    fills.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.style.width = '0%';
    });
}, 500);


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
// ============================================================
// PRODUCT DETAIL VIEW (PDP) CONTROLLER
// ============================================================
const pdpOverlay = document.getElementById('pdp-overlay');
const pdpClose = document.getElementById('pdp-close');

// Product Data Dictionary (Maps each scent to its specific attributes & notes)
const PRODUCT_DATA = {
    "Sugar High": {
        tier: "kurinuki",
        price: "KSh 6,500",
        vessel: "HAND-CAST VESSEL · DISCOVERY POUR INCLUDED",
        top: "Salted Caramel",
        heart: "Sage & Sea Salt",
        base: "Amber",
        desc: "A rich, indulgent haze designed to anchor your space. Opening with salted caramel warmth, settling into crisp sage & sea salt, and grounded by rich amber.",
        targetHref: "#kurinuki-preorder"
    },
    "Golden Hour": {
        tier: "kurinuki",
        price: "KSh 6,500",
        vessel: "HAND-CAST VESSEL · DISCOVERY POUR INCLUDED",
        top: "Vanilla Bay",
        heart: "Amber",
        base: "Peach",
        desc: "Capturing the final amber light before dusk. Warm vanilla bay melds seamlessly with sun-drenched peach and resinous amber.",
        targetHref: "#kurinuki-preorder"
    },
    "Slow Burn": {
        tier: "kurinuki",
        price: "KSh 6,500",
        vessel: "HAND-CAST VESSEL · DISCOVERY POUR INCLUDED",
        top: "Mahogany",
        heart: "Teakwood",
        base: "Oud",
        desc: "Deep, woody, and unapologetically bold. Rich mahogany and aged teakwood layered over smoky, hypnotic oud.",
        targetHref: "#kurinuki-preorder"
    }
};

function openPdp(scentName) {
    if (!pdpOverlay) return;
    const data = PRODUCT_DATA[scentName] || PRODUCT_DATA["Sugar High"];

    // Populate fields
    document.getElementById('pdp-title').textContent = scentName;
    document.getElementById('pdp-price').textContent = data.price;
    document.getElementById('pdp-desc-text').textContent = data.desc;
    document.getElementById('pdp-note-top').textContent = data.top;
    document.getElementById('pdp-note-heart').textContent = data.heart;
    document.getElementById('pdp-note-base').textContent = data.base;
    document.getElementById('pdp-img-label').textContent = scentName.toUpperCase();
    
    const primaryCta = document.getElementById('pdp-primary-cta');
    if (primaryCta) {
        primaryCta.setAttribute('href', data.targetHref);
        primaryCta.setAttribute('data-scent', scentName);
    }

    pdpOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closePdp() {
    if (!pdpOverlay) return;
    pdpOverlay.classList.remove('active');
    document.body.style.overflow = '';
}

// Attach click listeners to collection candle cards to trigger PDP
document.querySelectorAll('.candle-img, .candle-name').forEach(el => {
    el.style.cursor = 'pointer';
    el.addEventListener('click', (e) => {
        const candleCard = e.target.closest('.candle');
        if (!candleCard) return;
        const nameEl = candleCard.querySelector('.candle-name');
        if (nameEl) {
            openPdp(nameEl.textContent.trim());
        }
    });
});

if (pdpClose) {
    pdpClose.addEventListener('click', closePdp);
}

if (pdpOverlay) {
    pdpOverlay.addEventListener('click', (e) => {
        if (e.target === pdpOverlay) closePdp();
    });
}

// Close PDP on Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && pdpOverlay && pdpOverlay.classList.contains('active')) {
        closePdp();
    }
});