import { BalanceSheetGovernanceOutput } from './BalanceSheetGovernanceOutput';

export class BalanceSheetAnalyticalContextIntegrityGuard {
  constructor(...args: any[]) {}
  [key: string]: any;
  static [key: string]: any;
  static validate(
    analyticalContext: BalanceSheetGovernanceOutput['analyticalContext'] | undefined
  ): { isValid: boolean; violations: string[] } {
    const violations: string[] = [];

    if (!analyticalContext) {
      return {
        isValid: false,
        violations: ['MISSING_ANALYTICAL_CONTEXT']
      };
    }

    if (!analyticalContext.isAvailable) {
      violations.push('ANALYTICAL_CONTEXT_UNAVAILABLE');
    }

    if (!analyticalContext.clientContext.clientName) {
      violations.push('MISSING_CLIENT_NAME');
    }

    if (!analyticalContext.patrimonialIntelligence.solvencyReading) {
      violations.push('MISSING_SOLVENCY_READING');
    }
    
    if (!analyticalContext.patrimonialIntelligence.liquidityReading) {
      violations.push('MISSING_LIQUIDITY_READING');
    }

    if (!analyticalContext.patrimonialIntelligence.capitalStructureReading) {
      violations.push('MISSING_CAPITAL_STRUCTURE_READING');
    }

    if (!analyticalContext.patrimonialIntelligence.capitalPreservationReading) {
      violations.push('MISSING_CAPITAL_PRESERVATION_READING');
    }

    return {
      isValid: violations.length === 0,
      violations
    };
  }
}
