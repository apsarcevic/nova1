# Deployment Plan

This is the current production direction for PlayMySubs.

## Chosen Stack

- Static site: Cloudflare Pages
- DNS: Cloudflare
- Persistent storage: Supabase Postgres via REST
- Optional API runtime when needed: Cloudflare-compatible edge/serverless function layer

## Why This Stack

- the site is static-first and fits Cloudflare Pages naturally
- the domain already lives on Cloudflare
- the current MVP does not require a permanent Node server
- Supabase can still be reached over plain `fetch`

## Planned Public Endpoints

When same-domain API routes are turned back on, the expected endpoints remain:

- `POST /api/license/verify`
- `POST /api/webhooks/paddle`

## Required Environment Variables

### Cloudflare Pages / Cloudflare-compatible runtime

- `LICENSE_STORE_DRIVER=supabase`
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `SUPABASE_LICENSES_TABLE=licenses`
- `PADDLE_WEBHOOK_SECRET`
- `PADDLE_WEBHOOK_TOLERANCE_SECONDS=300`

### Extension

- `LICENSE_VERIFY_CONFIG.endpoint=https://playmysubs.com/api/license/verify`

## Execution Checklist

Follow:

- [SETUP_CHECKLIST.md](/run/media/alesar/5a8d7f9b-81af-47dd-8912-95bc67eb6ecf/nova1/backend/SETUP_CHECKLIST.md)

## Database

Run the schema in:

- [supabase-schema.sql](/run/media/alesar/5a8d7f9b-81af-47dd-8912-95bc67eb6ecf/nova1/backend/sql/supabase-schema.sql)

## What Still Must Be Confirmed Before Production Payments

1. real Paddle production approval
2. one real end-to-end payment test
3. webhook receipt in the live runtime
4. license creation/update from the real Paddle event
5. extension activation against the live verify endpoint
