# PlayMySubs Website

This repository contains the public PlayMySubs website and the local backend reference for Premium license verification.

## Current Scope

- static marketing pages for `playmysubs.com`
- pricing, privacy, terms, refund, support, and about pages
- Paddle checkout drawer on the website
- local backend reference under `backend/` for license verification and webhook fulfillment
- Cloudflare Pages as the hosting target for the site

## Hosting

Current production setup:

- production: `https://playmysubs.com`
- preview: `https://nova1-325.pages.dev`
- hosting: Cloudflare Pages
- DNS: Cloudflare

## Important Notes

- Netlify is deprecated for this project and should not be used again
- do not add `netlify.toml` or Netlify-specific wrappers back into this repo
- keep the website compatible with Cloudflare Pages static hosting
- if same-domain API routes are needed later, use Cloudflare-compatible edge/serverless routing
- `paddle-config.js` contains the current frontend checkout configuration

## Local checks

```bash
node backend/scripts/smoke.js
```
