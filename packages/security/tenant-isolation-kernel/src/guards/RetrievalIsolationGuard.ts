import { TenantIsolationContext } from '../contracts/TenantIsolationContext';
import { TenantIsolationKernel } from '../kernel/TenantIsolationKernel';
import { TenantBoundaryViolationError } from '../contracts/TenantBoundaryViolation';
import { TenantIsolationTrace } from '../trace/TenantIsolationTrace';

export interface RetrievedEmbedding {
  tenantId?: string;
  [key: string]: any;
}

export class RetrievalIsolationGuard {
  static createIsolatedFilter(context: TenantIsolationContext): Record<string, any> {
    TenantIsolationKernel.validateContext(context);
    
    return {
      tenantId: context.tenantId,
      authorizationScope: context.authorizationScope
    };
  }

  static validateRetrievalResults(context: TenantIsolationContext, results: RetrievedEmbedding[]): void {
    TenantIsolationKernel.validateContext(context);

    if (!results || results.length === 0) return;

    for (const result of results) {
      // Caso 1: Embedding sem tenant
      if (!result.tenantId) {
        this.logAndThrow(context, 'Embedding sem tenant identificado.', 'DENY');
      }

      // Caso 2 & 3: Embedding de outro tenant
      if (result.tenantId !== context.tenantId) {
        this.logAndThrow(context, `Embedding do Tenant ${result.tenantId} solicitado pelo Tenant ${context.tenantId}.`, 'DENY_SECURITY_EVENT');
      }
    }
  }

  private static logAndThrow(context: TenantIsolationContext, reason: string, decision: 'DENY' | 'DENY_SECURITY_EVENT') {
    TenantIsolationTrace.logDecision({
      traceId: context.traceId,
      tenantId: context.tenantId,
      resourceAccessed: 'RetrievalIsolationGuard.validateRetrievalResults',
      decision: 'DENY',
      timestamp: new Date(),
      component: 'RetrievalIsolationGuard',
      reason
    });

    if (decision === 'DENY_SECURITY_EVENT') {
      console.error(`[SECURITY EVENT CREATED] Cross-Tenant Leak Attempt Detected! Trace: ${context.traceId}`);
    }

    // Caso 3 exige BLOCK ENTIRE RETRIEVAL, lançamos erro que paralisa o fluxo
    throw new TenantBoundaryViolationError(`RETRIEVAL BLOCKED: ${reason}`, context.traceId);
  }
}
