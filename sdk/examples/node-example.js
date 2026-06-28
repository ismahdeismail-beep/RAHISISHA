const { Rahisisha } = require('@rahisisha/sdk');

const rahisisha = new Rahisisha({
  apiKey: 'rahisisha_test_...',
  environment: 'sandbox'
});

async function examples() {
  // 1. M-Pesa STK Push
  const stk = await rahisisha.initiateStkPush({
    phone: '+254712345678',
    amount: 1000,
    accountReference: 'ORDER-001',
    orderId: 'ORDER-001'
  });
  console.log('STK Push:', stk);

  // 2. Card Payment
  const card = await rahisisha.createPayment({
    provider: 'braintree',
    paymentMethod: 'card',
    amount: 5000,
    currency: 'USD',
    orderId: 'ORDER-002',
    paymentNonce: 'nonce-from-client',
    customerEmail: 'customer@example.com'
  });
  console.log('Card Payment:', card);

  // 3. Wallet Transfer
  const transfer = await rahisisha.transferToWallet({
    toUserId: 'user_123',
    amount: 2500,
    reference: 'Split bill'
  });
  console.log('Transfer:', transfer);

  // 4. Create Escrow
  const escrow = await rahisisha.createEscrow({
    sellerId: 'freelancer_001',
    amount: 50000,
    description: 'Website development',
    milestones: [
      { description: 'Design', amount: 15000 },
      { description: 'Development', amount: 25000 },
      { description: 'Deployment', amount: 10000 }
    ]
  });
  console.log('Escrow:', escrow);
}

examples().catch(console.error);
