const toast = document.getElementById('drawer-toast');
const drawer = document.getElementById('upgrade-drawer');
const overlay = document.querySelector('.drawer-overlay');
const upgradeButtons = document.querySelectorAll('[data-upgrade]');
const closeButtons = document.querySelectorAll('[data-drawer-close]');
const clickableUpgradeCards = document.querySelectorAll('.clickable-card[data-upgrade]');
const form = document.getElementById('upgrade-form');
const supportForm = document.getElementById('support-form');
const paddleConfig = window.PLAYMYSUBS_PADDLE_CONFIG || {};

const checkoutProviderName = 'Paddle';
let paddleInitialized = false;

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

function getCheckoutReadiness() {
  return {
    hasScript: typeof window.Paddle !== 'undefined',
    hasClientToken: typeof paddleConfig.clientToken === 'string' && paddleConfig.clientToken.trim().length > 0,
    hasPriceId: typeof paddleConfig.priceId === 'string' && paddleConfig.priceId.trim().length > 0
  };
}

function initializePaddle() {
  const readiness = getCheckoutReadiness();
  if (!readiness.hasScript || !readiness.hasClientToken) {
    return false;
  }

  if (paddleInitialized) {
    return true;
  }

  if (paddleConfig.environment === 'sandbox' && window.Paddle.Environment) {
    window.Paddle.Environment.set('sandbox');
  }

  window.Paddle.Initialize({
    token: paddleConfig.clientToken.trim()
  });
  paddleInitialized = true;
  return true;
}

function openPaddleCheckout(email) {
  const readiness = getCheckoutReadiness();
  if (!readiness.hasScript) {
    showToast('Paddle.js is not loaded yet.');
    return;
  }
  if (!readiness.hasClientToken || !readiness.hasPriceId) {
    showToast('Checkout is not fully configured yet. Add the Paddle client token and price ID first.');
    return;
  }
  if (!initializePaddle()) {
    showToast('Unable to initialize Paddle checkout.');
    return;
  }

  window.Paddle.Checkout.open({
    items: [
      {
        priceId: paddleConfig.priceId.trim(),
        quantity: 1
      }
    ],
    customer: {
      email
    },
    customData: {
      customerEmail: email,
      plan: 'premium',
      product: 'miniyoutube-extension',
      source: 'playmysubs-website'
    },
    settings: {
      displayMode: 'overlay',
      locale: paddleConfig.locale || 'en',
      theme: paddleConfig.theme || 'light',
      successUrl: paddleConfig.successUrl || `${window.location.origin}/?checkout=success`
    }
  });
}

upgradeButtons.forEach((button) => {
  button.addEventListener('click', (event) => {
    event.preventDefault();
    openDrawer();
  });
  if (button.tagName !== 'BUTTON' && button.tagName !== 'A') {
    button.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        openDrawer();
      }
    });
  }
});

clickableUpgradeCards.forEach((card) => {
  card.addEventListener('click', (event) => {
    event.preventDefault();
    openDrawer();
  });
  card.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      openDrawer();
    }
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
    const emailInput = form.querySelector('input[name="email"]');
    const email = emailInput ? emailInput.value.trim() : '';
    if (!email) {
      showToast('Enter your email first.');
      return;
    }
    openPaddleCheckout(email);
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
    window.location.href = `mailto:hello@playmysubs.com?subject=${subject}&body=${body}`;
  });
}

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') closeDrawer();
});

if (window.location.search.includes('checkout=open')) {
  window.setTimeout(() => {
    openDrawer();
  }, 120);
}

if (window.location.search.includes('checkout=success')) {
  window.setTimeout(() => {
    showToast(`Checkout completed. Watch your inbox for your ${checkoutProviderName} receipt and license delivery.`);
  }, 200);
}
