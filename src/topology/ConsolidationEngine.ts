import { EntityGraph } from './EntityGraph';
import { IntercompanyResolver } from './IntercompanyResolver';
import { ConsolidatedDataResult } from './types';
import { RuntimeConfidence } from '../runtime/types';

export class ConsolidationEngine {
  /**
   * Realiza a consolidação das entidades informadas no escopo, aplicando as regras de:
   * - Eliminação Intercompany
   * - Herança da menor confiança
   * - Preservação de Lineage
   */
  static consolidate(graph: EntityGraph, scopeIds: string[], targetEntityId: string): ConsolidatedDataResult {
    // 1. Coletar os nós do escopo
    const nodes = scopeIds.map(id => graph.getNodeById(id)).filter(n => n !== undefined);
    
    // 2. Determinar Confidence (Pega a menor)
    const confidenceLevels: Record<RuntimeConfidence, number> = { 'LOW': 1, 'MEDIUM': 2, 'HIGH': 3 };
    let minConfidence: RuntimeConfidence = 'HIGH';
    
    for (const node of nodes) {
      const nodeConf = node!.confidence || 'HIGH';
      if (confidenceLevels[nodeConf] < confidenceLevels[minConfidence]) {
        minConfidence = nodeConf;
      }
    }

    // 3. Resolver Intercompany
    const elimination = IntercompanyResolver.resolve(graph, scopeIds);

    // 4. Montar Lineage Base
    const lineage = nodes.map(n => ({
      originEntityId: n!.id,
      computationPath: [n!.id, targetEntityId]
    }));

    // Nesta fase, não temos dados financeiros reais injetados no ConsolidationEngine,
    // então mockamos o consolidatedFinancials para a validação arquitetural
    return {
      groupId: graph.getGroupId(),
      targetEntityId,
      confidence: minConfidence,
      eliminatedAmount: elimination.eliminatedAmount,
      unreconciledOperations: elimination.unreconciledOperations,
      consolidatedFinancials: { status: 'CONSOLIDATED' }, // Placeholder
      lineage
    };
  }
}
