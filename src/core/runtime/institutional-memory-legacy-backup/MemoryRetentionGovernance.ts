import { HistoricalReplayIndexEntry } from './types';
import { HistoricalReplayIndex } from './HistoricalReplayIndex';

export class MemoryRetentionGovernance {
  private static readonly MS_PER_DAY = 1000 * 60 * 60 * 24;

  public static classifyRetentionLayer(timestamp: string): 'HOT' | 'WARM' | 'COLD' {
    const timeDiffMs = new Date().getTime() - new Date(timestamp).getTime();
    const daysOld = timeDiffMs / this.MS_PER_DAY;

    if (daysOld <= 90) return 'HOT';
    if (daysOld <= 730) return 'WARM'; // 2 years
    return 'COLD';
  }

  public static migrateRetentionLayer(entry: HistoricalReplayIndexEntry, targetLayer: 'WARM' | 'COLD'): HistoricalReplayIndexEntry {
    this.validateRetentionPolicy(entry, targetLayer);
    
    // Copy immutably
    let migrated: HistoricalReplayIndexEntry = { ...entry };

    if (targetLayer === 'WARM') {
      migrated = this.compactWarmMemory(migrated);
    } else if (targetLayer === 'COLD') {
      migrated = this.compactColdMemory(migrated);
    }

    return Object.freeze(migrated);
  }

  public static compactWarmMemory(entry: HistoricalReplayIndexEntry): HistoricalReplayIndexEntry {
    const compacted = { ...entry };
    // Remove non-essential bulky fields
    compacted.anomalyReferences = [];
    compacted.recommendationReferences = [];
    compacted.retentionLayer = 'WARM';
    return compacted;
  }

  public static compactColdMemory(entry: HistoricalReplayIndexEntry): HistoricalReplayIndexEntry {
    // Preserve ONLY hashes, references, and immutable audit lineage
    return {
      replayId: entry.replayId,
      tenantId: entry.tenantId,
      entityScope: entry.entityScope,
      lineageHash: entry.lineageHash,
      inputHash: entry.inputHash,
      advisoryHash: entry.advisoryHash,
      correlationId: entry.correlationId,
      timestamp: entry.timestamp,
      period: entry.period,
      visibilityPolicy: entry.visibilityPolicy,
      retentionLayer: 'COLD',
      // The rest is cleared or set to default safely
      maturityScore: 0,
      governanceConsistencyIndex: 0,
      resilienceTrend: 'ARCHIVED',
      deteriorationTrend: 'ARCHIVED',
      anomalyReferences: [],
      recommendationReferences: [],
      simulationHash: entry.simulationHash,
      workflowHash: entry.workflowHash
    };
  }

  public static validateRetentionPolicy(entry: HistoricalReplayIndexEntry, targetLayer: 'WARM' | 'COLD'): void {
    if (!entry.lineageHash) throw new Error('RETENTION_VIOLATION: Nenhuma compactação poderá apagar audit trail ou lineage.');
    if (!entry.correlationId) throw new Error('RETENTION_VIOLATION: correlationId obrigatório mantido.');
    if (!entry.inputHash) throw new Error('RETENTION_VIOLATION: inputHash obrigatório mantido.');
    
    if (entry.retentionLayer === 'COLD' && targetLayer === 'WARM') {
      throw new Error('RETENTION_VIOLATION: Cannot migrate COLD to WARM.');
    }
  }
}
