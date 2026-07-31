export class TenantBoundaryViolationError extends Error {
  constructor(message: string, public readonly traceId?: string) {
    super(`[TENANT BOUNDARY VIOLATION] ${message}`);
    this.name = 'TenantBoundaryViolationError';
  }
}
