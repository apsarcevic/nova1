# Setup Checklist

This checklist is the current execution order for running PlayMySubs on Cloudflare Pages and preparing the live license flow.

## 1. Cloudflare Pages Project

Use the `nova1` repo as the Cloudflare Pages source.

Current targets:

- production: `https://playmysubs.com`
- preview: `https://nova1-325.pages.dev`

## 2. Supabase Project

Create or reuse the dedicated Supabase project for PlayMySubs licensing.

Collect:

- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`

Do not use the anon key for backend writes.

## 3. Supabase Table

Run:

- [supabase-schema.sql](/run/media/alesar/5a8d7f9b-81af-47dd-8912-95bc67eb6ecf/nova1/backend/sql/supabase-schema.sql)

Expected table:

- `public.licenses`

## 4. Seed A Manual Test License

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

## 5. Cloudflare Environment Variables

In Cloudflare Pages or the chosen Cloudflare-compatible runtime, add:

- `LICENSE_STORE_DRIVER=supabase`
- `SUPABASE_URL=<your supabase project url>`
- `SUPABASE_SERVICE_ROLE_KEY=<your service role key>`
- `SUPABASE_LICENSES_TABLE=licenses`
- `PADDLE_WEBHOOK_SECRET=<set when Paddle live webhooks are enabled>`
- `PADDLE_WEBHOOK_TOLERANCE_SECONDS=300`
- `LICENSE_KEY_PREFIX=PMS`

Optional:

- `PLAYMYSUBS_PUBLIC_URL=https://playmysubs.com`
- `LICENSE_VERIFY_ENDPOINT=https://playmysubs.com/api/license/verify`

## 6. First Verify Test

When the live verify route exists again, test:

```bash
curl -X POST https://playmysubs.com/api/license/verify \
  -H "Content-Type: application/json" \
  -d '{
    "licenseKey": "PMS-MANUAL-TEST-0001",
    "product": "miniyoutube-extension",
    "version": "1.1.1"
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

Once the live verify route works:

- keep `LICENSE_VERIFY_CONFIG.endpoint=https://playmysubs.com/api/license/verify`
- reload the extension
- test activation with the seeded license

## 8. Paddle Live Checks

Before enabling production checkout:

1. confirm Paddle production approval
2. confirm approved domain is `playmysubs.com`
3. confirm real checkout opens on the Cloudflare-hosted site
4. confirm the webhook runtime receives the live event

## 9. Final Pre-Launch Smoke

1. verify seeded license through the public endpoint
2. activate the same license inside the extension
3. complete one real Paddle payment
4. confirm the database record is created or updated
5. verify the new key through `/api/license/verify`
6. confirm the extension unlocks Premium from the live backend response
