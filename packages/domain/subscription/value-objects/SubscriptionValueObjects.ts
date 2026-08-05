import { Identifier } from '../../shared';

export type SubscriptionId = Identifier;
export type CustomerReference = Identifier;
export type ContractReference = Identifier;

export enum BillingCycle {
  MONTHLY = 'MONTHLY',
  ANNUAL = 'ANNUAL',
  CUSTOM = 'CUSTOM'
}

export interface SubscriptionPeriod {
  startDate: string;
  endDate?: string;
  renewalDate?: string;
}

export enum RenewalPolicy {
  AUTO_RENEW = 'AUTO_RENEW',
  MANUAL_RENEW = 'MANUAL_RENEW',
  NON_RENEWABLE = 'NON_RENEWABLE'
}

export enum SubscriptionStatus {
  PENDING = 'PENDING',
  ACTIVE = 'ACTIVE',
  PAUSED = 'PAUSED',
  PAST_DUE = 'PAST_DUE',
  CANCELLED = 'CANCELLED',
  EXPIRED = 'EXPIRED'
}

export interface SubscriptionPlanReference {
  planId: string;
  planVersion: string;
}

export interface PricingSnapshotReference {
  snapshotId: string;
  capturedAt: string;
  currency: string;
  amount: number;
}

export interface SubscriptionMetrics {
  monthlyRecurringRevenue: number;
  annualRecurringRevenue: number;
  currency: string;
}
