const crypto = require('crypto');

function nowIso() {
  return new Date().toISOString();
}

function buildLicenseKey() {
  const prefix = process.env.LICENSE_KEY_PREFIX || 'PMS';
  const chunk = crypto.randomBytes(6).toString('hex').toUpperCase();
  return `${prefix}-${chunk.slice(0, 4)}-${chunk.slice(4, 8)}-${chunk.slice(8, 12)}`;
}

function normalizeRecord(input) {
  return {
    licenseKey: String(input.licenseKey || '').trim(),
    customerEmail: String(input.customerEmail || '').trim().toLowerCase(),
    plan: input.plan === 'premium' ? 'premium' : 'free',
    status: input.status || 'inactive',
    expiresAt: typeof input.expiresAt === 'string' && input.expiresAt ? input.expiresAt : null,
    provider: input.provider || 'manual',
    providerCustomerId: input.providerCustomerId || null,
    providerTransactionId: input.providerTransactionId || null,
    createdAt: input.createdAt || nowIso(),
    updatedAt: nowIso()
  };
}

function isExpired(expiresAt) {
  return !!(expiresAt && Date.parse(expiresAt) <= Date.now());
}

function buildVerifyResult(record) {
  if (!record) {
    return {
      valid: false,
      plan: 'free',
      expiresAt: null,
      message: 'License is not valid for Premium access.'
    };
  }

  if (record.status === 'revoked' || record.status === 'refunded' || record.status === 'invalid') {
    return {
      valid: false,
      plan: 'free',
      expiresAt: record.expiresAt,
      message: 'License is not valid for Premium access.'
    };
  }

  if (record.status === 'expired' || isExpired(record.expiresAt)) {
    return {
      valid: false,
      plan: 'free',
      expiresAt: record.expiresAt,
      message: 'License expired.'
    };
  }

  if (record.status === 'active' && record.plan === 'premium') {
    return {
      valid: true,
      plan: 'premium',
      expiresAt: record.expiresAt,
      message: 'License verified.'
    };
  }

  return {
    valid: false,
    plan: 'free',
    expiresAt: record.expiresAt,
    message: 'License is not valid for Premium access.'
  };
}

function issueOrUpdateFromProviderEvent(event, existingRecord) {
  const base = existingRecord || {
    licenseKey: event.licenseKey || buildLicenseKey(),
    createdAt: nowIso()
  };

  return normalizeRecord({
    ...base,
    customerEmail: event.customerEmail,
    plan: event.plan || 'premium',
    status: event.status || 'active',
    expiresAt: event.expiresAt || null,
    provider: event.provider || 'paddle',
    providerCustomerId: event.providerCustomerId || null,
    providerTransactionId: event.providerTransactionId || null,
    createdAt: base.createdAt || nowIso()
  });
}

module.exports = {
  buildLicenseKey,
  buildVerifyResult,
  issueOrUpdateFromProviderEvent,
  normalizeRecord
};
