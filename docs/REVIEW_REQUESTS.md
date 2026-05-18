# Review Requests

Review request emails are sent by the protected cron endpoint:

```text
GET /api/cron/review-requests
Authorization: Bearer $CRON_SECRET
```

The scheduled Vercel cron runs daily at 10:00 UTC. It selects delivered orders
with:

- `status = delivered`
- `user_id IS NOT NULL`
- `delivered_at <= now() - 7 days`
- `review_request_sent_at IS NULL`

The `delivered_at` timestamp is the tracking-backed signal. Shippo webhooks set
it when tracking reaches `DELIVERED`; admin status updates can also set it when
delivery is confirmed manually.

## Dry Run

Use dry run to inspect eligible orders and generated `/review` links without
sending email or stamping `review_request_sent_at`:

```text
GET /api/cron/review-requests?dry_run=true
Authorization: Bearer $CRON_SECRET
```

## Manual Fallback

If tracking data is unavailable but delivery is manually confirmed, send a
single order request with:

```text
GET /api/cron/review-requests?order_id=<order-id>&force=true
Authorization: Bearer $CRON_SECRET
```

Manual mode still requires the order to be `delivered`, attached to an
authenticated `user_id`, and not previously stamped with
`review_request_sent_at`. It skips items that already have reviews.

## Link Shape

Each email item links to:

```text
/review?order=<order-id>&item=<order-item-id>&orderItemId=<order-item-id>&productId=<stripe-product-id>&productName=<product-name>
```

The page uses the order item ID for client context. The API validates ownership
and verified purchase status server-side before creating a pending review.
