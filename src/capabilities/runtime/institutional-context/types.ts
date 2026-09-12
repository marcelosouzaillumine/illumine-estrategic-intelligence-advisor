import { SegmentConfidenceScore } from '../segment-intelligence/types';

export type BusinessStage = 
  | 'INITIAL_OPERATION'
  | 'STRUCTURING_OPERATION'
  | 'EXPANDING_OPERATION'
  | 'MATURE_OPERATION'
  | 'CONSOLIDATED_OPERATION'
  | 'DECLINE_OPERATION'
  | 'RESTRUCTURING_OPERATION'
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
  | 'NO_VALID_HISTORY'
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

export interface OperationalSegment {
  code: string;
  label: string;
  source: "client_registry" | "metadata" | "inferred" | "missing";
}

export interface OperationalModelProfile {
  code: string;
  label: string;
  confidence: "LOW" | "MODERATE" | "HIGH";
}

export interface FinancialProfileNode {
  code: string;
  label: string;
  drivers: string[];
}

export interface InstitutionalMaturityNode {
  code: string;
  label: string;
  historicalSupportLevel: string;
}

export interface InstitutionalContextProfile {
  operationalSegment: OperationalSegment;
  segmentConfidence: SegmentConfidenceScore;
  operationalModel: OperationalModelProfile;
  financialProfile: FinancialProfileNode;
  institutionalMaturity: InstitutionalMaturityNode;
  
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
  legacy?: {
    businessStage: string;
    economicModel: string;
    liabilityProfile: string[];
    historicalDensity: string;
    operationalProfile?: any;
  };
  historicalCyclesCount?: number;
  tenantId?: string;
  currentCycle?: string;
  /** @deprecated Utilizado apenas para retrocompatibilidade com UI e Testes Legados */
  businessStage?: string;
  /** @deprecated Utilizado apenas para retrocompatibilidade com UI e Testes Legados */
  economicModel?: string;
  /** @deprecated Utilizado apenas para retrocompatibilidade com UI e Testes Legados */
  liabilityProfile?: string[];
  /** @deprecated Utilizado apenas para retrocompatibilidade com UI e Testes Legados */
  historicalDensity?: string;
  /** @deprecated Utilizado apenas para retrocompatibilidade com UI e Testes Legados */
  operationalProfile?: any;
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
