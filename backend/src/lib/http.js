const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Methods': 'POST, OPTIONS'
};

function json(statusCode, body) {
  return {
    statusCode,
    headers: {
      'Content-Type': 'application/json',
      ...CORS_HEADERS
    },
    body: JSON.stringify(body, null, 2)
  };
}

function noContent() {
  return {
    statusCode: 204,
    headers: {
      ...CORS_HEADERS
    },
    body: ''
  };
}

function ok(body) {
  return json(200, body);
}

function badRequest(message) {
  return json(400, { message });
}

function methodNotAllowed(method) {
  return json(405, { message: `Method ${method} is not allowed.` });
}

function serverError(message) {
  return json(500, { message });
}

function parseJsonBody(event) {
  if (!event || typeof event.body !== 'string' || !event.body.trim()) {
    return {};
  }
  const rawBody = event.isBase64Encoded
    ? Buffer.from(event.body, 'base64').toString('utf8')
    : event.body;
  return JSON.parse(rawBody);
}

module.exports = {
  badRequest,
  methodNotAllowed,
  noContent,
  ok,
  parseJsonBody,
  serverError
};
