# RAHISISHA Webhooks

## Configuration

Register your webhook URL in the dashboard or via API:

```http
POST /v1/webhooks
{
  "url": "https://yourapp.com/webhooks/rahisisha",
  "events": ["payment.completed", "payment.failed"]
}
```

## Signature Verification

Verify webhook signatures to ensure authenticity:

```javascript
const crypto = require('crypto');

function verifyWebhook(payload, signature, secret) {
  const expected = crypto
    .createHmac('sha256', secret)
    .update(JSON.stringify(payload))
    .digest('hex');
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expected)
  );
}
```

## Event Payloads

### payment.completed
```json
{
  "event": "payment.completed",
  "data": {
    "transactionId": "TXN-...",
    "orderId": "ORDER-001",
    "amount": 1000,
    "currency": "KES",
    "provider": "mpesa",
    "status": "completed",
    "completedAt": "2024-01-15T10:30:00Z"
  }
}
```

### escrow.released
```json
{
  "event": "escrow.released",
  "data": {
    "escrowId": "ESC-...",
    "milestoneIndex": 0,
    "amount": 15000,
    "releasedTo": "seller_id",
    "releasedAt": "2024-01-15T10:30:00Z"
  }
}
```

## Retry Policy

Failed webhooks are retried with exponential backoff:
- 1st retry: 1 minute
- 2nd retry: 5 minutes
- 3rd retry: 15 minutes
- 4th retry: 1 hour
- 5th retry: 4 hours
