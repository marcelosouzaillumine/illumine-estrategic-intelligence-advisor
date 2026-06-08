export type BalanceSheetGovernanceOutput = {
  exerciseYear: number;
  sourceStatement: 'BALANCE_SHEET';
  indicators: {
    solvencyStatus: string;
    liquidityStatus: string;
    leverageStatus: string;
    capitalPreservationStatus: string;
  };
  dominantBpRestriction: string | null;
  primaryRecommendation: {
    source: 'BALANCE_SHEET';
    text: string;
    rationale: string[];
  };
  secondaryAdvisories: Array<{
    source: 'DRE' | 'DFC' | 'DLPA';
    text: string;
    severity: 'INFO' | 'WARNING';
  }>;
  validation: {
    severity: 'INFO' | 'WARNING' | 'BLOCKING';
    findings: string[];
    consistencyScore: number;
  };
  explainability: {
    origin: string;
    indicatorsUsed: string[];
    weightsApplied: Record<string, number>;
    reason: string;
  };
  longitudinalAnalysis?: {
    historicalAvailability: 'AVAILABLE' | 'INSUFFICIENT' | 'UNRELIABLE';
    previousYear?: number;
    currentYear: number;
    consistencyScore?: number;
    classificationTransitions: string[];
    keyDrivers: string[];
    narrative: string;
    materialityApplied: {
      monetaryVariation: number;
      ratioVariation: number;
      percentagePointVariation: number;
    };
    explainability: {
      improvedMetrics: string[];
      deterioratedMetrics: string[];
      unchangedMetrics: string[];
      unavailableMetrics: string[];
    };
  };
};
