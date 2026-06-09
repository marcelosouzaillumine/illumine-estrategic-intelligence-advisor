export interface CorrelationContext {
  correlationId: string;
  tenantId: string;
  clientId?: string;
  userId: string;
  role: string;
}

export interface RuntimeContext {
  engineId: string;
  engineVersion: string;
  runtimeAuthority: string;
}
