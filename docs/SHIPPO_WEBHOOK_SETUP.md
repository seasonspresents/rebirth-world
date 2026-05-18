# Shippo Tracking Webhook Setup

## Endpoint

Register the tracking webhook in Shippo for `track_updated` events:

```text
https://rebirth.world/api/webhooks/shippo?token=$SHIPPO_WEBHOOK_SECRET
```

Use the query-token URL unless the Shippo dashboard supports custom request
headers for the webhook. The route also accepts:

```text
Authorization: Bearer $SHIPPO_WEBHOOK_SECRET
```

## Required Environment

Set the same secret anywhere the webhook can run:

- Local development: `.env.local`
- Vercel Preview: `SHIPPO_WEBHOOK_SECRET`
- Vercel Production: `SHIPPO_WEBHOOK_SECRET`

The server also needs the existing Supabase service credentials:

- `NEXT_PUBLIC_SUPABASE_URL`
- `SUPABASE_SECRET_KEY`

Never commit secret values.

## Registration

Register or refresh the active Shippo webhook through the API:

```bash
pnpm exec tsx scripts/register-shippo-webhook.ts
```

The script creates or updates the `track_updated` webhook for
`/api/webhooks/shippo`, marks it active, and redacts the token in console output.
It sets `is_test` automatically when the configured `SHIPPO_API_KEY` is a test
token.

## Local Verification

Start the app, then run the webhook suite against the active local port:

```bash
SHIPPO_WEBHOOK_TEST_BASE_URL=http://localhost:3000/api/webhooks/shippo pnpm exec tsx scripts/test-shippo-webhook.ts
```

If another local server is already using port `3000`, point the test at that
server instead:

```bash
SHIPPO_WEBHOOK_TEST_BASE_URL=http://localhost:3011/api/webhooks/shippo pnpm exec tsx scripts/test-shippo-webhook.ts
```

The test suite covers:

- Missing, invalid query-token, and invalid bearer-token rejection.
- Valid query-token and bearer-token acceptance.
- Unknown event acknowledgement.
- Missing tracking data rejection.
- PRE_TRANSIT, TRANSIT, DELIVERED, FAILURE, and RETURNED webhook acceptance.
- Local transition logic, including delivered downgrade protection and returned
  status escalation.

## Production Dashboard Verification

After saving the webhook in Shippo:

1. Confirm the registered event is `track_updated`.
2. Confirm the URL includes the production `SHIPPO_WEBHOOK_SECRET` token.
3. Send a Shippo test event and confirm the endpoint returns HTTP `200`.
4. For a real tracking number on an order, confirm `TRANSIT` updates the order
   to `shipped`.
5. Confirm `DELIVERED` sets `orders.status = delivered` and `delivered_at`.
6. Re-send or simulate a lower-priority status after delivery and confirm the
   order is not downgraded.
7. Attach the Shippo dashboard confirmation or screenshot to the Linear issue.
