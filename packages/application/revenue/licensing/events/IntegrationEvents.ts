export interface IntegrationEvent {
  id: string;
  eventName: string;
  occurredAt: string;
  source: string;
  payload: any;
}

export interface EntitlementGrantRequested extends IntegrationEvent {
  eventName: 'EntitlementGrantRequested';
  payload: {
    licenseId: string;
    customerId: string;
    scope: {
      capabilities: string[];
      modules: string[];
    };
    capacity: {
      seats: number;
      environments: number;
      storageLimitGB?: number;
    };
  };
}
