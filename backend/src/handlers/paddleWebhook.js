const { getByLicenseKey, upsert } = require('../lib/licenseStore');
const { issueOrUpdateFromProviderEvent } = require('../lib/licenseService');
const { normalizePaddleEvent, verifyPaddleWebhookSignature } = require('../lib/paddle');
const { badRequest, methodNotAllowed, ok, parseJsonBody, serverError } = require('../lib/http');

async function handler(event) {
  if (event.httpMethod !== 'POST') {
    return methodNotAllowed(event.httpMethod);
  }

  try {
    if (!verifyPaddleWebhookSignature(event)) {
      return badRequest('Invalid webhook signature.');
    }

    const body = parseJsonBody(event);
    const normalizedEvent = normalizePaddleEvent(body);
    const existing = normalizedEvent.licenseKey
      ? await getByLicenseKey(normalizedEvent.licenseKey)
      : null;
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
