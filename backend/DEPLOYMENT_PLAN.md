# Deployment Plan

This is the recommended production path for PlayMySubs right now.

## Chosen Stack

- Static site: Netlify
- Serverless API: Netlify Functions
- Persistent storage: Supabase Postgres via REST

## Why This Stack

- the current website is already a static site, so Netlify fits naturally
- Netlify Functions lets the API live behind the same `playmysubs.com` domain
- that avoids extra CORS complexity and keeps the public verify URL stable
- Supabase can be used through plain `fetch`, so this repo does not need extra npm dependencies just to reach the database

## Planned Public Endpoints

- `POST /api/license/verify`
- `POST /api/webhooks/paddle`

Netlify redirects these routes to the function wrappers in `netlify/functions/`.

## Required Environment Variables

### Netlify

- `LICENSE_STORE_DRIVER=supabase`
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `SUPABASE_LICENSES_TABLE=licenses`
- `PADDLE_WEBHOOK_SECRET`

### Extension

- `LICENSE_VERIFY_CONFIG.endpoint=https://playmysubs.com/api/license/verify`

## Execution Checklist

Follow:

- [SETUP_CHECKLIST.md](/run/media/alesar/5a8d7f9b-81af-47dd-8912-95bc67eb6ecf/nova1/backend/SETUP_CHECKLIST.md)

## Database

Run the schema in:

- [supabase-schema.sql](/run/media/alesar/5a8d7f9b-81af-47dd-8912-95bc67eb6ecf/nova1/backend/sql/supabase-schema.sql)

## What Still Must Be Implemented Before Production

1. real Paddle signature verification in `backend/src/lib/paddle.js`
2. mapping from actual Paddle webhook payloads to the local normalized event shape
3. real checkout wiring in `main.js`
4. set the real verify endpoint in the extension background config

## Recommended Rollout Order

1. Create Supabase project and `licenses` table.
2. Add Netlify environment variables.
3. Deploy the site with `netlify.toml`.
4. Test `POST /api/license/verify` using the `file` driver first if needed, then switch to `supabase`.
5. Implement and test real Paddle webhook verification.
6. Wire Paddle checkout on the site.
7. Point the extension to the production verify endpoint.
