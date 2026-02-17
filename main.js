const toast = document.getElementById('drawer-toast');
const drawer = document.getElementById('upgrade-drawer');
const overlay = document.querySelector('.drawer-overlay');
const upgradeButtons = document.querySelectorAll('[data-upgrade]');
const closeButtons = document.querySelectorAll('[data-drawer-close]');
const form = document.getElementById('upgrade-form');
const supportForm = document.getElementById('support-form');

const lemonSqueezyCheckoutUrl = '';

function showToast(message) {
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add('show');
  window.setTimeout(() => {
    toast.classList.remove('show');
  }, 2400);
}

function openDrawer() {
  if (!drawer || !overlay) return;
  drawer.classList.add('open');
  overlay.classList.add('show');
  drawer.setAttribute('aria-hidden', 'false');
  document.body.classList.add('drawer-open');
  const input = drawer.querySelector('input[type="email"]');
  if (input) input.focus();
}

function closeDrawer() {
  if (!drawer || !overlay) return;
  drawer.classList.remove('open');
  overlay.classList.remove('show');
  drawer.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('drawer-open');
}

upgradeButtons.forEach((button) => {
  button.addEventListener('click', (event) => {
    event.preventDefault();
    openDrawer();
  });
});

closeButtons.forEach((button) => {
  button.addEventListener('click', (event) => {
    event.preventDefault();
    closeDrawer();
  });
});

if (overlay) {
  overlay.addEventListener('click', closeDrawer);
}

if (form) {
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    if (lemonSqueezyCheckoutUrl) {
      window.location.href = lemonSqueezyCheckoutUrl;
      return;
    }
    showToast('Checkout link will be enabled here.');
  });
}

if (supportForm) {
  supportForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const emailInput = supportForm.querySelector('input[name="email"]');
    const messageInput = supportForm.querySelector('textarea[name="message"]');
    const email = emailInput ? emailInput.value.trim() : '';
    const message = messageInput ? messageInput.value.trim() : '';
    const subject = encodeURIComponent('PlayMySubs Support Request');
    const body = encodeURIComponent(`From: ${email}\n\n${message}`);
    window.location.href = `mailto:support@playmysubs.com?subject=${subject}&body=${body}`;
  });
}

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') closeDrawer();
});
