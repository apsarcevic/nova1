# Deployment Plan

## Current Decision
PlayMySubs runs as a Cloudflare Pages project.

Chosen stack:
- Static site hosting: `Cloudflare Pages`
- DNS: `Cloudflare`
- Persistent data: `Supabase`
- Payments: `Paddle`

## Website
- Production URL: `https://playmysubs.com`
- Preview URL: `https://nova1-325.pages.dev`

## Static Hosting Constraints
For the MVP website:
- keep the website statically deployable
- avoid Node server assumptions in the frontend
- avoid deprecated provider-specific files and runtime wrappers

## API Strategy
The website already has a local backend reference implementation for:
- `/api/license/verify`
- `/api/webhooks/paddle`

Those routes are provider-agnostic and must remain Cloudflare-compatible.

When live same-domain API routes are needed, use one of these approaches:
1. Cloudflare-compatible worker/function routes under the Pages deployment
2. Separate hosted API endpoint, with the website pointing to it explicitly

## Storage
Supabase remains the source of truth for:
- license keys
- transaction linkage
- customer email mapping
- fulfillment state

## Immediate Goal
Be ready so that once Paddle verification finishes, the only remaining work is:
1. enable production checkout
2. run a real purchase test
3. verify webhook fulfillment end-to-end
4. publish the extension on Chrome Web Store
