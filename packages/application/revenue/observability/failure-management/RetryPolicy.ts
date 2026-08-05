import { FailureCategory } from './RevenueFailedEvent';

export interface RetryPolicy {
  maxRetries: number;
  backoffIntervalMs: number; // base delay
  strategy: 'LINEAR' | 'EXPONENTIAL';
  isRetriable: boolean;
}

export const RetryPolicies: Record<FailureCategory, RetryPolicy> = {
  [FailureCategory.DOMAIN_ERROR]: {
    maxRetries: 0, // Domain rules don't fix themselves
    backoffIntervalMs: 0,
    strategy: 'LINEAR',
    isRetriable: false
  },
  [FailureCategory.VALIDATION_ERROR]: {
    maxRetries: 0,
    backoffIntervalMs: 0,
    strategy: 'LINEAR',
    isRetriable: false
  },
  [FailureCategory.INFRASTRUCTURE_ERROR]: {
    maxRetries: 5,
    backoffIntervalMs: 2000,
    strategy: 'EXPONENTIAL',
    isRetriable: true
  },
  [FailureCategory.EXTERNAL_PROVIDER_ERROR]: {
    maxRetries: 3,
    backoffIntervalMs: 5000,
    strategy: 'LINEAR',
    isRetriable: true
  },
  [FailureCategory.TIMEOUT]: {
    maxRetries: 3,
    backoffIntervalMs: 1000,
    strategy: 'EXPONENTIAL',
    isRetriable: true
  }
};
