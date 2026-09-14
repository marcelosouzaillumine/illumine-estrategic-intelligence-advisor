import { EntityInputPayload } from '../consolidated-types';
import { ContagionEdge } from './stress-types';

export class SharedLiabilityStressEngine {
  
  /**
   * Procura avalistas/garantias cruzadas no BP para criar Edges de contágio.
   */
  public extractSharedLiabilities(entities: EntityInputPayload[]): ContagionEdge[] {
    const edges: ContagionEdge[] = [];
    
    // Simplification for Phase 4: varrer BP buscando "Garantia", "Aval"
    for (const entity of entities) {
      if (!entity.rawData || !Array.isArray(entity.rawData.bpData)) continue;

      for (const item of entity.rawData.bpData) {
        if (item.category.toLowerCase().includes('garantia') || item.category.toLowerCase().includes('aval')) {
          // Heurística de quem é a contraparte baseada no nome
          const targetHint = entities.find(e => item.category.toLowerCase().includes(e.entityId.toLowerCase()));
          
          if (targetHint && targetHint.entityId !== entity.entityId) {
            edges.push({
              sourceEntity: entity.entityId, // Quem dá a garantia
              targetEntity: targetHint.entityId, // Quem recebe a garantia
              propagationType: 'FINANCIAL',
              causalReason: `Shared Liability detectada: ${item.category}`,
              confidence: 'DIRECT_EXPOSURE',
              propagationWeight: 1.0, // Risco total (Garantidor assume a dívida)
              affectedMetrics: ['composite', 'liquidity'],
              lineage: `[EDGE] ${entity.entityId} é avalista/garantidor de dívida de ${targetHint.entityId}`
            });
          }
        }
      }
    }

    return edges;
  }
}
