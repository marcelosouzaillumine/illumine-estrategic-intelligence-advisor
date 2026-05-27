import { HistoricalReplayIndexEntry } from './types';

export class HistoricalReplayIndex {
  /**
   * Constrói uma referência temporal leve para replay histórico.
   * Proíbe estritamente a serialização redundante de payload (Balanço, DRE, etc)
   * operando apenas via hashes, IDs e marcadores temporais.
   */
  public static createIndex(
    tenantId: string,
    correlationId: string,
    lineageHash: string,
    advisoryHash: string,
    maturityScore: number,
    anomalyReferences: string[],
    simulationHash?: string
  ): HistoricalReplayIndexEntry {

    if (!tenantId || !correlationId || !lineageHash || !advisoryHash) {
      throw new Error('HISTORICAL_REPLAY_INDEX_ERROR: Missing required hashes or isolation IDs for index creation.');
    }

    return {
      replayId: `replay_${new Date().getTime()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      tenantId,
      correlationId,
      lineageHash,
      advisoryHash,
      simulationHash,
      maturityScore,
      anomalyReferences
    };
  }
}
