function normalizePaddleEvent(payload) {
  if (!payload || typeof payload !== 'object') {
    throw new Error('Webhook payload is required.');
  }

  if (!payload.customerEmail || !payload.providerTransactionId) {
    throw new Error('Webhook payload must include customerEmail and providerTransactionId.');
  }

  return {
    provider: 'paddle',
    licenseKey: payload.licenseKey || '',
    customerEmail: payload.customerEmail,
    providerCustomerId: payload.providerCustomerId || null,
    providerTransactionId: payload.providerTransactionId,
    plan: payload.plan === 'premium' ? 'premium' : 'premium',
    status: payload.status || 'active',
    expiresAt: payload.expiresAt || null
  };
}

function verifyPaddleWebhookSignature() {
  // Temporary local stub: replace with real Paddle signature validation before production deploy.

  return true;
}

module.exports = {
  normalizePaddleEvent,
  verifyPaddleWebhookSignature
};
