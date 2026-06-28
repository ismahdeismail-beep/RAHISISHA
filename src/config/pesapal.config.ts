export const pesapalConfig = {
  sandbox: {
    authUrl: 'https://cybqa.pesapal.com/pesapalv3/api/Auth/RequestToken',
    submitOrderUrl: 'https://cybqa.pesapal.com/pesapalv3/api/Transactions/SubmitOrderRequest',
    transactionStatusUrl: 'https://cybqa.pesapal.com/pesapalv3/api/Transactions/GetTransactionStatus',
    refundUrl: 'https://cybqa.pesapal.com/pesapalv3/api/Transactions/RefundRequest',
  },
  production: {
    authUrl: 'https://pay.pesapal.com/v3/api/Auth/RequestToken',
    submitOrderUrl: 'https://pay.pesapal.com/v3/api/Transactions/SubmitOrderRequest',
    transactionStatusUrl: 'https://pay.pesapal.com/v3/api/Transactions/GetTransactionStatus',
    refundUrl: 'https://pay.pesapal.com/v3/api/Transactions/RefundRequest',
  },
  credentials: {
    consumerKey: process.env.PESAPAL_CONSUMER_KEY || '',
    consumerSecret: process.env.PESAPAL_CONSUMER_SECRET || '',
  },
  callbackUrl: `${process.env.BASE_URL || 'http://localhost:3000'}/webhooks/pesapal/callback`,
  ipnId: process.env.PESAPAL_IPN_ID || '',
};
export function validatePesapalConfig(): void {
  const required = ['PESAPAL_CONSUMER_KEY', 'PESAPAL_CONSUMER_SECRET'];
  const missing = required.filter(key => !process.env[key]);
  if (missing.length > 0) throw new Error(`Missing PesaPal configuration: ${missing.join(', ')}`);
}