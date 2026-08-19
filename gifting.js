// Build Your Own — option selection
const options = document.querySelectorAll('.step-option');
options.forEach(option => {
    option.addEventListener('click', () => {
        const step = option.closest('.step-options');
        const isScent = option.closest('.build-step').querySelector('.step-num').textContent === '01';

        // Scents are single select, extras are multi-select
        if (isScent) {
            step.querySelectorAll('.step-option').forEach(o => o.classList.remove('selected'));
        }
        option.classList.toggle('selected');
    });
});

// Build Your Own — WhatsApp button
document.getElementById('build-btn').addEventListener('click', () => {
    const scent = document.querySelector('.build-step:nth-child(1) .step-option.selected');
    const extras = [...document.querySelectorAll('.build-step:nth-child(2) .step-option.selected')];
    const message = document.querySelector('.build-message').value;

    const scentText = scent ? scent.textContent : 'Not selected';
    const extrasText = extras.length ? extras.map(e => e.textContent).join(', ') : 'None';
    const messageText = message || 'No message';

    const wa = `Hi! I'd like to build a custom Silk & Ember gift.\n\nScent: ${scentText}\nExtras: ${extrasText}\nMessage: ${messageText}`;
    window.open(`https://wa.me/254102513511?text=${encodeURIComponent(wa)}`, '_blank');
});
const giftMessage = document.getElementById('gift-message');
const notePreview = document.getElementById('note-preview');

giftMessage.addEventListener('input', () => {
    if (giftMessage.value) {
        notePreview.textContent = giftMessage.value;
        notePreview.classList.add('has-content');
    } else {
        notePreview.textContent = 'your message will appear here...';
        notePreview.classList.remove('has-content');
    }
});