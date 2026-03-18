# PlayMySubs Website

This repository contains the public PlayMySubs marketing site and the first backend skeleton for Premium license verification.

## Current Scope

- static marketing pages for `playmysubs.com`
- pricing, privacy, terms, refund, support, and about pages
- checkout drawer placeholder for the future Paddle flow
- backend skeleton under `backend/` for license verification and webhook fulfillment

## Important Notes

- the live checkout link is still not wired
- the backend skeleton is local-first and file-backed for development only
- production deployment should replace the file store with a real database-backed adapter

## Local checks

```bash
node backend/scripts/smoke.js
```
