# PlayMySubs Backend Notes

This folder contains provider-agnostic backend reference code for:
- license verification
- Paddle webhook handling
- local smoke testing
- Supabase-backed license storage

## Current Production Reality
The website is hosted on Cloudflare Pages as a static site.

That means this folder is currently used as:
- implementation reference
- local smoke-test harness
- migration base for future live API deployment

It is not currently deployed as a Node server behind the website.

## Production Direction
Chosen stack:
- Static site: `Cloudflare Pages`
- DNS: `Cloudflare`
- Storage: `Supabase`
- Payments: `Paddle`
- Future API runtime: Cloudflare-compatible function/worker layer or separate hosted API

## Files
- `src/handlers/verifyLicense.js`: license verification handler logic
- `src/handlers/paddleWebhook.js`: webhook fulfillment logic
- `src/lib/supabaseLicenseStore.js`: Supabase storage adapter
- `scripts/smoke.js`: local smoke test
- `PADDLE_WEBHOOK_EVENT_NOTES.md`: reference notes for Paddle events
- `SETUP_CHECKLIST.md`: Cloudflare + Supabase setup checklist
- `DEPLOYMENT_PLAN.md`: deployment architecture notes
