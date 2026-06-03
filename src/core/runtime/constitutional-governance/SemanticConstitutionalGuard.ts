import { ConstitutionalSemanticAuthorityRegistry } from './ConstitutionalSemanticAuthorityRegistry';

export interface SemanticValidationResult {
  status: 'COMPLIANT' | 'WARNING' | 'NON_COMPLIANT';
  violations: string[];
}

export class SemanticConstitutionalGuard {
  public static validateSemanticAuthority(
    semanticSource: string,
    renderedContent: string,
    strictMode: boolean = true,
    semanticScope: 'EXECUTIVE' | 'TECHNICAL_AUDIT' = 'EXECUTIVE'
  ): SemanticValidationResult {
    
    if (ConstitutionalSemanticAuthorityRegistry.FORBIDDEN_SOURCES.includes(semanticSource)) {
      const errorMsg = `[UNAUTHORIZED_SEMANTIC_AUTHORITY] CRITICAL: Forbidden semantic source detected: ${semanticSource}`;
      if (semanticScope === 'EXECUTIVE') {
        if (strictMode) {
          throw new Error(errorMsg);
        }
        return { status: 'NON_COMPLIANT', violations: [errorMsg] };
      }
      return { status: 'WARNING', violations: [`[UNAUTHORIZED_SEMANTIC_AUTHORITY] WARNING: Forbidden semantic source detected: ${semanticSource} under TECHNICAL_AUDIT.`] };
    }

    const isApprovedAuthority = ConstitutionalSemanticAuthorityRegistry.APPROVED_SOURCES.includes(semanticSource);
    
    const violations: string[] = [];

    if (!isApprovedAuthority) {
      violations.push(`Unrecognized semantic source: ${semanticSource}. Falling back to WARNING.`);
    }

    const blockedTerms = [
      'WEAK CAPITAL PROTECTION',
      'HIGH CAPITAL EROSION',
      'CAPITAL UNDER COLLAPSE',
      'Governança Crítica',
      'LEGACY'
    ];

    const normalizedContent = renderedContent.toUpperCase();
    
    // Only ELSA should be rendering semantic labels. If ELSA is active and a legacy label leaks, it's a critical violation.
    if (semanticSource === 'ELSA') {
      for (const term of blockedTerms) {
        if (normalizedContent.includes(term.toUpperCase())) {
          const leakError = `[SEMANTIC_EXECUTIVE_LEAK] CRITICAL: Rendered legacy label "${term}" detected in output while semanticSource is ELSA.`;
          if (semanticScope === 'EXECUTIVE') {
            if (strictMode) {
              throw new Error(leakError);
            }
            violations.push(leakError);
          } else {
            violations.push(`[SEMANTIC_EXECUTIVE_LEAK] WARNING: Rendered legacy label "${term}" detected in output under TECHNICAL_AUDIT.`);
          }
        }
      }
    }

    if (violations.length > 0) {
      const hasCritical = violations.some(v => v.includes('CRITICAL'));
      return {
        status: hasCritical ? 'NON_COMPLIANT' : 'WARNING',
        violations
      };
    }

    return {
      status: 'COMPLIANT',
      violations: []
    };
  }
}
