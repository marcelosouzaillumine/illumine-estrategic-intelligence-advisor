import { InstitutionalDataSource } from '../../types/data-fabric/InstitutionalDataSource';

/**
 * Responsável por converter automaticamente as fontes de dados persistidas no Fabric
 * em nós do Knowledge Graph.
 */
export class DataFabricGraphAdapter {
  
  static adaptSourceToGraphNode(source: InstitutionalDataSource) {
    return {
      id: source.artifactId,
      type: 'DATA_SOURCE',
      label: source.name,
      properties: {
        category: source.category,
        provider: source.provider,
        reliabilityScore: source.reliabilityScore,
        lastSyncAt: source.lastSyncAt,
        status: source.status
      },
      tenantId: source.tenantId
    };
  }

}
