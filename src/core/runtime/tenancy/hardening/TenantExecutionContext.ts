export type ExecutionScope = 'READ_ONLY' | 'CONSOLIDATION' | 'STRESS_SIMULATION';
export type RuntimeScope = 'SINGLE_ENTITY' | 'MULTI_ENTITY';

export interface TenantExecutionContext {
  readonly tenantId: string;
  readonly executionScope: ExecutionScope;
  readonly entityScope: string[]; // List of allowed entity IDs
  readonly runtimeScope: RuntimeScope;
  readonly auditScope: string; // Actor or process ID for audit logging
}

export class TenantIsolationError extends Error {
  constructor(public violationCode: string, message: string) {
    super(`[${violationCode}] ${message}`);
    this.name = 'TenantIsolationError';
  }
}

export const TenantViolations = {
  CROSS_TENANT_ACCESS: 'CROSS_TENANT_ACCESS',
  INVALID_ENTITY_SCOPE: 'INVALID_ENTITY_SCOPE',
  TENANT_BOUNDARY_VIOLATION: 'TENANT_BOUNDARY_VIOLATION',
  SHARED_RUNTIME_CONTEXT: 'SHARED_RUNTIME_CONTEXT',
  INVALID_TOPOLOGY_SCOPE: 'INVALID_TOPOLOGY_SCOPE',
  MISSING_TENANT_CONTEXT: 'MISSING_TENANT_CONTEXT'
} as const;
