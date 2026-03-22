# PlayMySubs Backend Reference

This folder contains the local backend reference for moving PlayMySubs from local premium preview into a real license-based product.

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

## What This Reference Is

- local Node modules with small handlers
- pluggable storage driver:
  - `file` for local testing
  - `supabase` for production data
- smoke script to simulate verify and webhook flows

## What This Reference Is Not

- not the current live Cloudflare runtime
- not production storage by itself
- not a deployed Pages Function or Worker yet

## Local Files

- `src/handlers/verifyLicense.js`: verify endpoint logic
- `src/handlers/paddleWebhook.js`: provider event normalization + upsert flow
- `src/lib/licenseStore.js`: runtime store selector
- `src/lib/fileLicenseStore.js`: local JSON record adapter
- `src/lib/supabaseLicenseStore.js`: Supabase REST adapter
- `src/lib/licenseService.js`: shared business rules
- `src/lib/paddle.js`: Paddle event normalization + signature verification
- `PADDLE_WEBHOOK_EVENT_NOTES.md`: live webhook field assumptions
- `sql/supabase-schema.sql`: starter schema for the production store
- `data/licenses.json`: local test data
- `scripts/smoke.js`: local smoke run
- `DEPLOYMENT_PLAN.md`: Cloudflare-first deployment direction
- `SETUP_CHECKLIST.md`: exact Cloudflare + Supabase execution checklist

## Recommended Production Direction

- static website on Cloudflare Pages
- persistent license storage in Supabase
- if same-domain API routes are needed, implement them in a Cloudflare-compatible runtime
