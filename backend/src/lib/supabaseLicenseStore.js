function getSupabaseConfig() {
  const url = process.env.SUPABASE_URL || '';
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
  const table = process.env.SUPABASE_LICENSES_TABLE || 'licenses';
  if (!url || !serviceRoleKey) {
    throw new Error('SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required for the supabase store driver.');
  }
  return { url, serviceRoleKey, table };
}

function mapDbRecordToLicense(record) {
  if (!record || typeof record !== 'object') return null;
  return {
    licenseKey: record.license_key || '',
    customerEmail: record.customer_email || '',
    plan: record.plan || 'free',
    status: record.status || 'inactive',
    expiresAt: record.expires_at || null,
    provider: record.provider || 'paddle',
    providerCustomerId: record.provider_customer_id || null,
    providerTransactionId: record.provider_transaction_id || null,
    createdAt: record.created_at || null,
    updatedAt: record.updated_at || null
  };
}

function mapLicenseToDbRecord(record) {
  return {
    license_key: record.licenseKey,
    customer_email: record.customerEmail,
    plan: record.plan,
    status: record.status,
    expires_at: record.expiresAt,
    provider: record.provider,
    provider_customer_id: record.providerCustomerId,
    provider_transaction_id: record.providerTransactionId,
    created_at: record.createdAt,
    updated_at: record.updatedAt
  };
}

async function request(path, options = {}) {
  const { url, serviceRoleKey } = getSupabaseConfig();
  const response = await fetch(`${url}${path}`, {
    ...options,
    headers: {
      apikey: serviceRoleKey,
      Authorization: `Bearer ${serviceRoleKey}`,
      'Content-Type': 'application/json',
      ...(options.headers || {})
    }
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Supabase request failed (${response.status}): ${text}`);
  }

  return response.status === 204 ? null : response.json();
}

async function getByLicenseKey(licenseKey) {
  const { table } = getSupabaseConfig();
  const data = await request(
    `/rest/v1/${table}?license_key=eq.${encodeURIComponent(licenseKey)}&select=*`
  );
  if (!Array.isArray(data) || !data.length) {
    return null;
  }
  return mapDbRecordToLicense(data[0]);
}

async function getByProviderTransactionId(providerTransactionId) {
  const { table } = getSupabaseConfig();
  const data = await request(
    `/rest/v1/${table}?provider_transaction_id=eq.${encodeURIComponent(providerTransactionId)}&select=*`
  );
  if (!Array.isArray(data) || !data.length) {
    return null;
  }
  return mapDbRecordToLicense(data[0]);
}

async function upsert(record) {
  const { table } = getSupabaseConfig();
  const payload = mapLicenseToDbRecord(record);
  await request(`/rest/v1/${table}?on_conflict=license_key`, {
    method: 'POST',
    headers: {
      Prefer: 'resolution=merge-duplicates,return=representation'
    },
    body: JSON.stringify(payload)
  });
  return record;
}

module.exports = {
  getByLicenseKey,
  getByProviderTransactionId,
  upsert
};
