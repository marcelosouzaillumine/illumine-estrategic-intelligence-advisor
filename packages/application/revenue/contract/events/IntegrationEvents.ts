export interface IntegrationEvent {
  id: string;
  eventName: string;
  occurredAt: string;
  source: string;
  payload: any;
}

export interface SubscriptionCreationRequested extends IntegrationEvent {
  eventName: 'SubscriptionCreationRequested';
  payload: {
    contractNumber: string;
    customerId: string;
    planId: string;
    billingCycle: string;
    currency: string;
  };
}
