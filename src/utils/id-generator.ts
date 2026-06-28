import { v4 as uuidv4 } from 'uuid';
export function generateTransactionId(prefix: string = 'TXN'): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${prefix}-${timestamp}-${random}`;
}
export function generateOrderId(): string { return `ORD-${Date.now()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`; }
export function generateEscrowId(): string { return `ESC-${Date.now()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`; }
export function generateSubscriptionId(): string { return `SUB-${Date.now()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`; }
export function generatePlanId(): string { return `PLAN-${Date.now()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`; }
export function generateUUID(): string { return uuidv4(); }
export function generateApiKey(): string {
  const prefix = 'rahisisha'; const env = process.env.NODE_ENV === 'production' ? 'live' : 'test';
  const random = Buffer.from(Math.random().toString()).toString('base64').substring(0, 32);
  return `${prefix}_${env}_${random}`;
}
export function generateWebhookSecret(): string { return `whsec_${Buffer.from(Math.random().toString()).toString('base64').substring(0, 48)}`; }