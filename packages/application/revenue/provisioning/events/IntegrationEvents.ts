export interface IntegrationEvent {
  id: string;
  eventName: string;
  occurredAt: string;
  source: string;
  payload: any;
}

export interface TenantReadyForAccess extends IntegrationEvent {
  eventName: 'TenantReadyForAccess';
  payload: {
    tenantId: string;
    customerId: string;
    adminIdentityReference: string;
    activatedCapabilities: string[];
    accessUrl: string;
  };
}
