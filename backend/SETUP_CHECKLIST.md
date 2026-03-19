# Setup Checklist

This checklist is the exact execution order for turning the current local license backend into a deployed service for `playmysubs.com`.

## 1. Supabase Project

Create a new Supabase project dedicated to PlayMySubs licensing.

Required outputs to collect:

- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`

Do not use the public anon key for backend writes.

## 2. Supabase Table

Open the SQL editor in Supabase and run:

- [supabase-schema.sql](/run/media/alesar/5a8d7f9b-81af-47dd-8912-95bc67eb6ecf/nova1/backend/sql/supabase-schema.sql)

Expected table:

- `public.licenses`

Expected primary key:

- `license_key`

## 3. Seed A Manual Test License

Insert one known record manually so the verify endpoint can be tested before Paddle is involved.

Example:

```sql
insert into public.licenses (
  license_key,
  customer_email,
  plan,
  status,
  expires_at,
  provider,
  provider_customer_id,
  provider_transaction_id
) values (
  'PMS-MANUAL-TEST-0001',
  'you@example.com',
  'premium',
  'active',
  null,
  'manual',
  null,
  'txn_manual_test'
);
```

## 4. Netlify Site

Use the `nova1` repo as the Netlify site source.

Required config already present:

- [netlify.toml](/run/media/alesar/5a8d7f9b-81af-47dd-8912-95bc67eb6ecf/nova1/netlify.toml)

Expected public routes after deploy:

- `https://playmysubs.com/api/license/verify`
- `https://playmysubs.com/api/webhooks/paddle`

## 5. Netlify Environment Variables

In Netlify, add these environment variables:

- `LICENSE_STORE_DRIVER=supabase`
- `SUPABASE_URL=<your supabase project url>`
- `SUPABASE_SERVICE_ROLE_KEY=<your service role key>`
- `SUPABASE_LICENSES_TABLE=licenses`
- `PADDLE_WEBHOOK_SECRET=<leave placeholder until Paddle is configured>`
- `PADDLE_WEBHOOK_TOLERANCE_SECONDS=300`
- `LICENSE_KEY_PREFIX=PMS`

Optional:

- `PLAYMYSUBS_PUBLIC_URL=https://playmysubs.com`
- `LICENSE_VERIFY_ENDPOINT=https://playmysubs.com/api/license/verify`

Reference:

- [backend/.env.example](/run/media/alesar/5a8d7f9b-81af-47dd-8912-95bc67eb6ecf/nova1/backend/.env.example)

## 6. First Verify Test

After deploy, test the verify route with the manual seed record.

Example request:

```bash
curl -X POST https://playmysubs.com/api/license/verify \
  -H "Content-Type: application/json" \
  -d '{
    "licenseKey": "PMS-MANUAL-TEST-0001",
    "product": "miniyoutube-extension",
    "version": "1.1.0"
  }'
```

Expected response:

```json
{
  "valid": true,
  "plan": "premium",
  "expiresAt": null,
  "message": "License verified."
}
```

## 7. Extension Wiring

Once the verify route works from the public domain, set:

- `LICENSE_VERIFY_CONFIG.endpoint=https://playmysubs.com/api/license/verify`

in:

- [background.js](/run/media/alesar/5a8d7f9b-81af-47dd-8912-95bc67eb6ecf/miniyoutube/MiniYoutube/background.js)

Then reload the extension and test activation with the seeded license.

## 8. Paddle Preparation

Before real checkout goes live, still required:

- replace stub signature validation in [paddle.js](/run/media/alesar/5a8d7f9b-81af-47dd-8912-95bc67eb6ecf/nova1/backend/src/lib/paddle.js)
- normalize real Paddle webhook payloads
- decide which Paddle event creates or updates the license record

## 9. Checkout Wiring

After webhook processing is real:

- replace the placeholder checkout logic in [main.js](/run/media/alesar/5a8d7f9b-81af-47dd-8912-95bc67eb6ecf/nova1/main.js)
- point the upgrade flow to Paddle checkout
- ensure post-purchase messaging says that a license key is delivered by email

## 10. Final Pre-Launch Smoke

Run this exact order:

1. verify manual seeded license through the public endpoint
2. activate the same license inside the extension
3. trigger a Paddle webhook in test mode
4. confirm the database record is created or updated
5. verify the new key through `/api/license/verify`
6. confirm the extension unlocks Premium from the real backend response
