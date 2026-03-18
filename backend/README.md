# PlayMySubs Backend Skeleton

This folder contains the minimal backend skeleton required to move PlayMySubs from local premium preview into a real license-based product.

## Goal

The extension should verify a license key through a small backend contract instead of talking to a payment provider directly.

Planned responsibilities:
- receive payment-provider fulfillment events
- create or update a license record
- verify whether a license key currently unlocks Premium
- return the contract already documented in `MiniYoutube/LICENSE_API_CONTRACT.md`

## Planned Routes

- `POST /api/license/verify`
  - input: `licenseKey`, `product`, `version`
  - output: `valid`, `plan`, `expiresAt`, `message`

- `POST /api/webhooks/paddle`
  - receives Paddle fulfillment events
  - normalizes them into the local license record model

## What This Skeleton Is

- local Node modules with small handlers
- pluggable storage driver:
  - `file` for local testing
  - `supabase` for production deployment
- smoke script to simulate verify and webhook flows

## What This Skeleton Is Not

- not production storage
- not a deployed API
- not final Paddle signature verification
- not the final hosting decision

## Local Files

- `src/handlers/verifyLicense.js`: verify endpoint logic
- `src/handlers/paddleWebhook.js`: provider event normalization + upsert flow
- `src/lib/licenseStore.js`: runtime store selector
- `src/lib/fileLicenseStore.js`: local JSON record adapter
- `src/lib/supabaseLicenseStore.js`: Supabase REST adapter
- `src/lib/licenseService.js`: shared business rules
- `sql/supabase-schema.sql`: starter schema for the production store
- `data/licenses.json`: local test data
- `scripts/smoke.js`: local smoke run
- `DEPLOYMENT_PLAN.md`: chosen production stack and rollout order

## Recommended Production Replacement

Production should use `LICENSE_STORE_DRIVER=supabase` and the schema in `sql/supabase-schema.sql`.

Suggested record shape:

```json
{
  "licenseKey": "PMS-XXXX-XXXX",
  "customerEmail": "user@example.com",
  "plan": "premium",
  "status": "active",
  "expiresAt": null,
  "provider": "paddle",
  "providerCustomerId": "ctm_123",
  "providerTransactionId": "txn_123",
  "createdAt": "2026-03-18T10:00:00.000Z",
  "updatedAt": "2026-03-18T10:00:00.000Z"
}
```

## Local Smoke

```bash
cd nova1
node backend/scripts/smoke.js
```

## Deployment Direction

Current recommended stack:

- Netlify static hosting
- Netlify Functions for `/api/*`
- Supabase Postgres via REST for persistent license storage
