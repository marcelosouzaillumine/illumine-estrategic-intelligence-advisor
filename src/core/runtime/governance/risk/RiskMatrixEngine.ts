import { RiskMatrixInput, RiskMatrixOutput, RiskSeverity } from './types';

export class RiskMatrixEngine {
  /**
   * Calcula o risco inerente e residual baseado na matriz de probabilidade x impacto
   * e na efetividade dos controles.
   */
  public evaluateRisk(input: RiskMatrixInput): RiskMatrixOutput {
    // Risco Inerente = Impacto * Probabilidade (Escala 1 a 25)
    const inherentRiskScore = input.impact * input.probability;

    // Risco Residual = Risco Inerente mitigado pela efetividade dos controles
    // controlsEffectiveness varia de 0 (nenhum controle) a 1 (100% efetivo)
    // Se 100% efetivo, o risco residual nunca é zero, mas cai substancialmente (minimo 1)
    const mitigationFactor = 1 - (input.controlsEffectiveness * 0.8); // Máximo 80% de redução
    const residualRiskRaw = inherentRiskScore * mitigationFactor;
    const residualRiskScore = Math.max(1, Math.round(residualRiskRaw));

    return {
      inherentRiskScore,
      residualRiskScore,
      criticalityLevel: this.determineCriticality(residualRiskScore),
      recommendedAction: this.getRecommendedAction(residualRiskScore)
    };
  }

  private determineCriticality(score: number): 'Baixa' | 'Média' | 'Alta' | 'Crítica' {
    if (score <= 4) return 'Baixa';
    if (score <= 9) return 'Média';
    if (score <= 15) return 'Alta';
    return 'Crítica';
  }

  private getRecommendedAction(score: number): string {
    if (score <= 4) return 'Monitorar periodicamente e aceitar o risco.';
    if (score <= 9) return 'Implementar controles preventivos padrão.';
    if (score <= 15) return 'Atenção do Board requerida. Mitigação imediata mandatória.';
    return 'Alerta Crítico Institucional. Intervenção executiva imediata exigida.';
  }
}

export const riskMatrixEngine = new RiskMatrixEngine();
