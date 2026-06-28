# RAHISISHA - Unified Payment Platform

**RAHISISHA** (Swahili for "Make it Easy") is a comprehensive payment orchestration platform for Africa, combining Braintree (global cards/PayPal), M-Pesa (mobile money), PesaPal, and Kenyan bank integrations.

## Features

- **M-Pesa Integration**: STK Push, C2B, B2C via Safaricom Daraja API
- **Braintree**: Visa, Mastercard, Amex, PayPal, Apple Pay, Google Pay
- **PesaPal**: Alternative card and mobile payments
- **Bank Transfers**: RTGS, EFT, SWIFT via KCB, Equity, Co-op Bank
- **Internal Wallets**: P2P transfers, balance management
- **Escrow Service**: Milestone-based payments with dispute resolution
- **Subscriptions**: Recurring billing with M-Pesa standing orders
- **Real-time Analytics**: Dashboard, reports, anomaly detection

## Quick Start

```bash
# Clone and install
git clone https://github.com/rahisisha/platform.git
cd rahisisha-platform
npm install

# Configure environment
cp .env.example .env
# Edit .env with your API keys

# Run development server
npm run dev

# Or run with Docker
docker-compose up -d
```

## SDK Usage

```javascript
import { Rahisisha } from '@rahisisha/sdk';

const rahisisha = new Rahisisha({
  apiKey: 'your_api_key',
  environment: 'production'
});

// M-Pesa STK Push
const payment = await rahisisha.initiateStkPush({
  phone: '+254712345678',
  amount: 1000,
  accountReference: 'ORDER-001',
  orderId: 'ORDER-001'
});
```

## API Documentation

Visit `/docs` or [docs.rahisisha.com](https://docs.rahisisha.com)

## License

MIT
