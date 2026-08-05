export interface MemorySnapshot {
  period: string;
  profile: string; // e.g. "CONSERVATIVE_CAPITAL_STRUCTURE" or "GROWTH_INVESTMENT_PHASE"
  topRisks: string[];
  keyEvolutions: string[]; // e.g. "Caixa convertido em expansão"
}

export class FinancialIntelligenceMemory {
  private history: Map<string, MemorySnapshot> = new Map();

  public saveSnapshot(period: string, snapshot: Omit<MemorySnapshot, 'period'>): void {
    this.history.set(period, { ...snapshot, period });
  }

  public getSnapshot(period: string): MemorySnapshot | undefined {
    return this.history.get(period);
  }

  public getHistory(): MemorySnapshot[] {
    // Return sorted chronologically by period key (assuming period is like "2025")
    return Array.from(this.history.values()).sort((a, b) => a.period.localeCompare(b.period));
  }
}
