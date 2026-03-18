# PlayMySubs Website

This repository contains the public PlayMySubs marketing site and the first backend skeleton for Premium license verification.

## Current Scope

- static marketing pages for `playmysubs.com`
- pricing, privacy, terms, refund, support, and about pages
- checkout drawer placeholder for the future Paddle flow
- backend skeleton under `backend/` for license verification and webhook fulfillment
- Netlify deployment skeleton for `/api/*` routes under `netlify/functions/`

## Important Notes

- the live checkout link is still not wired
- the backend skeleton is local-first and file-backed for development only
- the chosen production direction is Netlify Functions + Supabase REST
- production still needs real Paddle webhook verification and real checkout wiring

## Local checks

```bash
node backend/scripts/smoke.js
```
