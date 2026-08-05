export enum FailureCategory {
  DOMAIN_ERROR = 'DOMAIN_ERROR',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  INFRASTRUCTURE_ERROR = 'INFRASTRUCTURE_ERROR',
  EXTERNAL_PROVIDER_ERROR = 'EXTERNAL_PROVIDER_ERROR',
  TIMEOUT = 'TIMEOUT'
}

export interface RevenueFailedEvent {
  eventId: string;
  eventType: string;
  payload: any;
  category: FailureCategory;
  failureReason: string;
  retryCount: number;
  lastAttemptAt: string;
  resolutionStatus: 'PENDING' | 'RETRIED_SUCCESSFULLY' | 'MANUAL_INTERVENTION_REQUIRED' | 'DISCARDED';
}
