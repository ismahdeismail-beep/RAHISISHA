export const mpesaConfig = {
  sandbox: {
    authUrl: 'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials',
    stkPushUrl: 'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest',
    c2bUrl: 'https://sandbox.safaricom.co.ke/mpesa/c2b/v1/registerurl',
    b2cUrl: 'https://sandbox.safaricom.co.ke/mpesa/b2c/v1/paymentrequest',
    transactionStatusUrl: 'https://sandbox.safaricom.co.ke/mpesa/transactionstatus/v1/query',
    accountBalanceUrl: 'https://sandbox.safaricom.co.ke/mpesa/accountbalance/v1/query',
    reversalUrl: 'https://sandbox.safaricom.co.ke/mpesa/reversal/v1/request',
  },
  production: {
    authUrl: 'https://api.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials',
    stkPushUrl: 'https://api.safaricom.co.ke/mpesa/stkpush/v1/processrequest',
    c2bUrl: 'https://api.safaricom.co.ke/mpesa/c2b/v1/registerurl',
    b2cUrl: 'https://api.safaricom.co.ke/mpesa/b2c/v1/paymentrequest',
    transactionStatusUrl: 'https://api.safaricom.co.ke/mpesa/transactionstatus/v1/query',
    accountBalanceUrl: 'https://api.safaricom.co.ke/mpesa/accountbalance/v1/query',
    reversalUrl: 'https://api.safaricom.co.ke/mpesa/reversal/v1/request',
  },
  credentials: {
    consumerKey: process.env.MPESA_CONSUMER_KEY || '',
    consumerSecret: process.env.MPESA_CONSUMER_SECRET || '',
    shortCode: process.env.MPESA_SHORT_CODE || '174379',
    passKey: process.env.MPESA_PASS_KEY || '',
    initiatorName: process.env.MPESA_INITIATOR_NAME || '',
    initiatorPassword: process.env.MPESA_INITIATOR_PASSWORD || '',
    securityCredential: process.env.MPESA_SECURITY_CREDENTIAL || '',
  },
  callbacks: {
    stkCallback: `${process.env.BASE_URL || 'http://localhost:3000'}/webhooks/mpesa/stk`,
    c2bValidation: `${process.env.BASE_URL || 'http://localhost:3000'}/webhooks/mpesa/validation`,
    c2bConfirmation: `${process.env.BASE_URL || 'http://localhost:3000'}/webhooks/mpesa/confirmation`,
    b2cResult: `${process.env.BASE_URL || 'http://localhost:3000'}/webhooks/mpesa/b2c-result`,
    b2cTimeout: `${process.env.BASE_URL || 'http://localhost:3000'}/webhooks/mpesa/b2c-timeout`,
  }
};
export function validateMpesaConfig(): void {
  const required = ['MPESA_CONSUMER_KEY', 'MPESA_CONSUMER_SECRET', 'MPESA_SHORT_CODE', 'MPESA_PASS_KEY'];
  const missing = required.filter(key => !process.env[key]);
  if (missing.length > 0) throw new Error(`Missing M-Pesa configuration: ${missing.join(', ')}`);
}