import { GovernedFinancialEntry } from './types';

export class ImportViolationRegistry {
  static violationsMap: Map<string, any[]> = new Map();

  static register(batchId: string, entry: GovernedFinancialEntry) {
     if (!this.violationsMap.has(batchId)) {
        this.violationsMap.set(batchId, []);
     }
     this.violationsMap.get(batchId)?.push({
        category: entry.originalCategory,
        violations: entry.violations
     });
  }
}

export class ParsedDataQuarantine {
  static quarantinedBatches: Map<string, GovernedFinancialEntry[]> = new Map();

  static quarantine(batchId: string, entries: GovernedFinancialEntry[]) {
    this.quarantinedBatches.set(batchId, entries);
    console.warn(`[Quarantine] Lote ${batchId} movido para quarentena. Não será enviado ao RuntimeOrchestrator.`);
  }

  static getQuarantined(batchId: string) {
    return this.quarantinedBatches.get(batchId);
  }
}
