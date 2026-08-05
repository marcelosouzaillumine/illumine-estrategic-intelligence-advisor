import { Subscription, SubscriptionStatus, SubscriptionLifecycleService } from '@domain/subscription';
import { BillingActivationRequested } from './events/IntegrationEvents';

export class ActivateSubscriptionUseCase {
  constructor(private readonly lifecycleService: SubscriptionLifecycleService) {}

  /**
   * Activates a PENDING subscription and fires the integration event for the Billing Domain.
   */
  public execute(subscription: Subscription): { subscription: Subscription; integrationEvent: BillingActivationRequested } {
    
    // 1. Enforce business rules via Domain Service
    const activatedSubscription = this.lifecycleService.transitionState(subscription, SubscriptionStatus.ACTIVE);
    
    // Set actual start date if not already populated correctly
    activatedSubscription.period.startDate = new Date().toISOString();

    // 2. Generate Integration Event to trigger Billing
    const integrationEvent: BillingActivationRequested = {
      id: `EVT-${Date.now()}`,
      eventName: 'BillingActivationRequested',
      occurredAt: new Date().toISOString(),
      source: 'application:revenue:subscription',
      payload: {
        subscriptionId: activatedSubscription.id,
        customerId: activatedSubscription.customer,
        billingCycle: activatedSubscription.billingCycle,
        startDate: activatedSubscription.period.startDate,
        currency: activatedSubscription.pricing.currency,
        amount: activatedSubscription.pricing.amount,
      }
    };

    // 3. Dispatch to Event Bus

    return { subscription: activatedSubscription, integrationEvent };
  }
}
