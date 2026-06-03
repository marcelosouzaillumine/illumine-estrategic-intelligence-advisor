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

  static auditSemanticRoot(
    semanticSource: string,
    cqsSemantic: any,
    eqsSemantic: any,
    executiveNarrative: string | null
  ): any | null {
    if (semanticSource === 'LEGACY') {
      const isElsaCqs = cqsSemantic?.lifecycleStage === 'INITIAL_CAPITALIZATION';
      const isElsaEqs = eqsSemantic?.lifecycleStage === 'INITIAL_CAPITALIZATION';
      const isElsaNarrative = executiveNarrative?.toLowerCase().includes('fase inicial de capitalização');

      if (isElsaCqs || isElsaEqs || isElsaNarrative) {
        return {
          code: 'DFC_SEMANTIC_ROOT_MISMATCH',
          severity: 'CRITICAL',
          blocked: false,
          message: 'DFC context panel is rendering LEGACY while ELSA semantic evidence exists.'
        };
      }
    }
    return null;
  }
}
