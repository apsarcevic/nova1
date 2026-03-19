const fs = require('fs/promises');
const path = require('path');

const LICENSES_PATH = path.resolve(__dirname, '..', '..', 'data', 'licenses.json');

async function readAll() {
  const raw = await fs.readFile(LICENSES_PATH, 'utf8');
  const parsed = JSON.parse(raw);
  return Array.isArray(parsed) ? parsed : [];
}

async function writeAll(records) {
  await fs.writeFile(LICENSES_PATH, `${JSON.stringify(records, null, 2)}\n`, 'utf8');
}

async function getByLicenseKey(licenseKey) {
  const records = await readAll();
  return records.find((record) => record.licenseKey === licenseKey) || null;
}

async function getByProviderTransactionId(providerTransactionId) {
  const records = await readAll();
  return records.find((record) => record.providerTransactionId === providerTransactionId) || null;
}

async function upsert(record) {
  const records = await readAll();
  const index = records.findIndex((entry) => entry.licenseKey === record.licenseKey);
  if (index >= 0) {
    records[index] = record;
  } else {
    records.push(record);
  }
  await writeAll(records);
  return record;
}

module.exports = {
  getByLicenseKey,
  getByProviderTransactionId,
  upsert
};
