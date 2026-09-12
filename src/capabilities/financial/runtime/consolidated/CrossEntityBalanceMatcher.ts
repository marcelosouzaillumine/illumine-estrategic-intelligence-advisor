import { EntityInputPayload } from './consolidated-types';

export interface IntercompanyCandidate {
  entityId: string;
  category: string;
  type: string;
  value: number;
  source: 'BP' | 'DRE';
  counterpartyHint?: string; // Tenta deduzir a contraparte pelo nome
}

export class CrossEntityBalanceMatcher {
  private intercompanyKeywords = ['mutuo', 'mútuo', 'intercompany', 'coligada', 'controladora', 'controlada', 'subsidiaria', 'filial'];

  /**
   * Varre o rawData de cada entidade procurando contas que sinalizam operação intercompany.
   */
  public extractCandidates(entities: EntityInputPayload[]): IntercompanyCandidate[] {
    const candidates: IntercompanyCandidate[] = [];

    for (const entity of entities) {
      const rawData = entity.rawData;
      
      if (rawData.bpData && Array.isArray(rawData.bpData)) {
        for (const item of rawData.bpData) {
          if (this.isIntercompany(item.category, entities)) {
            candidates.push({
              entityId: entity.entityId,
              category: item.category,
              type: item.type || 'ativo/passivo', // Simplified
              value: item.value,
              source: 'BP',
              counterpartyHint: this.deduceCounterparty(item.category, entities)
            });
          }
        }
      }

      if (rawData.dreData && Array.isArray(rawData.dreData)) {
        for (const item of rawData.dreData) {
          if (this.isIntercompany(item.category, entities)) {
            candidates.push({
              entityId: entity.entityId,
              category: item.category,
              type: item.type || 'receita/despesa', // Simplified
              value: item.value,
              source: 'DRE',
              counterpartyHint: this.deduceCounterparty(item.category, entities)
            });
          }
        }
      }
    }

    return candidates;
  }

  private isIntercompany(categoryName: string, entities: EntityInputPayload[]): boolean {
    if (!categoryName) return false;
    const lowerCategory = categoryName.toLowerCase();
    if (this.intercompanyKeywords.some(kw => lowerCategory.includes(kw))) return true;
    if (lowerCategory.includes('holding')) return true;
    
    // Check if category includes any other entity ID
    for (const entity of entities) {
      if (lowerCategory.includes(entity.entityId.toLowerCase())) return true;
    }

    return false;
  }

  private deduceCounterparty(categoryName: string, entities: EntityInputPayload[]): string | undefined {
    if (!categoryName) return undefined;
    const lowerCategory = categoryName.toLowerCase();
    
    // Simplistic heuristic: if the category mentions an entity ID or name, we map it
    for (const entity of entities) {
      if (lowerCategory.includes(entity.entityId.toLowerCase())) {
        return entity.entityId;
      }
    }
    
    // Se for holding e a entidade tiver role Holding
    if (lowerCategory.includes('holding') || lowerCategory.includes('controladora')) {
      const holding = entities.find(e => e.role === 'Holding');
      if (holding) return holding.entityId;
    }

    return undefined;
  }
}
