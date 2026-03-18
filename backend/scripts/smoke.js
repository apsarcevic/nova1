const fs = require('fs/promises');
const path = require('path');
const { handler: verifyLicense } = require('../src/handlers/verifyLicense');
const { handler: paddleWebhook } = require('../src/handlers/paddleWebhook');

const licensesPath = path.resolve(__dirname, '..', 'data', 'licenses.json');

async function run() {
  const originalSeed = await fs.readFile(licensesPath, 'utf8');

  try {
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

    const created = await paddleWebhook({
      httpMethod: 'POST',
      body: JSON.stringify({
        customerEmail: 'buyer@playmysubs.com',
        providerTransactionId: 'txn_paddle_1001',
        providerCustomerId: 'ctm_1001',
        plan: 'premium',
        status: 'active'
      })
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
    await fs.writeFile(licensesPath, originalSeed, 'utf8');
  }
}

run().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
