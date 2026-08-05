export interface RevenueIntegrationEvent {
  id: string;
  eventName: string;
  occurredAt: string;
  source: string;
  payload: any;
}

// 1. Executive Decision
export interface ProposalAccepted extends RevenueIntegrationEvent {
  eventName: 'ProposalAccepted';
  payload: { proposalId: string; customerId: string };
}

// 2. Contract
export interface ContractActivated extends RevenueIntegrationEvent {
  eventName: 'ContractActivated';
  payload: { contractId: string; customerId: string; plan: string };
}

// 3. Subscription
export interface SubscriptionCreated extends RevenueIntegrationEvent {
  eventName: 'SubscriptionCreated';
  payload: { subscriptionId: string; customerId: string };
}

export interface SubscriptionActivated extends RevenueIntegrationEvent {
  eventName: 'SubscriptionActivated';
  payload: { subscriptionId: string; customerId: string };
}

// 4. Billing & Payment
export interface BillingActivationRequested extends RevenueIntegrationEvent {
  eventName: 'BillingActivationRequested';
  payload: { subscriptionId: string; customerId: string };
}

export interface PaymentConfirmed extends RevenueIntegrationEvent {
  eventName: 'PaymentConfirmed';
  payload: { invoiceId: string; customerId: string };
}

export interface PaymentFailed extends RevenueIntegrationEvent {
  eventName: 'PaymentFailed';
  payload: { invoiceId: string; customerId: string; reason: string };
}

// 5. License
export interface LicenseActivated extends RevenueIntegrationEvent {
  eventName: 'LicenseActivated';
  payload: { licenseId: string; customerId: string };
}

// 6. Entitlement
export interface EntitlementGranted extends RevenueIntegrationEvent {
  eventName: 'EntitlementGranted';
  payload: { entitlementId: string; tenantReference: string };
}

// 7. Provisioning
export interface TenantReadyForAccess extends RevenueIntegrationEvent {
  eventName: 'TenantReadyForAccess';
  payload: { tenantId: string; customerId: string; accessUrl: string };
}

// 8. Global Exceptions
export interface CustomerCancelled extends RevenueIntegrationEvent {
  eventName: 'CustomerCancelled';
  payload: { customerId: string; reason: string };
}
