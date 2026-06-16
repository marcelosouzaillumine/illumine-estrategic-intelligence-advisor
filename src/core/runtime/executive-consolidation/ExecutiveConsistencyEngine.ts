export interface ConsistencyAuditResult {
  isConsistent: boolean;
  violations: string[];
  confidenceScore: number;
}

export class ExecutiveConsistencyEngine {
  /**
   * Validate if the strategic interpretation matches the dimension engines output.
   * Modifies dimensions healthStatus or narratives in 'safe' mode to preserve consistency.
   * Throws in 'strict' mode if CI/CD fails.
   */
  public static validateStrategicAlignment(
    globalSeverityReason: string,
    assessments: any,
    mode: 'strict' | 'safe' | 'unsafe' = 'strict'
  ): ConsistencyAuditResult {
    if (!assessments) {
      return { isConsistent: true, violations: [], confidenceScore: 100 };
    }
    
    const violations: string[] = [];
    const reasonLower = globalSeverityReason.toLowerCase();

    // Regra 1: Excesso de Liquidez ou Capital Ocioso
    const hasExcessLiquidity = reasonLower.includes('excedente') || reasonLower.includes('conservador') || reasonLower.includes('ocioso');
    
    if (hasExcessLiquidity) {
      if (assessments?.efficiency?.healthStatus === 'EXCELLENT') {
        const msg = 'Violação Constitucional: Diagnóstico global aponta capital ocioso ou liquidez excedente, mas a Eficiência afirma saúde EXCELENTE.';
        violations.push(msg);
        
        if (mode === 'strict') throw new Error(msg);
        // Safe mode downgrade
        assessments.efficiency.healthStatus = 'ATTENTION';
        if (assessments.efficiency.executiveNarrative.toLowerCase().includes('eficiência máxima')) {
          assessments.efficiency.executiveNarrative = 'A organização sustenta segurança financeira, mas o excesso de liquidez indica oportunidade de otimização.';
        }
      }
    }

    // Regra 2: Score global muito alto mas estrutura crítica
    const globalScore = assessments?.globalScore ?? 100; // Fake assumption if missing
    if (globalScore >= 80) {
      if (assessments?.structure?.healthStatus === 'CRITICAL' || assessments?.preservation?.healthStatus === 'CRITICAL') {
        const msg = 'Violação Constitucional: Score excelente coexistindo com alerta estrutural CRÍTICO relevante.';
        violations.push(msg);
        
        if (mode === 'strict') throw new Error(msg);
        // Safe mode downgrade
        if (assessments.globalScore !== undefined) {
          assessments.globalScore = 79; // Downgrade below excellent
        }
      }
    }

    // Regra 3: Status dados insuficientes acompanhado por ação contundente
    const dims = ['liquidity', 'efficiency', 'preservation', 'workingCapital', 'structure'];
    for (const dim of dims) {
      if (assessments[dim]?.healthStatus === 'INSUFFICIENT_DATA') {
        const action = assessments[dim].priorityAction?.toLowerCase() || '';
        if (action.includes('imediata') || action.includes('urgente') || action.includes('drástica')) {
          const msg = `Violação Constitucional: Dimensão ${dim} tem status INSUFFICIENT_DATA, mas propõe ação prescritiva contundente.`;
          violations.push(msg);
          
          if (mode === 'strict') throw new Error(msg);
          // Safe mode downgrade
          assessments[dim].priorityAction = 'Avaliação limitada por disponibilidade de evidências históricas.';
        }
      }
    }

    // Regra 4: Verificação de Enums Crus nas Ações / Justificativas
    for (const dim of dims) {
      if (assessments[dim]) {
        const texts = [assessments[dim].executiveNarrative, assessments[dim].justification, assessments[dim].priorityAction].join(' ');
        if (texts.includes('HEALTHY') || texts.includes('NEUTRAL') || texts.includes('CAPITAL_IDLE_WARNING') || texts.includes('POSITIVE_TREASURY')) {
          const msg = `Violação Constitucional: Dimensão ${dim} contém Enums Crus não sanitizados no output gerencial.`;
          violations.push(msg);

          if (mode === 'strict') throw new Error(msg);
          
          assessments[dim].executiveNarrative = assessments[dim].executiveNarrative?.replace(/HEALTHY|NEUTRAL|CAPITAL_IDLE_WARNING|POSITIVE_TREASURY/g, 'Status Institucional Seguro');
          assessments[dim].justification = assessments[dim].justification?.replace(/HEALTHY|NEUTRAL|CAPITAL_IDLE_WARNING|POSITIVE_TREASURY/g, 'Status Institucional Seguro');
          assessments[dim].priorityAction = assessments[dim].priorityAction?.replace(/HEALTHY|NEUTRAL|CAPITAL_IDLE_WARNING|POSITIVE_TREASURY/g, 'Status Institucional Seguro');
        }
      }
    }

    return {
      isConsistent: violations.length === 0,
      violations,
      confidenceScore: violations.length === 0 ? 100 : 50
    };
  }


}
