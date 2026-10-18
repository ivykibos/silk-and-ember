/**
 * Silk & Ember — Currency Switcher
 * Toggles all price displays between KES and USD.
 * USD rate is fetched live from an open exchange-rate API and cached for 1 hour.
 */

(function () {
    'use strict';

    // ── Config ────────────────────────────────────────────────────────────────
    const STORAGE_KEY_CURRENCY = 'se_currency';       // 'KES' | 'USD'
    const STORAGE_KEY_RATE     = 'se_usd_rate';       // cached rate value
    const STORAGE_KEY_RATE_TS  = 'se_usd_rate_ts';   // timestamp of last fetch
    const RATE_TTL_MS          = 60 * 60 * 1000;     // 1 hour cache
    const FALLBACK_RATE        = 129;                 // fallback KES per 1 USD

    // ── State ─────────────────────────────────────────────────────────────────
    let currentCurrency = localStorage.getItem(STORAGE_KEY_CURRENCY) || 'KES';
    let kesPerUsd       = FALLBACK_RATE;

    // ── Rate fetching ─────────────────────────────────────────────────────────
    async function fetchRate() {
        const cachedRate = parseFloat(localStorage.getItem(STORAGE_KEY_RATE));
        const cachedTs   = parseInt(localStorage.getItem(STORAGE_KEY_RATE_TS), 10);
        const now        = Date.now();

        if (cachedRate && cachedTs && (now - cachedTs) < RATE_TTL_MS) {
            kesPerUsd = cachedRate;
            return;
        }

        try {
            // Open-source, no-key-required exchange rate API
            const res  = await fetch('https://open.er-api.com/v6/latest/USD');
            const data = await res.json();
            if (data && data.rates && data.rates.KES) {
                kesPerUsd = data.rates.KES;
                localStorage.setItem(STORAGE_KEY_RATE,    kesPerUsd.toString());
                localStorage.setItem(STORAGE_KEY_RATE_TS, now.toString());
            }
        } catch (e) {
            // Silently fall back to hardcoded rate
            console.warn('[SE Currency] Could not fetch live rate, using fallback:', FALLBACK_RATE);
        }
    }

    // ── Formatting ────────────────────────────────────────────────────────────
    function formatKES(kes) {
        return 'KSh\u00A0' + Number(kes).toLocaleString('en-KE');
    }

    function formatUSD(kes) {
        const usd = kes / kesPerUsd;
        return 'USD\u00A0' + usd.toFixed(2);
    }

    // ── DOM update ────────────────────────────────────────────────────────────
    /**
     * Every price element should carry:
     *   data-kes="1800"   (the canonical KES amount)
     * This script will set its textContent to the correct formatted string.
     */
    function updateAllPrices() {
        document.querySelectorAll('[data-kes]').forEach(el => {
            const kes = parseFloat(el.getAttribute('data-kes'));
            if (isNaN(kes)) return;
            el.textContent = currentCurrency === 'USD' ? formatUSD(kes) : formatKES(kes);
        });

        // Update any inline text nodes that carry the class .currency-inline
        // (used in hero CTAs, section subtitles, etc.)
        document.querySelectorAll('[data-kes-text]').forEach(el => {
            const kes  = parseFloat(el.getAttribute('data-kes-text'));
            const tmpl = el.getAttribute('data-price-template') || '{price}';
            if (isNaN(kes)) return;
            const formatted = currentCurrency === 'USD' ? formatUSD(kes) : formatKES(kes);
            el.textContent  = tmpl.replace('{price}', formatted);
        });
    }

    // ── Toggle UI ─────────────────────────────────────────────────────────────
    function setToggleState(toggle) {
        if (!toggle) return;
        const kesBtn = toggle.querySelector('[data-currency-btn="KES"]');
        const usdBtn = toggle.querySelector('[data-currency-btn="USD"]');
        if (kesBtn) kesBtn.classList.toggle('active', currentCurrency === 'KES');
        if (usdBtn) usdBtn.classList.toggle('active', currentCurrency === 'USD');
    }

    async function switchCurrency(to, toggle) {
        if (to === currentCurrency) return;
        currentCurrency = to;
        localStorage.setItem(STORAGE_KEY_CURRENCY, to);

        if (to === 'USD') await fetchRate(); // ensure fresh-ish rate
        setToggleState(toggle);
        updateAllPrices();
    }

    // ── Init ──────────────────────────────────────────────────────────────────
    async function init() {
        // Fetch rate early (uses cache if fresh)
        await fetchRate();

        // Wire up every toggle found on the page
        document.querySelectorAll('.se-currency-toggle').forEach(toggle => {
            setToggleState(toggle);

            toggle.querySelectorAll('[data-currency-btn]').forEach(btn => {
                btn.addEventListener('click', () => {
                    switchCurrency(btn.getAttribute('data-currency-btn'), toggle);
                });
            });
        });

        // Initial render
        updateAllPrices();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
