export type BusinessStage = 
  | 'FIRST_OPERATIONAL_YEAR'
  | 'EARLY_STAGE_CONSOLIDATION'
  | 'GROWTH_STAGE'
  | 'SCALE_STAGE'
  | 'MATURE_OPERATION'
  | 'TURNAROUND_DISTRESS'
  | 'DECLINE_STAGE'
  | 'TRANSITION_STAGE';

export type EconomicModel = 
  | 'ASSET_HEAVY'
  | 'ASSET_LIGHT'
  | 'CAPITAL_INTENSIVE'
  | 'INVENTORY_DEPENDENT'
  | 'LABOR_INTENSIVE'
  | 'RECURRING_REVENUE'
  | 'SEASONAL_REVENUE'
  | 'SERVICE_BASED'
  | 'INDUSTRIAL'
  | 'DISTRIBUTION'
  | 'SAAS'
  | 'HEALTHCARE'
  | 'HOLDING_STRUCTURE'
  | 'FINANCIAL_OPERATION';

export type HistoricalDensity = 
  | 'SINGLE_YEAR_ONLY'
  | 'LOW_HISTORICAL_DENSITY'
  | 'MODERATE_HISTORY'
  | 'STRONG_HISTORICAL_BASE';

export type LiabilityNature = 
  | 'FINANCIAL_DEBT'
  | 'OPERATIONAL_SUPPLIER_FINANCING'
  | 'SHAREHOLDER_FUNDING'
  | 'TAX_EXPOSURE'
  | 'JUDICIAL_EXPOSURE'
  | 'PAYROLL_PRESSURE'
  | 'STRUCTURED_DEBT'
  | 'WORKING_CAPITAL_PRESSURE'
  | 'BALANCED_LIABILITY';

export type OperationalProfile = {
  inventoryDependency: 'HIGH' | 'MODERATE' | 'LOW';
  cashDependency: 'HIGH' | 'MODERATE' | 'LOW';
  capitalConcentration: 'HIGH' | 'MODERATE' | 'LOW';
  operationalElasticity: 'HIGH' | 'MODERATE' | 'LOW';
  financialCycle: 'LONG' | 'MODERATE' | 'SHORT' | 'NEGATIVE';
};

export type GrowthPattern = 
  | 'HEALTHY_GROWTH'
  | 'ARTIFICIAL_GROWTH'
  | 'CASHLESS_GROWTH'
  | 'DEBT_FINANCED_GROWTH'
  | 'SHAREHOLDER_FINANCED_GROWTH'
  | 'SUSTAINABLE_OPERATIONAL_EXPANSION'
  | 'PREMATURE_EXPANSION'
  | 'STAGNATION'
  | 'CONTRACTION';

export type StrategicConfidence = {
  dataConfidence: 'HIGH' | 'MODERATE' | 'LOW';
  strategicConfidence: 'HIGH' | 'MODERATE' | 'LIMITED_CONTEXT' | 'UNVERIFIABLE';
  reasons: string[];
};

export type NarrativeGovernance = {
  allowedNarrativeFrame: string[];
  blockedNarrativeClaims: string[];
  evidenceRequiredClaims: Record<string, string[]>;
};

export interface InstitutionalContextProfile {
  businessStage: BusinessStage;
  economicModel: EconomicModel;
  historicalDensity: HistoricalDensity;
  liabilityProfile: LiabilityNature[];
  operationalProfile: OperationalProfile;
  growthPattern: GrowthPattern;
  confidence: StrategicConfidence;
  narrativeConstraints: NarrativeGovernance;
  recommendationBoundaries: {
    focusAreas: string[];
    blockedRecommendations: string[];
  };
  scoreCalibrationRules: {
    evolutionWeight: number;
    profitabilityWeight: number;
    lossPenaltyFactor: number;
    inventoryPenaltyFactor: number;
  };
}

export interface IResolverContext {
  rawData: any;
  bpSummary: any;
  dreCascade: any[];
  historicalCyclesCount: number;
  industry: string;
  previousPl?: number;
  previousEbitda?: number;
  previousCash?: number;
}
