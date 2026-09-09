import { Subscription, SubscriptionPlan } from './subscription-model';

export class LicenseManager {
  private subscriptions = new Map<string, Subscription>();

  public createSubscription(tenantId: string, plan: SubscriptionPlan): Subscription {
    const isEnterprise = plan === 'ENTERPRISE' || plan === 'ENTERPRISE_CERTIFIED';
    const sub: Subscription = {
      tenantId,
      plan,
      status: 'ACTIVE',
      billingCycle: 'ANNUAL',
      limits: {
        maxWorkspaces: isEnterprise ? 999 : 5,
        maxUsers: isEnterprise ? 9999 : 25,
        aiMonthlyQuota: isEnterprise ? 100000 : 5000
      },
      features: ['finance-governance', 'governance-governance', 'ai-advisor'],
      createdAt: new Date().toISOString()
    };

    this.subscriptions.set(tenantId, sub);
    return sub;
  }

  public getSubscription(tenantId: string): Subscription | undefined {
    return this.subscriptions.get(tenantId);
  }

  public isFeatureAllowed(tenantId: string, feature: string): boolean {
    const sub = this.subscriptions.get(tenantId);
    return sub ? sub.features.includes(feature) : false;
  }
}

export const licenseManager = new LicenseManager();
