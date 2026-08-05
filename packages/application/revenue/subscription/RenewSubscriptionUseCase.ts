import { Subscription } from '@domain/subscription';

export class RenewSubscriptionUseCase {
  /**
   * Handles the renewal of a subscription, computing the next cycle dates.
   */
  public execute(subscription: Subscription): Subscription {
    
    // Simples renewal date logic bump (mock implementation)
    const currentRenewal = new Date(subscription.period.renewalDate || new Date());
    
    if (subscription.billingCycle === 'MONTHLY') {
      currentRenewal.setMonth(currentRenewal.getMonth() + 1);
    } else if (subscription.billingCycle === 'ANNUAL') {
      currentRenewal.setFullYear(currentRenewal.getFullYear() + 1);
    }
    
    const renewedSubscription = { ...subscription };
    renewedSubscription.period.renewalDate = currentRenewal.toISOString();
    renewedSubscription.updatedAt = new Date().toISOString();
    
    // Fire SubscriptionRenewed domain event

    return renewedSubscription;
  }
}
