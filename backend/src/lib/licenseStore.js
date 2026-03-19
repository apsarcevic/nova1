const fileStore = require('./fileLicenseStore');
const supabaseStore = require('./supabaseLicenseStore');

function getDriver() {
  return (process.env.LICENSE_STORE_DRIVER || 'file').trim().toLowerCase();
}

function getStore() {
  const driver = getDriver();
  if (driver === 'supabase') {
    return supabaseStore;
  }
  return fileStore;
}

async function getByLicenseKey(licenseKey) {
  return getStore().getByLicenseKey(licenseKey);
}

async function getByProviderTransactionId(providerTransactionId) {
  return getStore().getByProviderTransactionId(providerTransactionId);
}

async function upsert(record) {
  return getStore().upsert(record);
}

module.exports = {
  getByLicenseKey,
  getByProviderTransactionId,
  upsert
};
