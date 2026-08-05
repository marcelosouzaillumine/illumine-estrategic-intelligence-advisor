export enum RevenueSagaStatus {
  RUNNING = 'RUNNING',
  COMPLETED = 'COMPLETED',
  COMPENSATING = 'COMPENSATING',
  FAILED = 'FAILED'
}

export enum RevenueSagaStep {
  PROPOSAL = 'PROPOSAL',
  CONTRACT = 'CONTRACT',
  SUBSCRIPTION = 'SUBSCRIPTION',
  BILLING = 'BILLING',
  PAYMENT = 'PAYMENT',
  LICENSING = 'LICENSING',
  ENTITLEMENT = 'ENTITLEMENT',
  PROVISIONING = 'PROVISIONING'
}

export interface RevenueSagaState {
  sagaId: string;
  customerId: string;
  currentStep: RevenueSagaStep;
  status: RevenueSagaStatus;
  startedAt: string;
  completedAt?: string;
  failedAt?: string;
  failureReason?: string;
}
