const { getByLicenseKey } = require('../lib/licenseStore');
const { buildVerifyResult } = require('../lib/licenseService');
const { badRequest, methodNotAllowed, ok, parseJsonBody, serverError } = require('../lib/http');

async function handler(event) {
  if (event.httpMethod !== 'POST') {
    return methodNotAllowed(event.httpMethod);
  }

  try {
    const body = parseJsonBody(event);
    const licenseKey = typeof body.licenseKey === 'string' ? body.licenseKey.trim() : '';
    if (!licenseKey) {
      return badRequest('licenseKey is required.');
    }

    const record = await getByLicenseKey(licenseKey);
    return ok(buildVerifyResult(record));
  } catch (error) {
    return serverError(error && error.message ? error.message : 'Unable to verify license right now.');
  }
}

module.exports = { handler };
