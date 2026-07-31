export interface TenantIsolationContext {
  tenantId: string;
  organizationId: string;
  userId: string;
  executiveIdentity?: string;
  authorizationScope: string;
  isolationBoundaryId: string;
  traceId: string;
  createdAt: Date;
}
