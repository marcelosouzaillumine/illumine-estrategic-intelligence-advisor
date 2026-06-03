export interface DLPAViolation {
  code: string;
  severity: string;
  blocked: boolean;
  message: string;
}

export class DLPAExecutiveRenderingGuard {
  static validateExecutiveDisplay(
    semanticSource: string,
    lifecycleStage: string,
    renderedTerms: (string | undefined)[]
  ): DLPAViolation[] {
    const violations: DLPAViolation[] = [];
    if (semanticSource !== 'ELSA' || lifecycleStage !== 'INITIAL_CAPITALIZATION') {
      return violations;
    }

    const blockedTerms = [
      'LEGACY',
      'Governança Crítica',
      'WEAK CAPITAL PROTECTION',
      'High Capital Erosion',
      'Capital Under Collapse',
      'Colapso Patrimonial',
      'Fragilidade Crônica',
      'Deterioração Histórica'
    ];

    for (const term of renderedTerms) {
      if (!term) continue;
      const normalizedTerm = term.toLowerCase();
      for (const blocked of blockedTerms) {
        if (normalizedTerm.includes(blocked.toLowerCase())) {
          const message = `[DLPA_EXECUTIVE_SEMANTIC_LEAK] CRITICAL: Renderização executiva bloqueada. Termo legado detectado: "${blocked}" no texto "${term}"`;
          console.error(message);
          
          // Avoid pushing duplicate violations for the same term/code
          if (!violations.some(v => v.message === message)) {
            violations.push({
              code: 'DLPA_LEGACY_LABEL_RENDERED_UNDER_ELSA',
              severity: 'CRITICAL',
              blocked: true,
              message
            });
          }
        }
      }
    }

    return violations;
  }
}
