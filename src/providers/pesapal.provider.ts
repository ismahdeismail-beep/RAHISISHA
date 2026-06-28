import axios from 'axios';
import { pesapalConfig } from '../config/pesapal.config';
import { TransactionRequest, TransactionResult, PaymentProviderError } from '../types';
import { logger } from '../utils/logger';

export class PesapalProvider {
  private accessToken: string | null = null;
  private tokenExpiry: Date | null = null;

  private async getAccessToken(): Promise<string> {
    if (this.accessToken && this.tokenExpiry && new Date() < this.tokenExpiry) return this.accessToken;
    const isProduction = process.env.NODE_ENV === 'production';
    const url = isProduction ? pesapalConfig.production.authUrl : pesapalConfig.sandbox.authUrl;
    try {
      const response = await axios.post(url, { consumer_key: pesapalConfig.credentials.consumerKey, consumer_secret: pesapalConfig.credentials.consumerSecret }, { headers: { 'Content-Type': 'application/json' }, timeout: 10000 });
      this.accessToken = response.data.token;
      this.tokenExpiry = new Date(response.data.expiryDate);
      logger.info('PesaPal access token refreshed');
      return this.accessToken;
    } catch (error: any) { logger.error('PesaPal auth failed:', error.response?.data || error.message); throw new PaymentProviderError('PesaPal authentication failed', error, 401); }
  }

  async submitOrder(request: TransactionRequest): Promise<TransactionResult> {
    try {
      const token = await this.getAccessToken();
      const isProduction = process.env.NODE_ENV === 'production';
      const url = isProduction ? pesapalConfig.production.submitOrderUrl : pesapalConfig.sandbox.submitOrderUrl;
      const payload = {
        id: request.orderId, currency: request.currency || 'KES', amount: request.amount,
        description: request.description || 'Payment', callback_url: pesapalConfig.callbackUrl,
        redirect_mode: 'TOP_WINDOW', notification_id: pesapalConfig.ipnId,
        billing_address: {
          email_address: request.customerEmail, phone_number: request.phoneNumber,
          country_code: request.countryCode || 'KE', first_name: request.customerFirstName || 'Customer',
          middle_name: '', last_name: request.customerLastName || '',
          line_1: request.billingAddress?.street || '', line_2: '',
          city: request.billingAddress?.city || '', state: request.billingAddress?.state || '',
          postal_code: request.billingAddress?.postalCode || '', zip_code: request.billingAddress?.postalCode || '',
        },
      };
      logger.info(`Submitting PesaPal order: ${request.orderId}`);
      const response = await axios.post(url, payload, { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json', 'Accept': 'application/json' }, timeout: 30000 });
      return { success: response.data.status === '200', transactionId: response.data.order_tracking_id, providerRef: response.data.merchant_reference, status: 'pending', amount: request.amount, currency: request.currency || 'KES', provider: 'pesapal', paymentMethod: 'card_or_mobile', createdAt: new Date(), metadata: { redirectUrl: response.data.redirect_url, orderTrackingId: response.data.order_tracking_id, merchantReference: response.data.merchant_reference } };
    } catch (error: any) { logger.error('PesaPal order submission error:', error.response?.data || error.message); throw new PaymentProviderError('PesaPal order submission failed', error, 500); }
  }

  async getTransactionStatus(orderTrackingId: string): Promise<TransactionResult> {
    try {
      const token = await this.getAccessToken();
      const isProduction = process.env.NODE_ENV === 'production';
      const url = isProduction ? `${pesapalConfig.production.transactionStatusUrl}?orderTrackingId=${orderTrackingId}` : `${pesapalConfig.sandbox.transactionStatusUrl}?orderTrackingId=${orderTrackingId}`;
      const response = await axios.get(url, { headers: { Authorization: `Bearer ${token}` }, timeout: 10000 });
      const statusMap: { [key: string]: string } = { 'PENDING': 'pending', 'COMPLETED': 'completed', 'FAILED': 'failed', 'INVALID': 'failed', 'REVERSED': 'refunded' };
      return { success: response.data.payment_status_description === 'COMPLETED', transactionId: orderTrackingId, status: statusMap[response.data.payment_status_description] || 'unknown', provider: 'pesapal', amount: response.data.amount, currency: response.data.currency, metadata: { paymentMethod: response.data.payment_method, confirmationCode: response.data.confirmation_code, paymentStatusDescription: response.data.payment_status_description, description: response.data.description, message: response.data.message, paymentAccount: response.data.payment_account, paymentStatusCode: response.data.payment_status_code } };
    } catch (error: any) { logger.error('PesaPal status check error:', error.response?.data || error.message); throw new PaymentProviderError('PesaPal status check failed', error, 500); }
  }

  async requestRefund(orderTrackingId: string, amount: number, reason: string): Promise<TransactionResult> {
    try {
      const token = await this.getAccessToken();
      const isProduction = process.env.NODE_ENV === 'production';
      const url = isProduction ? pesapalConfig.production.refundUrl : pesapalConfig.sandbox.refundUrl;
      const payload = { confirmation_code: orderTrackingId, amount: amount, username: process.env.PESAPAL_USERNAME!, remarks: reason };
      const response = await axios.post(url, payload, { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }, timeout: 30000 });
      return { success: response.data.status === '200', transactionId: response.data.refund_id, status: 'pending', provider: 'pesapal', metadata: { refundId: response.data.refund_id, status: response.data.status, message: response.data.message } };
    } catch (error: any) { logger.error('PesaPal refund error:', error.response?.data || error.message); throw new PaymentProviderError('PesaPal refund request failed', error, 500); }
  }
}