export type NarrativePermission = 'FULL' | 'RESTRICTED' | 'BLOCKED';
export type ExecutiveRiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type CashConversionStatus = 'HEALTHY' | 'ATTENTION' | 'CRITICAL';

export interface EarningsQualityIntelligence {
  score: number;
  classification: 'LOW' | 'MODERATE' | 'HIGH';
  drivers: string[];
}

export interface SolvencyIntelligence {
  liquidityRatio: number;
  thirdPartyDependence: number;
  equityToAssets: number;
  workingCapital: number;
  status: 'STABLE' | 'VULNERABLE' | 'CRITICAL';
  alerts: string[];
}

export interface FinancialIntelligenceAssessment {
  integrityStatus: 'PASSED' | 'WARNING' | 'BLOCKED';
  earningsQuality: EarningsQualityIntelligence;
  cashConversion: {
    status: CashConversionStatus;
    conversionRate: number;
    alert?: string;
  };
  solvency: SolvencyIntelligence;
  narrativePermission: NarrativePermission;
  executiveRiskLevel: ExecutiveRiskLevel;
}
