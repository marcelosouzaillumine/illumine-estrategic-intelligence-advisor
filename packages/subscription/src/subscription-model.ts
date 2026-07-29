export type SubscriptionPlan = 'STARTER' | 'PROFESSIONAL' | 'ENTERPRISE' | 'ENTERPRISE_CERTIFIED';

export interface SubscriptionLimits {
  maxWorkspaces: number;
  maxUsers: number;
  aiMonthlyQuota: number;
}

export interface Subscription {
  tenantId: string;
  plan: SubscriptionPlan;
  status: 'ACTIVE' | 'PAST_DUE' | 'CANCELLED';
  billingCycle: 'MONTHLY' | 'ANNUAL';
  limits: SubscriptionLimits;
  features: string[];
  createdAt: string;
}
