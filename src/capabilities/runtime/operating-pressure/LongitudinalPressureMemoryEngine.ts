// src/core/runtime/operating-pressure/LongitudinalPressureMemoryEngine.ts

export interface LongitudinalPressureRecord {
  timestamp: string;
  pressureSignals: {
    accumulationScore: number;
    fatigueScore: number;
    compressionScore: number;
    erosionScore: number;
    fragilityScore: number;
    overallScore: number;
  };
  evidenceLineage: {
    revenue: number;
    ebitda: number;
    availableCash: number;
    ocf: number;
    shortTermDebt: number;
    totalDebt: number;
  };
  recurrenceCount: number;
  pressureHash: string;
  tenantId: string;
  cycleReference: string;
}

export class LongitudinalPressureMemoryEngine {
  private static mockMemory: LongitudinalPressureRecord[] = [];

  /**
   * Append-only persistence of operational pressure metadata.
   * Restrita apenas a sinais e hashes de evidência para evitar persistência de interpretações.
   */
  public static persistPressure(record: Omit<LongitudinalPressureRecord, 'timestamp'>): boolean {
    const fullRecord: LongitudinalPressureRecord = {
      ...record,
      timestamp: new Date().toISOString()
    };

    // Em produção, isso persistiria em banco imutável ou ledger append-only
    this.mockMemory.push(fullRecord);
    return true;
  }

  public static getHistoricalPressures(tenantId: string): LongitudinalPressureRecord[] {
    return this.mockMemory.filter(record => record.tenantId === tenantId);
  }

  public static clearMemoryForTests(): void {
    this.mockMemory = [];
  }
}
