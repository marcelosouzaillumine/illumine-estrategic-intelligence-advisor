import { EntityInputPayload } from '../consolidated-types';
import { ContagionEdge } from './stress-types';
import { ExecutiveIntelligenceReport } from '../../../../../core/runtime/executive-intelligence-runtime';

export class CrossEntityCashDependencyResolver {
  
  /**
   * Avalia a dependência de caixa quando uma entidade consolidadora drena ou financia todo o grupo (Caixa Centralizado).
   */
  public extractCashDependencies(
    entities: EntityInputPayload[],
    reportsMap: Map<string, ExecutiveIntelligenceReport>
  ): ContagionEdge[] {
    const edges: ContagionEdge[] = [];
    
    // Simplification for Phase 4: Encontra quem concentra o caixa
    const holding = entities.find(e => e.role === 'Holding');
    if (!holding) return edges;

    const holdingReport = reportsMap.get(holding.entityId);
    if (!holdingReport) return edges;

    for (const entity of entities) {
      if (entity.role === 'Holding') continue;
      
      const subReport = reportsMap.get(entity.entityId);
      if (!subReport) continue;

      // Se a sub tem severity crítica mas a Holding não tem
      if ((subReport.severity.level === 'CRÍTICO' || subReport.severity.level === 'COLAPSO') && 
          (holdingReport.severity.level !== 'CRÍTICO' && holdingReport.severity.level !== 'COLAPSO')) {
         // A subsidiária é dependente da holding para sobreviver
         edges.push({
           sourceEntity: holding.entityId, // Se a Holding cortar, a sub morre
           targetEntity: entity.entityId,
           propagationType: 'LIQUIDITY',
           causalReason: `Subsidiária depende do Caixa Centralizado da Holding para runway`,
           confidence: 'DIRECT_EXPOSURE',
           propagationWeight: 0.9,
           affectedMetrics: ['runway'],
           lineage: `[EDGE] ${entity.entityId} depende da liquidez de ${holding.entityId} devido a Runway crítico isolado.`
         });
      }
    }

    return edges;
  }
}
