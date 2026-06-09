export interface GovernanceBlockingState {
  isBlocked: boolean;
  blockingCode?: string;
  blockingReason?: string;
}

export type BalanceSheetGovernanceOutput = {
  blockingState: GovernanceBlockingState;
  exerciseYear: number;
  summaryYear: number;
  temporalIntegrity: {
    isValid: boolean;
    violations: string[];
  };
  technicalIntegrity: {
    isValid: boolean;
    violations: string[];
  };
  executiveIntegrity: {
    isValid: boolean;
    violations: string[];
  };
  analyticalContextIntegrity: {
    isValid: boolean;
    violations: string[];
  };
  analyticalContext: {
    clientContext: {
      clientName?: string;
      segment?: string;
      businessStage?: string;
      operatingProfile?: string;
      companySize?: string;
      assumptions: string[];
    };
    patrimonialIntelligence: {
      solvencyReading: string;
      liquidityReading: string;
      capitalStructureReading: string;
      capitalPreservationReading: string;
      assetQualityReading: string;
      growthCapacityReading: string;
    };
    isAvailable: boolean;
    missingFields: string[];
  };
  sourceStatement: 'BALANCE_SHEET';
  indicators: {
    solvencyStatus: string;
    liquidityStatus: string;
    leverageStatus: string;
    capitalPreservationStatus: string;
    debtToEquity?: string | number; // Phase 2
    capitalConsumedAmount?: number; // Phase 5
    capitalConsumedPercent?: number | string; // Phase 5
    capitalConsumptionBase?: number; // Phase 5
    capitalConsumptionExplanation?: string; // Phase 5
  };
  executiveNarrative?: string; // Phase 3
  patrimonialThesis?: string;
  boardNarrative?: string;
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
