// Mock data used as fallback when the API is unavailable

let txCounter = 8832;
const now = () => new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

export const mockProfile = {
  profile: {
    firstName: 'Jane', lastName: 'Mwangi',
    businessName: 'Mwangi Enterprises Ltd',
    email: 'jane.mwangi@rahisisha.co',
    phone: '+254 712 345 678',
    verified: true,
    role: 'merchant',
  }
};

export const mockBalance = {
  balance: 284750,
  currency: 'USD',
};

export const mockTransactions = [
  { id: `#TXN-${txCounter--}`, counterparty: 'Aroma Coffee Supplies',   amount: '+$342.00',  type: 'in',  provider: 'M-Pesa',   status: 'completed', date: `${new Date().toLocaleDateString('en-US', {month:'short',day:'2-digit'})}, ${now()}`, method: 'Paybill' },
  { id: `#TXN-${txCounter--}`, counterparty: 'Safari Mart Wholesale',    amount: '+$1,280',   type: 'in',  provider: 'M-Pesa',   status: 'completed', date: `${new Date().toLocaleDateString('en-US', {month:'short',day:'2-digit'})}, ${now()}`, method: 'Send Money' },
  { id: `#TXN-${txCounter--}`, counterparty: 'Nile Tech Distributors',   amount: '-$4,592',   type: 'out', provider: 'Braintree',status: 'completed', date: `${new Date().toLocaleDateString('en-US', {month:'short',day:'2-digit'})}, ${now()}`, method: 'Card' },
  { id: `#TXN-${txCounter--}`, counterparty: 'Savannah Boutique',        amount: '+$215.50',  type: 'in',  provider: 'PesaPal',  status: 'pending',   date: `${new Date().toLocaleDateString('en-US', {month:'short',day:'2-digit'})}, ${now()}`, method: 'Mobile' },
  { id: `#TXN-${txCounter--}`, counterparty: 'Serengeti Safari Lodge',   amount: '+$8,200',   type: 'in',  provider: 'M-Pesa',   status: 'completed', date: `${new Date().toLocaleDateString('en-US', {month:'short',day:'2-digit'})}, ${now()}`, method: 'Paybill' },
  { id: `#TXN-${txCounter--}`, counterparty: 'Pwani Fresh Produce',      amount: '-$560.00',  type: 'out', provider: 'Braintree',status: 'failed',    date: `${new Date().toLocaleDateString('en-US', {month:'short',day:'2-digit'})}, ${now()}`, method: 'Card' },
  { id: `#TXN-${txCounter--}`, counterparty: 'Equity Bank Kenya',        amount: '+$12,500',  type: 'in',  provider: 'M-Pesa',   status: 'completed', date: `${new Date().toLocaleDateString('en-US', {month:'short',day:'2-digit'})}, ${now()}`, method: 'Send Money' },
  { id: `#TXN-${txCounter--}`, counterparty: 'Jambo Jet Airways',        amount: '-$3,450',   type: 'out', provider: 'PesaPal',  status: 'completed', date: `${new Date().toLocaleDateString('en-US', {month:'short',day:'2-digit'})}, ${now()}`, method: 'Mobile' },
];

export const mockPaymentLinks = [
  { id: '#PL-001', description: 'Website Development — Invoice #042',   amount: '$4,200.00', status: 'active',   created: 'Jun 26, 2026', payments: 1,  url: 'https://rahisisha.co/pay/pl_aB3xK9' },
  { id: '#PL-002', description: 'Consulting Retainer — June',           amount: '$2,500.00', status: 'active',   created: 'Jun 20, 2026', payments: 3,  url: 'https://rahisisha.co/pay/pl_mN7qR2' },
  { id: '#PL-003', description: 'Product Order — Aroma Coffee',        amount: '$890.00',   status: 'active',   created: 'Jun 14, 2026', payments: 1,  url: 'https://rahisisha.co/pay/pl_pW5sH8' },
  { id: '#PL-004', description: 'Donation — Kenya Wildlife Fund',      amount: 'Any',       status: 'active',   created: 'Jun 01, 2026', payments: 24, url: 'https://rahisisha.co/pay/pl_dF1jL4' },
  { id: '#PL-005', description: 'Photography — Natalie W.',             amount: '$1,500.00', status: 'inactive', created: 'May 28, 2026', payments: 0,  url: 'https://rahisisha.co/pay/pl_xG9vM6' },
  { id: '#PL-006', description: 'Q3 Subscription — Premium Plan',       amount: '$299/mo',   status: 'active',   created: 'May 15, 2026', payments: 6,  url: 'https://rahisisha.co/pay/pl_zC2bN7' },
];