const crypto = require('crypto');
const fs = require('fs/promises');
const path = require('path');
const { handler: verifyLicense } = require('../src/handlers/verifyLicense');
const { handler: paddleWebhook } = require('../src/handlers/paddleWebhook');

const licensesPath = path.resolve(__dirname, '..', 'data', 'licenses.json');
const webhookSecret = 'smoke-test-secret';

function signPayload(rawBody) {
  const timestamp = Math.floor(Date.now() / 1000);
  const digest = crypto
    .createHmac('sha256', webhookSecret)
    .update(`${timestamp}:${rawBody}`, 'utf8')
    .digest('hex');

  return `ts=${timestamp};h1=${digest}`;
}

async function run() {
  const originalSeed = await fs.readFile(licensesPath, 'utf8');
  const previousSecret = process.env.PADDLE_WEBHOOK_SECRET;

  try {
    process.env.PADDLE_WEBHOOK_SECRET = webhookSecret;

    const existing = await verifyLicense({
      httpMethod: 'POST',
      body: JSON.stringify({
        licenseKey: 'PMS-DEMO-ACTIVE-0001',
        product: 'miniyoutube-extension',
        version: '1.1.0'
      })
    });

    console.log('Verify active demo:');
    console.log(existing.body);

    const webhookPayload = JSON.stringify({
      notification_id: 'ntf_1001',
      event_id: 'evt_1001',
      event_type: 'transaction.completed',
      occurred_at: new Date().toISOString(),
      data: {
        id: 'txn_paddle_1001',
        customer_id: 'ctm_1001',
        status: 'completed',
        billing_details: {
          email: 'buyer@playmysubs.com',
          name: 'PlayMySubs Buyer'
        },
        custom_data: {
          customerEmail: 'buyer@playmysubs.com',
          plan: 'premium',
          product: 'miniyoutube-extension',
          source: 'playmysubs-website'
        }
      }
    });

    const created = await paddleWebhook({
      httpMethod: 'POST',
      headers: {
        'Paddle-Signature': signPayload(webhookPayload)
      },
      body: webhookPayload
    });

    console.log('\nWebhook create/update:');
    console.log(created.body);

    const parsedCreated = JSON.parse(created.body);
    const verifyCreated = await verifyLicense({
      httpMethod: 'POST',
      body: JSON.stringify({
        licenseKey: parsedCreated.licenseKey,
        product: 'miniyoutube-extension',
        version: '1.1.0'
      })
    });

    console.log('\nVerify created license:');
    console.log(verifyCreated.body);
  } finally {
    if (previousSecret) {
      process.env.PADDLE_WEBHOOK_SECRET = previousSecret;
    } else {
      delete process.env.PADDLE_WEBHOOK_SECRET;
    }
    await fs.writeFile(licensesPath, originalSeed, 'utf8');
  }
}

run().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
