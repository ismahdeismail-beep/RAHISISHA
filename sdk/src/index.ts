export interface RahisishaConfig { apiKey: string; environment: 'sandbox' | 'production'; timeout?: number; }

export class Rahisisha {
  private apiKey: string; private baseUrl: string; private timeout: number;
  constructor(config: RahisishaConfig) {
    this.apiKey = config.apiKey;
    this.baseUrl = config.environment === 'production' ? 'https://api.rahisisha.com/v1' : 'https://sandbox-api.rahisisha.com/v1';
    this.timeout = config.timeout || 30000;
  }
  private async request(endpoint: string, options: RequestInit = {}): Promise<any> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, { ...options, headers: { 'Authorization': `Bearer ${this.apiKey}`, 'Content-Type': 'application/json', ...options.headers } });
    if (!response.ok) { const error = await response.json(); throw new RahisishaError(error.message, response.status, error.code); }
    return response.json();
  }
  async createPayment(data: any): Promise<any> { return this.request('/payments', { method: 'POST', body: JSON.stringify(data) }); }
  async initiateStkPush(data: any): Promise<any> { return this.request('/payments/mpesa/stk-push', { method: 'POST', body: JSON.stringify(data) }); }
  async sendB2C(data: any): Promise<any> { return this.request('/payments/mpesa/b2c', { method: 'POST', body: JSON.stringify(data) }); }
  async getPayment(transactionId: string): Promise<any> { return this.request(`/payments/${transactionId}`); }
  async refundPayment(transactionId: string, amount?: number): Promise<any> { return this.request(`/payments/${transactionId}/refund`, { method: 'POST', body: JSON.stringify({ amount }) }); }
  async getWalletBalance(): Promise<any> { return this.request('/wallet/balance'); }
  async fundWallet(data: any): Promise<any> { return this.request('/wallet/fund', { method: 'POST', body: JSON.stringify(data) }); }
  async transferToWallet(data: any): Promise<any> { return this.request('/wallet/transfer', { method: 'POST', body: JSON.stringify(data) }); }
  async createEscrow(data: any): Promise<any> { return this.request('/escrow', { method: 'POST', body: JSON.stringify(data) }); }
  async fundEscrow(escrowId: string, data: any): Promise<any> { return this.request(`/escrow/${escrowId}/fund`, { method: 'POST', body: JSON.stringify(data) }); }
  async releaseEscrow(escrowId: string, milestoneIndex?: number): Promise<any> { return this.request(`/escrow/${escrowId}/release`, { method: 'POST', body: JSON.stringify({ milestoneIndex }) }); }
  async createSubscriptionPlan(data: any): Promise<any> { return this.request('/subscriptions/plans', { method: 'POST', body: JSON.stringify(data) }); }
  async subscribe(data: any): Promise<any> { return this.request('/subscriptions', { method: 'POST', body: JSON.stringify(data) }); }
  async cancelSubscription(subscriptionId: string): Promise<any> { return this.request(`/subscriptions/${subscriptionId}`, { method: 'DELETE' }); }
}

export class RahisishaError extends Error {
  constructor(message: string, public statusCode: number, public code: string) {
    super(message); this.name = 'RahisishaError';
  }
}