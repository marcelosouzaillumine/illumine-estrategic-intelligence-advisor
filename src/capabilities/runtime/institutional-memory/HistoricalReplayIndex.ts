import { HistoricalReplayIndexEntry } from './types';

export class HistoricalReplayIndex {
  private static indices: HistoricalReplayIndexEntry[] = [];

  public static registerReplayIndex(entry: HistoricalReplayIndexEntry): void {
    this.validateReplayIndex(entry);
    this.enforceAppendOnly(entry);
    this.assertNoPayloadBloat(entry);
    
    // Freeze object to ensure append-only and immutability
    this.indices.push(Object.freeze({ ...entry }));
  }

  public static validateReplayIndex(entry: HistoricalReplayIndexEntry): void {
    if (!entry.lineageHash) throw new Error('MISSING_LINEAGE_HASH: Replay sem lineageHash é negado.');
    if (!entry.correlationId) throw new Error('MISSING_CORRELATION_ID: Replay sem correlationId é negado.');
    if (!entry.tenantId) throw new Error('MISSING_TENANT_ID: Replay sem tenantId é negado.');
    if (!entry.visibilityPolicy) throw new Error('MISSING_VISIBILITY_POLICY: Replay sem visibilityPolicy é negado.');
  }

  public static enforceAppendOnly(entry: HistoricalReplayIndexEntry): void {
    const existing = this.indices.find(i => i.replayId === entry.replayId);
    if (existing) {
      throw new Error('IMMUTABLE_VIOLATION: Replay já existe. HistoricalReplayIndex opera apenas como append-only.');
    }
  }

  public static assertNoPayloadBloat(entry: any): void {
    const prohibitedKeys = [
      'balanceSheet',
      'dre',
      'cashFlow',
      'bpData',
      'dreData',
      'cashFlowData',
      'runtimePayload',
      'fullAdvisoryPayload'
    ];

    for (const key of prohibitedKeys) {
      if (entry[key] !== undefined) {
        throw new Error(`PAYLOAD_BLOAT_DETECTED: Campo proibido detectado no metadata de indexação: ${key}`);
      }
    }
  }

  public static buildReplayReference(replayId: string): HistoricalReplayIndexEntry | undefined {
    return this.indices.find(i => i.replayId === replayId);
  }

  public static _getInternalIndices(): HistoricalReplayIndexEntry[] {
    return this.indices;
  }

  public static _resetForTests(): void {
    this.indices = [];
  }
}
