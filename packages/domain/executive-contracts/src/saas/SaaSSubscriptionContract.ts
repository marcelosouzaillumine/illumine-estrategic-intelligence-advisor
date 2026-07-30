export type SubscriptionStatus = 'TRIAL' | 'ACTIVE' | 'SUSPENDED' | 'CANCELLED' | 'EXPIRED';

export interface SaaSSubscriptionContract {
  readonly subscriptionId: string;
  readonly organizationId: string;
  readonly planId: string;
  readonly status: SubscriptionStatus;
  readonly currentPeriodStart: string;
  readonly currentPeriodEnd: string;
  readonly enabledFeatures: readonly string[];
}
