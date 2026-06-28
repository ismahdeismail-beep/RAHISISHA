export interface TransactionRequest {
  provider: 'braintree' | 'mpesa' | 'pesapal' | 'wallet' | 'bank';
  paymentMethod: 'card' | 'paypal' | 'apple_pay' | 'google_pay' | 'stk_push' | 'c2b' | 'b2c' | 'bank_transfer' | 'rtgs' | 'eft' | 'swift' | 'internal';
  amount: number; currency?: string; orderId: string; customerId?: string; phoneNumber?: string;
  customerEmail?: string; customerFirstName?: string; customerLastName?: string; paymentNonce?: string;
  accountReference?: string; description?: string;
  billingAddress?: { street?: string; city?: string; state?: string; postalCode?: string; country?: string };
  saveCard?: boolean; walletAmount?: number; countryCode?: string; bankCode?: string;
  sourceAccount?: string; destinationAccount?: string; destinationBankCode?: string;
  transferType?: 'rtgs' | 'eft' | 'swift'; metadata?: Record<string, any>;
}

export interface TransactionResult {
  success: boolean; transactionId: string | null; providerRef?: string | null;
  status: TransactionStatus; amount: number; currency?: string; provider: string;
  paymentMethod?: string; phoneNumber?: string; errorCode?: string; errorMessage?: string;
  newBalance?: number; metadata?: Record<string, any>; createdAt: Date;
  splitPayment?: { walletAmount: number; providerAmount: number; walletTransactionId: string };
  fromUserId?: string; toUserId?: string; debitTransactionId?: string; creditTransactionId?: string; escrowId?: string;
}

export type TransactionStatus = 'pending' | 'completed' | 'failed' | 'refunded' | 'cancelled' | 'held' | 'active' | 'voided' | 'awaiting_payment' | 'unknown' | 'processing' | 'settled' | 'declined' | 'disputed';

export interface PaymentMethod {
  id: string; type: 'card' | 'mobile_money' | 'bank_account' | 'paypal'; provider: string;
  last4?: string; brand?: string; expiryMonth?: string; expiryYear?: string;
  phoneNumber?: string; accountNumber?: string; bankCode?: string; isDefault: boolean;
}

export interface WalletTransaction {
  transactionId: string; type: 'credit' | 'debit' | 'hold' | 'release' | 'transfer';
  userId: string; amount: number; currency: string; balance: number; reference: string;
  status: TransactionStatus; metadata?: Record<string, any>; createdAt: Date;
}

export interface EscrowRequest {
  buyerId: string; sellerId: string; amount: number; currency?: string; description: string;
  milestones?: Array<{ description: string; amount: number; dueDate?: Date }>; inspectionPeriod?: number;
}

export interface SubscriptionPlan {
  planId: string; name: string; description: string; amount: number; currency: string;
  interval: 'daily' | 'weekly' | 'monthly' | 'yearly'; intervalCount: number;
  trialDays?: number; setupFee?: number; status: 'active' | 'inactive';
}

export interface Subscription {
  subscriptionId: string; customerId: string; planId: string; paymentMethod: 'card' | 'mpesa';
  providerSubscriptionId?: string; status: 'active' | 'cancelled' | 'past_due' | 'paused' | 'trialing';
  nextBillingDate: Date; lastPaymentDate?: Date; lastPaymentStatus?: 'success' | 'failed';
  failureCount: number; amount: number; currency: string; phoneNumber?: string;
  cardLast4?: string; cardBrand?: string; trialEnd?: Date; cancelledAt?: Date;
  cancelReason?: string; pauseCollection?: boolean; pauseCollectionResumesAt?: Date;
  metadata?: Record<string, any>; createdAt: Date; updatedAt: Date;
}

export interface WebhookEvent {
  id: string; type: string; provider: string; payload: Record<string, any>;
  receivedAt: Date; processedAt?: Date; status: 'pending' | 'processed' | 'failed'; retryCount: number;
}

export interface ApiResponse<T = any> {
  success: boolean; data?: T; error?: { code: string; message: string; details?: Record<string, any> };
  meta?: { page?: number; limit?: number; total?: number; timestamp: string; requestId: string };
}

export class PaymentProviderError extends Error {
  public readonly statusCode: number; public readonly providerCode?: string;
  constructor(message: string, public originalError: any, statusCode: number = 500, providerCode?: string) {
    super(message); this.name = 'PaymentProviderError'; this.statusCode = statusCode; this.providerCode = providerCode;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class ValidationError extends Error {
  public readonly statusCode: number = 400;
  constructor(message: string, public fields?: Record<string, string>) {
    super(message); this.name = 'ValidationError'; Error.captureStackTrace(this, this.constructor);
  }
}

export class NotFoundError extends Error {
  public readonly statusCode: number = 404;
  constructor(resource: string, identifier?: string) {
    super(`${resource}${identifier ? ` with id '${identifier}'` : ''} not found`);
    this.name = 'NotFoundError'; Error.captureStackTrace(this, this.constructor);
  }
}

export class UnauthorizedError extends Error {
  public readonly statusCode: number = 401;
  constructor(message: string = 'Unauthorized') {
    super(message); this.name = 'UnauthorizedError'; Error.captureStackTrace(this, this.constructor);
  }
}

export class ForbiddenError extends Error {
  public readonly statusCode: number = 403;
  constructor(message: string = 'Forbidden') {
    super(message); this.name = 'ForbiddenError'; Error.captureStackTrace(this, this.constructor);
  }
}