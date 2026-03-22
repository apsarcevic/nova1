# PlayMySubs Website

Marketing and checkout website for PlayMySubs.

## Current Hosting
- Production: `https://playmysubs.com`
- Preview: `https://nova1-325.pages.dev`
- Hosting: `Cloudflare Pages`
- DNS: `Cloudflare`

## Scope
This repo contains the static website used for:
- landing page
- pricing page
- legal pages
- support page
- Paddle checkout entry points

The site must stay compatible with Cloudflare Pages static hosting.

## Deployment Rules
- Do not reintroduce deprecated platform-specific hosting configs.
- Do not add deprecated hosting config files.
- Do not add deprecated provider-specific function wrappers.
- Prefer static output for the MVP website.
- Keep all production URLs aligned to `https://playmysubs.com`.

## Checkout
Frontend checkout is initialized from `paddle-config.js` and opened from the website UI.

## Backend Notes
The local `backend/` folder remains as an implementation reference for license verification and webhook handling. It is not a Node server deployment target for the current static Cloudflare Pages setup.

If same-domain API routes are needed later, they should be implemented using Cloudflare-compatible runtime primitives, or by pointing the frontend to an external hosted API.
