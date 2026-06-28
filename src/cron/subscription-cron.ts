import cron from 'node-cron';
import { SubscriptionService } from '../services/subscription.service';
import { ReconciliationService } from '../services/reconciliation.service';
import { connectDatabase } from '../config/database.config';
import { logger } from '../utils/logger';

async function startCronJobs() {
  await connectDatabase();
  const subscriptionService = new SubscriptionService();
  const reconciliationService = new ReconciliationService();

  cron.schedule('0 6 * * *', async () => {
    logger.info('Processing recurring subscriptions...');
    try { const results = await subscriptionService.processRecurringPayments(); logger.info(`Processed ${results.length} subscriptions`); }
    catch (error) { logger.error('Subscription cron error:', error); }
  });

  cron.schedule('0 * * * *', async () => {
    logger.info('Running reconciliation...');
    try { const yesterday = new Date(); yesterday.setDate(yesterday.getDate() - 1); const results = await reconciliationService.reconcileTransactions(yesterday); logger.info(`Reconciliation complete: ${results.updated} updated`); }
    catch (error) { logger.error('Reconciliation cron error:', error); }
  });

  cron.schedule('59 23 * * *', async () => {
    logger.info('Generating daily report...');
    try { const today = new Date(); const report = await reconciliationService.generateDailyReport(today); logger.info('Daily report generated:', report.summary); }
    catch (error) { logger.error('Daily report cron error:', error); }
  });

  logger.info('Cron jobs started successfully');
}

startCronJobs();