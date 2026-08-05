export type FleurietClassificationType = 'TYPE_1' | 'TYPE_2' | 'TYPE_3' | 'TYPE_4' | 'TYPE_5' | 'TYPE_6';

export type FleurietRiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface FleurietAnalysisResult {
  type: FleurietClassificationType;
  classification: string;
  riskLevel: FleurietRiskLevel;
  description: string;
  cgl: number;
  ncg: number;
  treasury: number;
}

export type CapitalStructureDependency = 'CRITICAL' | 'HIGH' | 'MODERATE' | 'LOW' | 'VERY_LOW';

export interface CapitalStructureResult {
  dependencyClassification: CapitalStructureDependency;
  dependencyRatio: number;
  autonomyRatio: number;
  patrimonialLeverage: number;
  permanentAssetCoverage: number;
}
