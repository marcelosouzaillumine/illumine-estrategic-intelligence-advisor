import { RunwayClassificationEngine, FiduciaryRunwayClassification } from './RunwayClassificationEngine';
import { ExecutiveRecommendation } from '../../../../workspace/runtime/executive-consolidation/ExecutiveRecommendationDeduplicationEngine';

export interface DFCFiduciaryContext {
  fco: number;
  runwayMonths: number;
  cqs: number;
  dependencyClassification: 'CRITICAL' | 'HIGH' | 'MODERATE' | 'LOW' | string;
}

export class DFCFiduciaryPriorityResolver {
  /**
   * Resolve as 3 principais prioridades para o Board, baseadas no estado fiduciário
   */
  public static resolve(context: DFCFiduciaryContext): ExecutiveRecommendation[] {
    const priorities: ExecutiveRecommendation[] = [];
    const runwayClass = RunwayClassificationEngine.classify(context.runwayMonths);
    const isCriticalDependency = context.dependencyClassification.toUpperCase().includes('CRITI') || context.dependencyClassification.toUpperCase().includes('CRÍTICA');

    // Rule 1: Runway Crítico/Emergencial
    if (runwayClass === 'CRITICO' || runwayClass === 'EMERGENCIAL') {
      priorities.push({
        text: 'Reduzir consumo operacional de caixa',
        type: 'BOARD',
        impact: 'Muito Alto'
      });
      // Preventative liquidity is prohibited here by design because we push corrective actions.
    }

    // Rule 2: FCO Negative / CQS Low -> Need to increase conversion
    if (context.fco < 0 || context.cqs < 30) {
      priorities.push({
        text: 'Aumentar conversão de receita em liquidez',
        type: 'BOARD',
        impact: 'Alto'
      });
    }

    // Rule 3: Critical Dependency
    if (isCriticalDependency || (context.fco < 0 && runwayClass === 'CRITICO')) {
      priorities.push({
        text: 'Reduzir dependência de capitalização societária',
        type: 'BOARD',
        impact: 'Alto' // Can be Muito Alto depending on exact rules, sticking to High per example
      });
    }

    // Default fallbacks if no critical constraints
    if (priorities.length === 0) {
      if (context.cqs >= 70) {
        priorities.push({
          text: 'Preservar eficiência do ciclo de caixa e manter reservas',
          type: 'BOARD',
          impact: 'Moderado'
        });
      } else {
        priorities.push({
          text: 'Otimizar o giro de estoques e ciclos de recebimento',
          type: 'BOARD',
          impact: 'Moderado'
        });
      }
    }

    return priorities.slice(0, 3);
  }
}
