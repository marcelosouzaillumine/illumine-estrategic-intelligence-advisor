import { EntityLineageNode } from './consolidated-types';

export interface EntityState {
  entityId: string;
  isProcessed: boolean;
  role: 'Holding' | 'Subsidiary' | 'Branch' | 'JV';
  dataCompleteness: number;
}

export class ConsolidatedRuntimeContext {
  public groupId: string;
  public entities: Map<string, EntityState>;
  public consolidationPath: EntityLineageNode[];

  constructor(groupId: string) {
    this.groupId = groupId;
    this.entities = new Map();
    this.consolidationPath = [];
  }

  public registerEntity(entityId: string, role: 'Holding' | 'Subsidiary' | 'Branch' | 'JV') {
    this.entities.set(entityId, {
      entityId,
      isProcessed: false,
      role,
      dataCompleteness: 0
    });
    
    this.consolidationPath.push({
      entityId,
      role,
      contributionPercentage: 0 // Will be calculated dynamically later
    });
  }

  public markProcessed(entityId: string, completeness: number) {
    const state = this.entities.get(entityId);
    if (state) {
      state.isProcessed = true;
      state.dataCompleteness = completeness;
    }
  }

  public isFullyProcessed(): boolean {
    let allProcessed = true;
    this.entities.forEach(state => {
      if (!state.isProcessed) allProcessed = false;
    });
    return allProcessed;
  }
}
