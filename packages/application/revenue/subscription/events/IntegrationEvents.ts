export interface IntegrationEvent {
  id: string;
  eventName: string;
  occurredAt: string;
  source: string;
  payload: any;
}

export interface BillingActivationRequested extends IntegrationEvent {
  eventName: 'BillingActivationRequested';
  payload: {
    subscriptionId: string;
    customerId: string;
    billingCycle: string;
    startDate: string;
    currency: string;
    amount: number;
  };
}
