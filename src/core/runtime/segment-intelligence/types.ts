export type SegmentCode =
  | 'COMMERCE_DISTRIBUTION'
  | 'INDUSTRY'
  | 'HEALTHCARE'
  | 'SERVICES'
  | 'TECHNOLOGY'
  | 'NONPROFIT'
  | 'EDUCATION'
  | 'CONSTRUCTION'
  | 'LOGISTICS'
  | 'GENERIC_OPERATION';

export interface SegmentThresholds {
  minCurrentLiquidity: number;
  healthyCurrentLiquidity: number;
  maxInventoryToAssets: number;
  maxShortTermDebtToAssets: number;
  minOperatingCashReserveDays: number;
  maxAcceptableLeverage: number; // e.g. Debt/EBITDA
}

export interface SegmentRiskProfile {
  dominantOperationalRisks: string[];
  strategicAlerts: string[];
  contextualWarnings: string[];
  vulnerabilityDrivers: string[];
}

export interface SegmentNarrativeTraits {
  inventoryPressure: string;
  workingCapitalPressure: string;
  operationalLeverage: string;
  supplierDependency: string;
  fixedCostBurden: string;
  revenueSensitivities: string;
}

export interface SegmentOperationalCharacteristics {
  inventoryHeavy: boolean;
  assetLight: boolean;
  highSupplierDependency: boolean;
  workingCapitalSensitivity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  fixedCostIntensity: 'LOW' | 'MEDIUM' | 'HIGH';
  revenueVolatility: 'LOW' | 'MEDIUM' | 'HIGH';
}

export interface SegmentIntelligenceContext {
  segmentCode: SegmentCode;
  segmentLabel: string;
  segmentCategory: string;
  operationalCharacteristics: SegmentOperationalCharacteristics;
  defaultThresholdProfiles: SegmentThresholds;
  executiveNarrativeTraits: SegmentNarrativeTraits;
  baseRiskProfile: SegmentRiskProfile;
}

export interface SegmentConfidenceScore {
  segment: SegmentCode;
  confidence: number;
  source: 'client_registry' | 'inferred' | 'fallback' | 'missing' | 'metadata';
  inferenceMode: 'direct' | 'heuristic' | 'fallback';
}
