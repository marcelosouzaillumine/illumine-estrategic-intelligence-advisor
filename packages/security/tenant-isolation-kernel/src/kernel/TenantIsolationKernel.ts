import { TenantIsolationContext } from '../contracts/TenantIsolationContext';
import { IsolationDecision } from '../contracts/IsolationDecision';
import { TenantBoundaryViolationError } from '../contracts/TenantBoundaryViolation';
import { TenantIsolationTrace } from '../trace/TenantIsolationTrace';

export class TenantIsolationKernel {
  static validateContext(context: TenantIsolationContext): IsolationDecision {
    if (!context || !context.tenantId || !context.traceId || !context.authorizationScope) {
      const reason = 'Contexto inválido: tenantId, traceId ou authorizationScope ausentes.';
      TenantIsolationTrace.logDecision({
        traceId: context?.traceId || 'UNKNOWN',
        tenantId: context?.tenantId || 'UNKNOWN',
        resourceAccessed: 'Kernel Validation',
        decision: 'DENY',
        timestamp: new Date(),
        component: 'TenantIsolationKernel',
        reason
      });
      
      throw new TenantBoundaryViolationError(reason, context?.traceId);
    }

    const decision: IsolationDecision = {
      allowed: true,
      boundaryHash: this.createBoundaryHash(context),
      timestamp: new Date()
    };

    TenantIsolationTrace.logDecision({
      traceId: context.traceId,
      tenantId: context.tenantId,
      resourceAccessed: 'Kernel Validation',
      decision: 'ALLOW',
      timestamp: decision.timestamp,
      component: 'TenantIsolationKernel'
    });

    return decision;
  }

  static authorizeResource(context: TenantIsolationContext, resourceTenantId: string): boolean {
    this.validateContext(context);
    
    const isAuthorized = context.tenantId === resourceTenantId;
    
    TenantIsolationTrace.logDecision({
      traceId: context.traceId,
      tenantId: context.tenantId,
      resourceAccessed: `Resource(tenantId: ${resourceTenantId})`,
      decision: isAuthorized ? 'ALLOW' : 'DENY',
      timestamp: new Date(),
      component: 'TenantIsolationKernel',
      reason: isAuthorized ? undefined : 'Tentativa de acesso cross-tenant'
    });

    if (!isAuthorized) {
       throw new TenantBoundaryViolationError(`Tentativa de acesso cross-tenant bloqueada. Resource: ${resourceTenantId}, Identity: ${context.tenantId}`, context.traceId);
    }

    return true;
  }

  static createBoundaryHash(context: TenantIsolationContext): string {
    const data = `${context.tenantId}:${context.organizationId}:${context.authorizationScope}`;
    let hash = 0;
    for (let i = 0; i < data.length; i++) {
      const char = data.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash).toString(16).padStart(8, '0');
  }
}
