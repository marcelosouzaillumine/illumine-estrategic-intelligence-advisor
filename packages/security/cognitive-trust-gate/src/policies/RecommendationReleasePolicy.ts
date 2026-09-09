import { TenantIsolationContext } from '../../../tenant-isolation-kernel/src';

export interface RecommendationPayload {
  content: string;
  evidenceUsed: any[];
  generationTraceId: string;
}

export class RecommendationReleasePolicy {
  static evaluate(context: TenantIsolationContext, payload: RecommendationPayload): string[] {
    const violations: string[] = [];
    
    // 1. O Tenant da requisição precisa ser inquestionável no momento do envio
    if (!context || !context.tenantId) {
      violations.push('POLICY_VIOLATION: Missing Tenant Context at release boundary.');
    }
    
    // 2. Nenhuma recomendação pode sair sem estar atrelada a um trace cognitivo
    if (!payload.generationTraceId) {
      violations.push('POLICY_VIOLATION: Recommendation lacks generation trace ID (Opaque Governance).');
    }
    
    // 3. (Mock) Verificação de evicências 
    if (payload.evidenceUsed && payload.evidenceUsed.length > 0) {
      const alienEvidence = payload.evidenceUsed.filter(e => e.tenantId && e.tenantId !== context.tenantId);
      if (alienEvidence.length > 0) {
         violations.push('POLICY_VIOLATION: Evidence pool contains cross-tenant contamination at release boundary.');
      }
    }
    
    return violations;
  }
}
