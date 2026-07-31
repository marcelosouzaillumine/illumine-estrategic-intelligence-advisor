export class TenantIsolationViolationError extends Error {
  constructor(public context: { requestedTenant: string; activeTenant: string; sessionId: string; reason?: string }) {
    super(`AR-GFC-ERI-008: Tenant Isolation Violation! Attempted to access tenant [${context.requestedTenant}] with active tenant [${context.activeTenant}].`);
    this.name = 'TenantIsolationViolationError';
    
    // Assegura que o erro aparece corretamente em logs e stacks
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, TenantIsolationViolationError);
    }
  }
}
