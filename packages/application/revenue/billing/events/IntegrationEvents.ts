export interface IntegrationEvent {
  id: string;
  eventName: string;
  occurredAt: string;
  source: string;
  payload: any;
}

export interface PaymentProcessingRequested extends IntegrationEvent {
  eventName: 'PaymentProcessingRequested';
  payload: {
    invoiceId: string;
    customerId: string;
    amount: number;
    currency: string;
    dueDate: string;
  };
}
