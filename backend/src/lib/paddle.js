const crypto = require('crypto');

function getHeader(headers, key) {
  if (!headers || typeof headers !== 'object') return '';
  const match = Object.keys(headers).find((candidate) => candidate.toLowerCase() === key.toLowerCase());
  return match ? String(headers[match] || '') : '';
}

function getRawBody(event) {
  if (!event || typeof event.body !== 'string') {
    return '';
  }
  if (event.isBase64Encoded) {
    return Buffer.from(event.body, 'base64').toString('utf8');
  }
  return event.body;
}

function parseSignatureHeader(header) {
  const parts = String(header || '')
    .split(';')
    .map((part) => part.trim())
    .filter(Boolean);

  const parsed = {};
  for (const part of parts) {
    const [name, ...rest] = part.split('=');
    if (!name || !rest.length) continue;
    const value = rest.join('=').trim();
    if (!parsed[name]) {
      parsed[name] = [];
    }
    parsed[name].push(value);
  }

  return {
    ts: parsed.ts && parsed.ts[0] ? parsed.ts[0] : '',
    h1: parsed.h1 || []
  };
}

function safeCompareHex(expectedHex, candidateHex) {
  const expected = Buffer.from(expectedHex, 'hex');
  const candidate = Buffer.from(candidateHex, 'hex');
  if (expected.length !== candidate.length) {
    return false;
  }
  return crypto.timingSafeEqual(expected, candidate);
}

function deriveLicenseStatus(eventType, transactionStatus, customData) {
  const explicitStatus = customData.status || customData.licenseStatus || '';
  if (explicitStatus) {
    return explicitStatus;
  }

  const normalizedEventType = String(eventType || '').toLowerCase();
  const normalizedTransactionStatus = String(transactionStatus || '').toLowerCase();

  if (normalizedEventType === 'transaction.completed') {
    return 'active';
  }

  if (normalizedEventType === 'transaction.paid') {
    return 'active';
  }

  if (normalizedTransactionStatus === 'completed' || normalizedTransactionStatus === 'paid' || normalizedTransactionStatus === 'billed') {
    return 'active';
  }

  if (normalizedTransactionStatus === 'past_due') {
    return 'past_due';
  }

  if (normalizedTransactionStatus === 'canceled') {
    return 'canceled';
  }

  return normalizedTransactionStatus || 'pending';
}

function normalizePaddleEvent(payload) {
  if (!payload || typeof payload !== 'object') {
    throw new Error('Webhook payload is required.');
  }

  const eventType = payload.event_type || payload.eventType || '';
  const transactionData = payload.data && typeof payload.data === 'object' ? payload.data : null;
  const customData = transactionData && transactionData.custom_data && typeof transactionData.custom_data === 'object'
    ? transactionData.custom_data
    : {};
  const customer = transactionData && transactionData.customer && typeof transactionData.customer === 'object'
    ? transactionData.customer
    : null;

  const customerEmail = payload.customerEmail
    || payload.customer_email
    || (customer ? customer.email : '')
    || customData.customerEmail
    || customData.customer_email
    || '';

  const providerTransactionId = payload.providerTransactionId
    || payload.provider_transaction_id
    || (transactionData ? transactionData.id : '')
    || '';

  if (!customerEmail || !providerTransactionId) {
    throw new Error('Webhook payload must include customerEmail/providerTransactionId or Paddle custom_data with customerEmail.');
  }

  return {
    eventType,
    provider: 'paddle',
    licenseKey: payload.licenseKey || payload.license_key || customData.licenseKey || customData.license_key || '',
    customerEmail,
    providerCustomerId: payload.providerCustomerId || payload.provider_customer_id || (transactionData ? transactionData.customer_id : null) || null,
    providerTransactionId,
    plan: payload.plan || customData.plan || 'premium',
    status: deriveLicenseStatus(eventType, payload.status || (transactionData ? transactionData.status : null), customData),
    expiresAt: payload.expiresAt || payload.expires_at || customData.expiresAt || customData.expires_at || null
  };
}

function verifyPaddleWebhookSignature(event) {
  const endpointSecret = process.env.PADDLE_WEBHOOK_SECRET || '';
  if (!endpointSecret || endpointSecret === 'replace-me' || endpointSecret === 'replace-me-for-now') {
    throw new Error('PADDLE_WEBHOOK_SECRET is not configured.');
  }

  const signatureHeader = getHeader(event && event.headers, 'Paddle-Signature');
  if (!signatureHeader) {
    return false;
  }

  const { ts, h1 } = parseSignatureHeader(signatureHeader);
  if (!ts || !h1.length) {
    return false;
  }

  const toleranceSeconds = Number.parseInt(process.env.PADDLE_WEBHOOK_TOLERANCE_SECONDS || '300', 10);
  const timestamp = Number.parseInt(ts, 10);
  if (!Number.isFinite(timestamp)) {
    return false;
  }

  const currentTimestamp = Math.floor(Date.now() / 1000);
  if (Math.abs(currentTimestamp - timestamp) > toleranceSeconds) {
    return false;
  }

  const rawBody = getRawBody(event);
  const signedPayload = `${ts}:${rawBody}`;
  const expectedSignature = crypto
    .createHmac('sha256', endpointSecret)
    .update(signedPayload, 'utf8')
    .digest('hex');

  return h1.some((candidate) => safeCompareHex(expectedSignature, candidate));
}

module.exports = {
  normalizePaddleEvent,
  verifyPaddleWebhookSignature
};
