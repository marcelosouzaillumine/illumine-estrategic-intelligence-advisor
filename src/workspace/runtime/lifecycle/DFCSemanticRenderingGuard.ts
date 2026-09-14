export class DFCSemanticRenderingGuard {
  static validateExecutiveDisplay(semanticSource: string, lifecycleStage: string, renderedTerms: string[]): void {
    if (semanticSource !== 'ELSA' || lifecycleStage !== 'INITIAL_CAPITALIZATION') {
      return; // Only enforce for early-stage ELSA profiles
    }

    const blockedTerms = [
      'Crítico',
      'Crítica',
      'Colapso',
      'Deterioração',
      'Fragilidade Crônica',
      'Stress de Liquidez Crítico',
      'Critical Cash Integrity Risk',
      'Critical Earnings Integrity Risk'
    ];

    for (const term of renderedTerms) {
      if (!term) continue;
      
      const normalizedTerm = term.toLowerCase();
      for (const blocked of blockedTerms) {
        if (normalizedTerm.includes(blocked.toLowerCase())) {
          console.error(`[DFC_EXECUTIVE_SEMANTIC_LEAK] CRITICAL: Renderização executiva bloqueada. Termo maduro detectado: "${blocked}" no texto "${term}"`);
        }
      }
    }
  }

  static auditSemanticRoot(audit: any, renderedSource: string): any | null {
    if (!audit) return null;

    if (audit.root !== audit.canonicalRoot) {
      return {
        code: 'DFC_NON_CANONICAL_ROOT',
        severity: 'WARNING',
        blocked: false,
        message: `Semantic root mismatch: root is ${audit.root} but canonicalRoot is ${audit.canonicalRoot}`
      };
    }

    if (audit.canonicalRoot === 'ELSA' && renderedSource === 'LEGACY') {
      return {
        code: 'DFC_CANONICAL_ROOT_RENDER_MISMATCH',
        severity: 'CRITICAL',
        blocked: true,
        message: 'UI rendered LEGACY while canonical semantic root is ELSA.'
      };
    }

    return null;
  }
}
