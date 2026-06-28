import { PaymentService } from '../../src/services/payment.service';
import { TransactionRequest } from '../../src/types';

describe('PaymentService', () => {
  let service: PaymentService;

  beforeEach(() => {
    service = new PaymentService();
  });

  describe('processPayment', () => {
    it('should process M-Pesa STK push', async () => {
      const request: TransactionRequest = {
        provider: 'mpesa',
        paymentMethod: 'stk_push',
        amount: 1000,
        orderId: 'TEST-001',
        phoneNumber: '+254712345678',
        description: 'Test payment',
      };

      const result = await service.processPayment(request);
      expect(result.provider).toBe('mpesa');
      expect(result.status).toBe('pending');
    });
  });
});
