import { ConsolidatedFinancialInput } from '../types';
import { ConsolidatedGroupInput } from './dataTypes';

export class ConsolidatedDataValidationGateway {
  /**
   * Transforma o Input Cru no Contrato Exato do Orchestrator.
   * Não corrige, não muta dados matemáticos.
   * Gera confidence tags caso faltem dados (o Orchestrator lidará com as violações).
   */
  static transform(rawInput: ConsolidatedGroupInput): ConsolidatedFinancialInput {
    
    const confidenceByEntity: Record<string, 'HIGH' | 'MEDIUM' | 'LOW'> = {};

    rawInput.entities.forEach(entity => {
      const hasBP = rawInput.bpByEntity[entity.id] && rawInput.bpByEntity[entity.id].length > 0;
      const hasDRE = rawInput.dreByEntity[entity.id] && rawInput.dreByEntity[entity.id].length > 0;

      if (hasBP && hasDRE) {
        confidenceByEntity[entity.id] = 'HIGH';
      } else if (hasBP || hasDRE) {
        confidenceByEntity[entity.id] = 'MEDIUM'; // Peças parciais
      } else {
        confidenceByEntity[entity.id] = 'LOW'; // Peças faltantes (Runtime deve flagar violation material)
      }
    });

    return {
      groupId: rawInput.groupId,
      fiscalYear: rawInput.fiscalYear,
      entities: rawInput.entities,
      consolidationScope: rawInput.consolidationScope,
      confidenceByEntity,
      bpByEntity: rawInput.bpByEntity,
      dreByEntity: rawInput.dreByEntity,
      topologySnapshot: {
        groupId: rawInput.groupId,
        nodes: [],
        edges: [],
        intercompanyOperations: rawInput.intercompanyRelations
      },
      sourceMetadata: rawInput.lineage
    };
  }
}
