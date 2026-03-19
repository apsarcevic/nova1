const { getByLicenseKey, getByProviderTransactionId, upsert } = require('../lib/licenseStore');
const { issueOrUpdateFromProviderEvent } = require('../lib/licenseService');
const { normalizePaddleEvent, verifyPaddleWebhookSignature } = require('../lib/paddle');
const { badRequest, methodNotAllowed, noContent, ok, parseJsonBody, serverError } = require('../lib/http');

function shouldFulfillLicense(event) {
  return event.status === 'active';
}

async function handler(event) {
  if (event.httpMethod === 'OPTIONS') {
    return noContent();
  }

  if (event.httpMethod !== 'POST') {
    return methodNotAllowed(event.httpMethod);
  }

  try {
    if (!verifyPaddleWebhookSignature(event)) {
      return badRequest('Invalid webhook signature.');
    }

    const body = parseJsonBody(event);
    const normalizedEvent = normalizePaddleEvent(body);
    const existingByLicense = normalizedEvent.licenseKey
      ? await getByLicenseKey(normalizedEvent.licenseKey)
      : null;
    const existingByTransaction = !existingByLicense && normalizedEvent.providerTransactionId
      ? await getByProviderTransactionId(normalizedEvent.providerTransactionId)
      : null;
    const existing = existingByLicense || existingByTransaction;

    if (!shouldFulfillLicense(normalizedEvent)) {
      return ok({
        received: true,
        ignored: true,
        eventType: normalizedEvent.eventType || null,
        status: normalizedEvent.status
      });
    }

    const record = issueOrUpdateFromProviderEvent(normalizedEvent, existing);
    await upsert(record);

    return ok({
      received: true,
      licenseKey: record.licenseKey,
      status: record.status
    });
  } catch (error) {
    return serverError(error && error.message ? error.message : 'Unable to process webhook.');
  }
}

module.exports = { handler };
