import { ConsolidatedGroupInput } from './dataTypes';
import { ConsolidatedGroupRepository } from './ConsolidatedGroupRepository';
import { ConsolidatedEntityRepository } from './ConsolidatedEntityRepository';
import { IntercompanyRelationsLoader } from './IntercompanyRelationsLoader';

export class ConsolidatedFinancialDataLoader {
  /**
   * Orquestra a carga em lote sem executar inteligência, cálculos ou inferências.
   */
  static async load(groupId: string, fiscalYear: string): Promise<ConsolidatedGroupInput> {
    
    // 1. Fetch Group Metadata
    const groupMetadata = await ConsolidatedGroupRepository.fetchGroupMetadata(groupId);

    const bpByEntity: Record<string, any[]> = {};
    const dreByEntity: Record<string, any[]> = {};

    // 2. Fetch Entities Financials em paralelo
    const loadPromises = groupMetadata.entities.map(async (entity) => {
      const bp = await ConsolidatedEntityRepository.fetchBP(entity.id, fiscalYear);
      const dre = await ConsolidatedEntityRepository.fetchDRE(entity.id, fiscalYear);
      
      bpByEntity[entity.id] = bp;
      dreByEntity[entity.id] = dre;
    });

    await Promise.all(loadPromises);

    // 3. Fetch Intercompany
    const relations = await IntercompanyRelationsLoader.fetchRelations(groupId);

    // 4. Montar o payload final cru (Data Layer Contract)
    return {
      groupId,
      groupName: groupMetadata.groupName,
      fiscalYear,
      entities: groupMetadata.entities,
      bpByEntity,
      dreByEntity,
      intercompanyRelations: relations,
      ownershipStructure: [], // Extraído posteriormente
      consolidationScope: groupMetadata.entities.map(e => e.id),
      dataSource: 'FIREBASE',
      lineage: {
        extractedAt: new Date().toISOString(),
        extractionMethod: 'PARALLEL_QUERY',
        legacyMappingNote: 'Legacy ClientId as EntityId Bridge applied'
      }
    };
  }
}
