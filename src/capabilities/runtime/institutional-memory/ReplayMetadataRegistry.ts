import { HistoricalReplayIndexEntry } from './types';
import { HistoricalReplayIndex } from './HistoricalReplayIndex';
import { MemoryRetentionGovernance } from './MemoryRetentionGovernance';

// Dummy context to represent DataAccessContext for validation purposes
export interface DataAccessContext {
  tenantId: string;
  userId?: string;
  roles?: string[];
  entityScope?: string[];
}

export class ReplayMetadataRegistry {
  private static enforceContextAndIsolation(ctx: DataAccessContext, entry: HistoricalReplayIndexEntry): void {
    if (!ctx) throw new Error('MISSING_CONTEXT: Consultas deverão exigir DataAccessContext.');
    if (ctx.tenantId !== entry.tenantId) throw new Error('CROSS_TENANT_BLOCKED: Replay cross-tenant deverá ser bloqueado.');
    if (ctx.entityScope && !ctx.entityScope.includes(entry.entityScope)) {
      throw new Error('OUT_OF_SCOPE: EntityScope deverá restringir replay por entidade.');
    }
    // Visibility policy check placeholder
    if (!entry.visibilityPolicy) throw new Error('MISSING_VISIBILITY_POLICY: Replay sem visibilityPolicy deverá ser negado.');
  }

  public static registerReplayMetadata(ctx: DataAccessContext, entry: HistoricalReplayIndexEntry): void {
    if (!ctx) throw new Error('MISSING_CONTEXT: Consultas deverão exigir DataAccessContext.');
    this.enforceContextAndIsolation(ctx, entry);
    // Determine layer based on timestamp if not set
    const layer = MemoryRetentionGovernance.classifyRetentionLayer(entry.timestamp);
    const finalEntry = { ...entry, retentionLayer: layer };
    HistoricalReplayIndex.registerReplayIndex(finalEntry);
  }

  public static listReplayMetadataByTenant(ctx: DataAccessContext): HistoricalReplayIndexEntry[] {
    if (!ctx) throw new Error('MISSING_CONTEXT: Consultas deverão exigir DataAccessContext.');
    // Simulated GovernedRepositoryWrapper access over HistoricalReplayIndex
    const all = HistoricalReplayIndex._getInternalIndices();
    return all.filter(e => {
      try {
        this.enforceContextAndIsolation(ctx, e);
        return true;
      } catch (err) {
        return false;
      }
    });
  }

  public static getReplayMetadata(ctx: DataAccessContext, replayId: string): HistoricalReplayIndexEntry | undefined {
    if (!ctx) throw new Error('MISSING_CONTEXT: Consultas deverão exigir DataAccessContext.');
    const entry = HistoricalReplayIndex.buildReplayReference(replayId);
    if (entry) {
      this.enforceContextAndIsolation(ctx, entry);
    }
    return entry;
  }

  public static findReplayByLineageHash(ctx: DataAccessContext, lineageHash: string): HistoricalReplayIndexEntry | undefined {
    if (!ctx) throw new Error('MISSING_CONTEXT: Consultas deverão exigir DataAccessContext.');
    const all = HistoricalReplayIndex._getInternalIndices();
    const entry = all.find(e => e.lineageHash === lineageHash);
    if (entry) {
      this.enforceContextAndIsolation(ctx, entry);
    }
    return entry;
  }

  public static listReplayByPeriod(ctx: DataAccessContext, period: string): HistoricalReplayIndexEntry[] {
    if (!ctx) throw new Error('MISSING_CONTEXT: Consultas deverão exigir DataAccessContext.');
    const all = HistoricalReplayIndex._getInternalIndices();
    return all.filter(e => e.period === period).filter(e => {
      try {
        this.enforceContextAndIsolation(ctx, e);
        return true;
      } catch (err) {
        return false;
      }
    });
  }

  public static listReplayByRetentionLayer(ctx: DataAccessContext, layer: 'HOT' | 'WARM' | 'COLD'): HistoricalReplayIndexEntry[] {
    if (!ctx) throw new Error('MISSING_CONTEXT: Consultas deverão exigir DataAccessContext.');
    const all = HistoricalReplayIndex._getInternalIndices();
    return all.filter(e => e.retentionLayer === layer).filter(e => {
      try {
        this.enforceContextAndIsolation(ctx, e);
        return true;
      } catch (err) {
        return false;
      }
    });
  }
}
