import { TenantIsolationContext, TenantBoundaryViolationError } from '../../../tenant-isolation-kernel/src';
import { TrustValidationResult, SecurityCertificationStatus } from '../contracts/TrustValidationContracts';
import { RecommendationPayload, RecommendationReleasePolicy } from '../policies/RecommendationReleasePolicy';

export class CognitiveTrustGate {
  static verifyRelease(context: TenantIsolationContext, payload: RecommendationPayload): TrustValidationResult {
    const violations = RecommendationReleasePolicy.evaluate(context, payload);
    
    if (violations.length > 0) {
      console.error(`[COGNITIVE_TRUST_GATE] CRITICAL BLOCK. Trace: ${context?.traceId}. Violations:`, violations);
      
      const status: SecurityCertificationStatus = violations.some(v => v.includes('contamination')) 
        ? 'BLOCKED_CONTAMINATED' 
        : 'BLOCKED_NO_TRACE';

      return {
        isAllowed: false,
        status,
        gateTraceId: `GATE-DENY-${Date.now()}`,
        violations,
        certifiedAt: new Date()
      };
    }

    return {
      isAllowed: true,
      status: 'CERTIFIED_SAFE',
      gateTraceId: `GATE-ALLOW-${Date.now()}`,
      violations: [],
      certifiedAt: new Date()
    };
  }

  static enforceRelease(context: TenantIsolationContext, payload: RecommendationPayload): void {
    const result = this.verifyRelease(context, payload);
    if (!result.isAllowed) {
      throw new TenantBoundaryViolationError(
        `UNVERIFIED INTELLIGENCE BLOCKED: Trust Gate Certification Failed. Reason: ${result.violations.join(', ')}`,
        context?.traceId
      );
    }
  }
}
