# RAHISISHA API Documentation

## Authentication

All API requests require an `Authorization` header with a Bearer token:

```
Authorization: Bearer <your_api_key>
```

## Endpoints

### Payments

#### Create Payment
```http
POST /v1/payments
Content-Type: application/json

{
  "provider": "mpesa",
  "paymentMethod": "stk_push",
  "amount": 1000,
  "currency": "KES",
  "orderId": "ORDER-001",
  "phoneNumber": "+254712345678",
  "description": "Payment for Order #001"
}
```

#### Get Payment Status
```http
GET /v1/payments/:id/status
```

#### Process Refund
```http
POST /v1/payments/:id/refund
Content-Type: application/json

{
  "amount": 500,
  "reason": "Customer request"
}
```

### Wallet

#### Get Balance
```http
GET /v1/wallet/balance
```

#### Fund Wallet
```http
POST /v1/wallet/fund
Content-Type: application/json

{
  "amount": 5000,
  "currency": "KES",
  "paymentMethod": "mpesa",
  "phoneNumber": "+254712345678"
}
```

#### Transfer
```http
POST /v1/wallet/transfer
Content-Type: application/json

{
  "toUserId": "user_123",
  "amount": 2500,
  "reference": "Split bill payment"
}
```

### Escrow

#### Create Escrow
```http
POST /v1/escrow
Content-Type: application/json

{
  "sellerId": "freelancer_001",
  "amount": 50000,
  "description": "Website development",
  "milestones": [
    { "description": "Design", "amount": 15000 },
    { "description": "Development", "amount": 25000 },
    { "description": "Deployment", "amount": 10000 }
  ]
}
```

### Subscriptions

#### Create Plan
```http
POST /v1/subscriptions/plans
Content-Type: application/json

{
  "name": "Premium",
  "amount": 1999,
  "interval": "monthly",
  "intervalCount": 1
}
```

## Webhooks

Configure webhook endpoints to receive real-time payment notifications.

### Events
- `payment.completed`
- `payment.failed`
- `escrow.funded`
- `escrow.released`
- `subscription.charged`
- `wallet.credited`

## Error Codes

| Code | Description |
|------|-------------|
| RAH_001 | Insufficient wallet balance |
| RAH_002 | M-Pesa STK push failed |
| RAH_003 | Braintree card declined |
| RAH_004 | Invalid API key |
| RAH_005 | Rate limit exceeded |
