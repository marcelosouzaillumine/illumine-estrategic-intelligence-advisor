import { ContagionEdge } from './stress-types';
import { DependencyStressCalculator } from './DependencyStressCalculator';
import { ExecutiveIntelligenceReport } from '../../../../core/runtime/executive-intelligence-runtime';

export class InstitutionalContagionResolver {
  private calculator: DependencyStressCalculator;

  constructor() {
    this.calculator = new DependencyStressCalculator();
  }

  /**
   * Varre todas as arestas baseadas em conexões reais. 
   * Se a fonte (source) estiver estressada, verifica se o choque contamina o alvo (target).
   */
  public resolveActiveContagions(
    baseEdges: ContagionEdge[], 
    reportsMap: Map<string, ExecutiveIntelligenceReport>
  ): ContagionEdge[] {
    const activeContagions: ContagionEdge[] = [];

    for (const edge of baseEdges) {
      const sourceReport = reportsMap.get(edge.sourceEntity);
      const targetReport = reportsMap.get(edge.targetEntity);

      // Proteção epistemológica: sem relatório, sem contágio.
      if (!sourceReport || !targetReport) continue;

      if (this.calculator.isTargetStressed(edge, targetReport, sourceReport)) {
        // O contágio ocorreu!
        activeContagions.push({
          ...edge,
          lineage: `${edge.lineage} -> CONTÁGIO ATIVADO devido à fragilidade em ${edge.targetEntity}`
        });
      }
    }

    return activeContagions;
  }
}
