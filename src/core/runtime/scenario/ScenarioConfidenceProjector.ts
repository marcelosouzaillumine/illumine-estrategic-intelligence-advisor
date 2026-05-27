import { ProjectedConfidence, ScenarioPropagationResult } from './ScenarioTypes';
import { CalibrationEngine } from '../calibration/CalibrationEngine';

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

    const sensitivity = CalibrationEngine.getCalibration().stressPropagationSensitivity;
    const criticalMonthsLimit = Math.max(Math.round(3 * sensitivity), 1);

    // Se a timeline do cenário leva a crise de liquidez em menos de criticalMonthsLimit, forçamos stress crítico
    if (propagationResult.stressResult.monthsToLiquidityCrisis <= criticalMonthsLimit) {
      projected = 'CRITICAL_STRESS';
    }

    return projected;
  }
}
