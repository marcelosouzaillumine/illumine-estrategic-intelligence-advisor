import { ContagionEdge, SystemicRiskProfile, StressPropagationWarning, StressPropagationConfidence } from './stress-types';
import { UnreconciledIntercompany } from '../consolidated-types';

export class SystemicRiskAggregator {
  
  public aggregate(
    baseEdges: ContagionEdge[],
    activeContagions: ContagionEdge[],
    unreconciled: UnreconciledIntercompany[]
  ): SystemicRiskProfile {
    
    const affectedEntities = new Set<string>();
    const warnings: StressPropagationWarning[] = [];
    let systemicConfidence: StressPropagationConfidence | 'EXACT_MATCH' = 'EXACT_MATCH';

    for (const contagion of activeContagions) {
      affectedEntities.add(contagion.targetEntity);
      
      if (contagion.confidence === 'LOW_CONFIDENCE_PROPAGATION') {
        warnings.push({
          warningId: `warn-${Math.random().toString(36).substring(7)}`,
          sourceEntity: contagion.sourceEntity,
          targetEntity: contagion.targetEntity,
          message: `LOW_CONFIDENCE_PROPAGATION: O contágio provável afeta a resiliência de ${contagion.targetEntity}, mas os valores originais possuíam divergências.`
        });
        systemicConfidence = 'LOW_CONFIDENCE_PROPAGATION';
      }

      if (contagion.confidence === 'UNVERIFIED_DEPENDENCY') {
        systemicConfidence = 'UNVERIFIED_DEPENDENCY';
      }
    }

    if (unreconciled.length > 0 && systemicConfidence === 'EXACT_MATCH') {
      systemicConfidence = 'LOW_CONFIDENCE_PROPAGATION';
    }

    const contagionLineage = activeContagions.map(c => c.lineage);
    const criticalChains: ContagionEdge[][] = this.extractCriticalChains(activeContagions);

    return {
      systemicStressMap: baseEdges, // Todo o mapa estrutural (saudável e estressado)
      propagatedRisks: activeContagions, // Apenas os focos ativos de contaminação
      contagionLineage,
      systemicConfidence,
      stressPropagationWarnings: warnings,
      affectedEntities: Array.from(affectedEntities),
      criticalDependencyChains: criticalChains
    };
  }

  /**
   * Identifica cascatas. Ex: A contamina B, B contamina C.
   */
  private extractCriticalChains(activeContagions: ContagionEdge[]): ContagionEdge[][] {
    const chains: ContagionEdge[][] = [];
    
    // Simplistic chain extraction: finding A -> B -> C
    for (const first of activeContagions) {
      const children = activeContagions.filter(c => c.sourceEntity === first.targetEntity);
      for (const second of children) {
        chains.push([first, second]);
      }
    }

    return chains;
  }
}
