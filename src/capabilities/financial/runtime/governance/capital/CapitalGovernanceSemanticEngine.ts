export interface SemanticCheckParams {
  score: number;
  status: string;
  endingEquity: number;
  capitalSocial: number;
  cpiStatus: string;
  hasSevereOrHighErosion: boolean;
}

export class CapitalGovernanceSemanticEngine {
  public static resolveStatus(score: number, hasSevereOrHighErosion: boolean): string {
    if (score >= 80) {
      return hasSevereOrHighErosion ? 'Governança Estruturada com Risco de Capital' : 'Governança Estruturada';
    } else if (score >= 60) {
      return 'Governança em Consolidação';
    } else if (score >= 40) {
      return 'Governança Fragilizada';
    } else {
      return 'Governança Crítica';
    }
  }

  public static validateSemanticConsistency(params: SemanticCheckParams, context?: any): void {
    const { score, status, endingEquity, capitalSocial, cpiStatus, hasSevereOrHighErosion } = params;

    const profile = context?.lifecycleProfile;
    const isEarly = profile?.lifecycleStage === 'INITIAL_CAPITALIZATION' || profile?.lifecycleStage === 'EARLY_GROWTH';

    // 1. Check Score vs Status State Machine
    const expectedStatus = this.resolveStatus(score, hasSevereOrHighErosion);
    if (status !== expectedStatus) {
      if (isEarly && status === profile.governanceStatus.semanticLabel) {
        // Valid ELSA override, do not throw
      } else {
        throw new Error(`SEMANTIC_GOVERNANCE_CONTRADICTION: Mismatch between score (${score}) and status ('${status}'). Expected: '${expectedStatus}'.`);
      }
    }

    // 2. Ending Equity > 0 blocks Collapse
    if (endingEquity > 0) {
      const lowerCpi = cpiStatus.toLowerCase();
      if (lowerCpi.includes('collapse') || lowerCpi.includes('colapso')) {
        throw new Error(`SEMANTIC_GOVERNANCE_CONTRADICTION: PL positive (${endingEquity}) blocks collapse status '${cpiStatus}'.`);
      }
    }

    // 3. Prohibit invalid configurations
    if (score >= 80 && (status.includes('Fragilizada') || status.includes('Crítica'))) {
      if (isEarly && status === profile.governanceStatus.semanticLabel) {
        // Allowed ELSA override
      } else {
        throw new Error(`SEMANTIC_GOVERNANCE_CONTRADICTION: Prohibited state combination of high score (${score}) with status '${status}'.`);
      }
    }
    if (score < 40 && (status.includes('Estruturada') || status.includes('Consolidação'))) {
      if (isEarly && status === profile.governanceStatus.semanticLabel) {
        // Allowed ELSA override
      } else {
        throw new Error(`SEMANTIC_GOVERNANCE_CONTRADICTION: Prohibited state combination of low score (${score}) with status '${status}'.`);
      }
    }
  }


  public static buildFirstCycleNarrative(params: {
    foundationYear: number;
    analysisYear: number;
    historicalCycles: number;
    netIncome: number;
    endingEquity: number;
    cdiStatus: string;
    hasNegativeOperatingCashFlow: boolean;
    isRunwayLow: boolean;
  }): string {
    let narrative = 'A companhia encontra-se em fase inicial de capitalização, apresentando erosão patrimonial relevante decorrente dos investimentos necessários para estruturação operacional. Apesar do prejuízo do exercício, o patrimônio líquido permanece positivo, preservando a continuidade patrimonial da organização.';
    
    const activeRisks: string[] = [];
    if (params.netIncome < 0) {
      activeRisks.push('Prejuízo operacional líquido');
    }
    if (params.hasNegativeOperatingCashFlow) {
      activeRisks.push('Fluxo de Caixa Operacional (FCO) negativo');
    }
    if (params.isRunwayLow) {
      activeRisks.push('Runway de caixa reduzido');
    }
    if (params.cdiStatus.includes('Dependency')) {
      activeRisks.push('Dependência contínua de aportes dos acionistas');
    }

    if (activeRisks.length > 0) {
      narrative += ` Contudo, a governança alerta para riscos objetivos em tela: ${activeRisks.join(', ')}.`;
    }

    // Ensure forbidden words are absent
    const forbiddenWords = ['colapso', 'deterioracao historica', 'perda longitudinal', 'estrutura madura deteriorada'];
    forbiddenWords.forEach(word => {
      if (narrative.toLowerCase().includes(word)) {
        narrative = narrative.replace(new RegExp(word, 'gi'), '');
      }
    });

    return narrative;
  }
}
