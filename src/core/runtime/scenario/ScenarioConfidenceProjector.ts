import { ProjectedConfidence, ScenarioPropagationResult } from './ScenarioTypes';

export class ScenarioConfidenceProjector {
  /**
   * Determina a confiança preditiva final confrontando a Confiança Histórica original
   * com o impacto da propagação do cenário.
   */
  static project(historicalConfidence: 'HIGH' | 'MEDIUM' | 'LOW', propagationResult: ScenarioPropagationResult): ProjectedConfidence {
    let projected: ProjectedConfidence = propagationResult.projectedConfidence;

    // Se o histórico já era baixo e o cenário gera MEDIUM, rebaixamos pro histórico ou pior.
    if (historicalConfidence === 'LOW' && projected !== 'CRITICAL_STRESS') {
      projected = 'LOW';
    }

    // Se a timeline do cenário leva a crise de liquidez em menos de 3 meses, forçamos stress crítico
    if (propagationResult.stressResult.monthsToLiquidityCrisis <= 3) {
      projected = 'CRITICAL_STRESS';
    }

    return projected;
  }
}
