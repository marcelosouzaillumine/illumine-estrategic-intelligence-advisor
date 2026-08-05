export interface IntegrationEvent {
  id: string;
  eventName: string;
  occurredAt: string;
  source: string;
  payload: any;
}

export interface TenantProvisioningRequested extends IntegrationEvent {
  eventName: 'TenantProvisioningRequested';
  payload: {
    tenantReference: string;
    entitlementId: string;
    capabilities: { code: string; category: string }[];
    usageLimits: { metricCode: string; maxLimit: number }[];
    featureGates: { gateCode: string; isEnabled: boolean }[];
  };
}
