function json(statusCode, body) {
  return {
    statusCode,
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body, null, 2)
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
  return JSON.parse(event.body);
}

module.exports = {
  badRequest,
  methodNotAllowed,
  ok,
  parseJsonBody,
  serverError
};
