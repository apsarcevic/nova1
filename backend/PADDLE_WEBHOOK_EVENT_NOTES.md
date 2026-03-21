# Paddle Webhook Event Notes

This file documents the live event fields PlayMySubs expects for Premium license fulfillment.

## Event shape we depend on

Primary event:

- `transaction.completed`

Accepted as active fulfillment too:

- `transaction.paid`
- any transaction event where `data.status` is `completed`, `paid`, or `billed`

Primary transaction fields:

- `event_type`
- `data.id`
- `data.status`
- `data.customer_id`
- `data.custom_data`

Customer email fallback order:

1. `data.custom_data.customerEmail`
2. `data.billing_details.email`
3. `data.customer.email`

## Why custom data matters

PlayMySubs sends `customData` from Paddle.js checkout so the webhook can map a completed payment back to:

- `customerEmail`
- `plan`
- `product`
- `source`

Without `customData.customerEmail`, the webhook would have to rely only on billing details email.

## Current PlayMySubs assumption

For the one-time Premium checkout, a valid completion event should be enough to:

1. find or create a license record
2. store `providerTransactionId`
3. mark the license as `active`
4. let the extension verify the key through `/api/license/verify`

## Official Paddle references

- Custom data with checkout/transactions:
  - https://developer.paddle.com/build/transactions/custom-data
- Transactions overview and transaction entity fields:
  - https://developer.paddle.com/api-reference/transactions/overview
- Example transaction webhook field set:
  - https://developer.paddle.com/webhooks/transactions/transaction-created
  - https://developer.paddle.com/webhooks/transactions/transaction-billed

## Live launch check

Once Paddle production is approved, verify one real payment end-to-end:

1. checkout opens
2. payment completes
3. webhook arrives
4. license row is created or updated
5. extension verifies the issued key successfully
