# Setup Checklist

## Cloudflare Pages Project
1. Confirm production site is `https://playmysubs.com`
2. Confirm preview site is `https://nova1-325.pages.dev`
3. Keep DNS managed by Cloudflare
4. Keep website deployable as a static Pages project

## Supabase
1. Create Supabase project
2. Apply `backend/sql/supabase-schema.sql`
3. Seed a manual test license if needed
4. Keep `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` available for future API deployment

## Paddle
1. Create product and price
2. Configure client-side token
3. Set default payment link to the production website
4. Wait for verification approval before enabling live selling

## Frontend
1. Keep `paddle-config.js` aligned with production Paddle IDs
2. Ensure CTA flows point to `https://playmysubs.com`
3. Keep pricing/legal/support pages live and up to date

## API Readiness
If license verify and webhook routes are deployed later, expose:
- `/api/license/verify`
- `/api/webhooks/paddle`

Those routes must be implemented in a Cloudflare-compatible runtime or external API host.

## Pre-Launch
1. Run a real checkout after approval
2. Confirm transaction fulfillment
3. Confirm license activation inside the extension
4. Finalize Chrome Web Store submission assets and listing
