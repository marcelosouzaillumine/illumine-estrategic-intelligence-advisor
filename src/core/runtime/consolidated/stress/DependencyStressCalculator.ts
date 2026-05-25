import { ContagionEdge } from './stress-types';
import { ExecutiveIntelligenceReport } from '../../executive-intelligence-runtime';

/**
 * Calcula se a entidade alvo (Target) tem resiliência para absorver o impacto.
 */
export class DependencyStressCalculator {
  
  public isTargetStressed(
    edge: ContagionEdge, 
    targetReport: ExecutiveIntelligenceReport,
    sourceReport: ExecutiveIntelligenceReport
  ): boolean {
    
    // Se o Source não está estressado, não há contágio ativo
    if (!this.isSourceStressed(sourceReport)) {
      return false;
    }

    // Lógica simplificada: Se a Target já tem Runway Critical ou EBITDA Critical, qualquer impacto extra engatilha contágio pleno
    if (targetReport.scores.composite < 40) {
      return true;
    }

    if (edge.propagationType === 'FINANCIAL') {
      // Se a Liquidez for menor que 1.0, sofre com o choque
      return targetReport.scores.financialStress?.isStressed === true || targetReport.scores.financial < 50;
    }

    if (edge.propagationType === 'OPERATIONAL') {
      return targetReport.scores.structural < 60;
    }

    return false;
  }

  public isSourceStressed(sourceReport: ExecutiveIntelligenceReport): boolean {
    if (sourceReport.scores.financialStress?.isStressed) return true;
    if (sourceReport.severity.level === 'CRÍTICO' || sourceReport.severity.level === 'COLAPSO' || sourceReport.severity.level === 'ESTRESSADO') return true;
    return false;
  }
}
