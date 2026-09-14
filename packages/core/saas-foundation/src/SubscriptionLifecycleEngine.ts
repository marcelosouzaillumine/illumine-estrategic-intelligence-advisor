import { SaaSSubscriptionContract, SubscriptionStatus } from '@illumine/executive-contracts';

export class SubscriptionLifecycleEngine {
  public static createSubscription(organizationId: string, planId: string): SaaSSubscriptionContract {
    const now = new Date();
    const periodEnd = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

    return {
      subscriptionId: `sub-${organizationId}`,
      organizationId,
      planId,
      status: 'ACTIVE',
      currentPeriodStart: now.toISOString(),
      currentPeriodEnd: periodEnd.toISOString(),
      enabledFeatures: ['MULTI_ADVISOR', 'AI_COUNCIL', 'PREDICTIVE_ENGINE', 'TRUST_LEDGER']
    };
  }

  public static transitionStatus(subscription: SaaSSubscriptionContract, nextStatus: SubscriptionStatus): SaaSSubscriptionContract {
    return {
      ...subscription,
      status: nextStatus
    };
  }
}
