import { Money } from '@domain/shared/value-objects/Money';

export interface RevenueMetrics {
  mrr: Money;
  arr: Money;
  activeSubscriptions: number;
  churnRate: number; // percentage
  averageRevenuePerAccount: Money;
  customerLifetimeValue: Money;
  
  // Operational Metrics
  activationTime: number; // average minutes from Proposal to Tenant Active
  failedEventRate: number; // percentage of integration events failing
  provisioningSuccessRate: number; // percentage of successful provisions without retries
}
