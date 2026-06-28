import braintree from 'braintree';
import { braintreeGateway } from '../config/braintree.config';
import { TransactionRequest, TransactionResult, PaymentProviderError } from '../types';
import { logger } from '../utils/logger';

export class BraintreeProvider {
  async processCardPayment(request: TransactionRequest): Promise<TransactionResult> {
    try {
      logger.info(`Processing Braintree card payment for order: ${request.orderId}`);
      const saleResult = await braintreeGateway.transaction.sale({
        amount: request.amount.toString(), paymentMethodNonce: request.paymentNonce,
        options: { submitForSettlement: true, storeInVaultOnSuccess: request.saveCard || false },
        customer: request.customerId ? { id: request.customerId } : undefined,
        billing: request.billingAddress ? {
          streetAddress: request.billingAddress.street, locality: request.billingAddress.city,
          region: request.billingAddress.state, postalCode: request.billingAddress.postalCode,
          countryCodeAlpha2: request.billingAddress.country,
        } : undefined,
        customFields: { order_id: request.orderId, description: request.description || 'RAHISISHA Payment' },
      });
      if (saleResult.success) {
        logger.info(`Braintree payment successful: ${saleResult.transaction.id}`);
        return {
          success: true, transactionId: saleResult.transaction.id, providerRef: saleResult.transaction.id,
          status: 'completed', amount: parseFloat(saleResult.transaction.amount),
          currency: saleResult.transaction.currencyIsoCode, provider: 'braintree',
          paymentMethod: saleResult.transaction.creditCard?.cardType || 'card', createdAt: new Date(),
          metadata: {
            processorResponseCode: saleResult.transaction.processorResponseCode,
            processorResponseText: saleResult.transaction.processorResponseText,
            cvvResponseCode: saleResult.transaction.cvvResponseCode,
            cardType: saleResult.transaction.creditCard?.cardType, last4: saleResult.transaction.creditCard?.last4,
          }
        };
      } else {
        logger.warn(`Braintree payment failed: ${saleResult.message}`);
        return { success: false, transactionId: null, providerRef: null, status: 'failed', amount: request.amount, currency: request.currency || 'USD', provider: 'braintree', errorCode: saleResult.transaction?.processorResponseCode || 'UNKNOWN', errorMessage: saleResult.message || 'Payment failed', createdAt: new Date() };
      }
    } catch (error: any) { logger.error('Braintree card payment error:', error); throw new PaymentProviderError('Braintree payment failed', error, 500, error.code); }
  }

  async createSubscription(planId: string, paymentMethodToken: string, customerData: any): Promise<TransactionResult> {
    try {
      logger.info(`Creating Braintree subscription for plan: ${planId}`);
      let customerId = customerData.id;
      if (!customerId) {
        const customerResult = await braintreeGateway.customer.create({
          firstName: customerData.firstName, lastName: customerData.lastName,
          email: customerData.email, phone: customerData.phone, paymentMethodNonce: paymentMethodToken,
        });
        if (!customerResult.success) throw new PaymentProviderError('Failed to create Braintree customer', customerResult, 400);
        customerId = customerResult.customer.id;
      }
      const subscriptionResult = await braintreeGateway.subscription.create({ paymentMethodToken, planId, price: customerData.amount?.toString(), options: { startImmediately: true } });
      if (!subscriptionResult.success) throw new PaymentProviderError('Failed to create subscription', subscriptionResult, 400);
      return { success: true, transactionId: subscriptionResult.subscription.id, providerRef: subscriptionResult.subscription.id, status: subscriptionResult.subscription.status === 'Active' ? 'active' : 'pending', provider: 'braintree', metadata: { nextBillingDate: subscriptionResult.subscription.nextBillingDate, customerId } };
    } catch (error: any) { logger.error('Braintree subscription creation error:', error); throw new PaymentProviderError('Subscription creation failed', error, 500, error.code); }
  }

  async cancelSubscription(subscriptionId: string): Promise<TransactionResult> {
    try { const result = await braintreeGateway.subscription.cancel(subscriptionId); if (!result.success) throw new PaymentProviderError('Failed to cancel subscription', result, 400); return { success: true, transactionId: subscriptionId, status: 'cancelled', provider: 'braintree', createdAt: new Date() }; }
    catch (error: any) { logger.error('Braintree subscription cancellation error:', error); throw new PaymentProviderError('Subscription cancellation failed', error, 500, error.code); }
  }

  async processRefund(transactionId: string, amount?: number): Promise<TransactionResult> {
    try {
      logger.info(`Processing Braintree refund for transaction: ${transactionId}, amount: ${amount}`);
      const refundResult = amount ? await braintreeGateway.transaction.refund(transactionId, amount.toString()) : await braintreeGateway.transaction.refund(transactionId);
      if (!refundResult.success) throw new PaymentProviderError('Refund failed', refundResult, 400);
      return { success: true, transactionId: refundResult.transaction.id, providerRef: refundResult.transaction.refundedTransactionId, status: 'refunded', amount: parseFloat(refundResult.transaction.amount), provider: 'braintree', createdAt: new Date(), metadata: { refundedTransactionId: refundResult.transaction.refundedTransactionId } };
    } catch (error: any) { logger.error('Braintree refund error:', error); throw new PaymentProviderError('Refund failed', error, 500, error.code); }
  }

  async generateClientToken(customerId?: string): Promise<string> {
    try { const options: any = {}; if (customerId) options.customerId = customerId; const response = await braintreeGateway.clientToken.generate(options); return response.clientToken; }
    catch (error: any) { logger.error('Braintree client token generation error:', error); throw new PaymentProviderError('Failed to generate client token', error, 500, error.code); }
  }

  async getTransaction(transactionId: string): Promise<any> {
    try { return await braintreeGateway.transaction.find(transactionId); }
    catch (error: any) { logger.error('Braintree get transaction error:', error); throw new PaymentProviderError('Transaction not found', error, 404, error.code); }
  }
}