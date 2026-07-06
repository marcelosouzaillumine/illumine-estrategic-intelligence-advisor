// src/core/runtime/governance/dlpa/DLPAHistoricalConsistencyEngine.ts
//
// Ref: Governance Runtime Correction — DLPA Fiduciary Interpretation Refactor
// Correlates DLPA longitudinal data across cycles to detect persistent structural fragility.

export interface HistoricalCycleMetrics {
  year: number;
  netIncome: number;
  totalDistributed: number;
  startingEquity: number;
  endingEquity: number;
  operatingCashFlow: number;
}

export interface HistoricalConsistencyReport {
  persistentStructuralFragility: boolean;
  yearsCount: number;
  lossesCount: number;
  noDistributionCount: number;
  erosionCount: number;
  warnings: string[];
}

export class DLPAHistoricalConsistencyEngine {
  constructor(...args: any[]) {}
  [key: string]: any;
  static [key: string]: any;
  public static evaluate(
    cycles: HistoricalCycleMetrics[]
  ): HistoricalConsistencyReport {
    const warnings: string[] = [];
    
    if (!cycles || cycles.length === 0) {
      return {
        persistentStructuralFragility: false,
        yearsCount: 0,
        lossesCount: 0,
        noDistributionCount: 0,
        erosionCount: 0,
        warnings: ['Série histórica ausente para análise longitudinal de consistência DLPA.'],
      };
    }

    // Sort cycles chronologically
    const sortedCycles = [...cycles].sort((a, b) => a.year - b.year);

    let lossesCount = 0;
    let noDistributionCount = 0;
    let erosionCount = 0;

    sortedCycles.forEach((cycle) => {
      // 1. Loss check
      if (cycle.netIncome <= 0) {
        lossesCount++;
      }

      // 2. Distribution check (dividend/partner distribution is zero or very near zero)
      if (Math.abs(cycle.totalDistributed) <= 10.0) { // Small buffer for round-offs
        noDistributionCount++;
      }

      // 3. Erosion check: ending equity is less than starting equity
      if (cycle.endingEquity < cycle.startingEquity) {
        erosionCount++;
      }
    });

    // Rule 8: If repeated years with no distribution AND repeated losses AND patrimonial erosion
    // (We consider "repeated" as >= 2 cycles)
    const persistentStructuralFragility =
      lossesCount >= 2 && noDistributionCount >= 2 && erosionCount >= 1;

    if (persistentStructuralFragility) {
      warnings.push(
        'Fragilidade estrutural persistente detectada: prejuízos recorrentes combinados com erosão patrimonial e ausência de base distributiva real.'
      );
    }

    return {
      persistentStructuralFragility,
      yearsCount: sortedCycles.length,
      lossesCount,
      noDistributionCount,
      erosionCount,
      warnings,
    };
  }
}
