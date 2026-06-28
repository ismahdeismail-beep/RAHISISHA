import braintree from 'braintree';
export const braintreeConfig = {
  environment: process.env.BRAINTREE_ENV === 'production' ? braintree.Environment.Production : braintree.Environment.Sandbox,
  merchantId: process.env.BRAINTREE_MERCHANT_ID || '',
  publicKey: process.env.BRAINTREE_PUBLIC_KEY || '',
  privateKey: process.env.BRAINTREE_PRIVATE_KEY || '',
};
export const braintreeGateway = new braintree.BraintreeGateway(braintreeConfig);
export function validateBraintreeConfig(): void {
  const required = ['BRAINTREE_MERCHANT_ID', 'BRAINTREE_PUBLIC_KEY', 'BRAINTREE_PRIVATE_KEY'];
  const missing = required.filter(key => !process.env[key]);
  if (missing.length > 0) throw new Error(`Missing Braintree configuration: ${missing.join(', ')}`);
}