export type GoldenDatasetType = 'INDUSTRIAL_HOLDING' | 'HEALTHCARE_NETWORK' | 'ADVISOR_MULTI_TENANT';

export interface GoldenDatasetProfile {
  datasetId: string;
  type: GoldenDatasetType;
  name: string;
  description: string;
  entities: GoldenEntity[];
  stressFactors: string[];
  governanceEvents: string[];
  intercompanyLinks: IntercompanyLink[];
  complexityScore: number; // 0 to 1
  lineageHash: string;
}

export interface GoldenEntity {
  entityId: string;
  name: string;
  role: string;
  revenue: number;
  ebitda: number;
  netDebt: number;
  liquidityPressure: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
}

export interface IntercompanyLink {
  from: string;
  to: string;
  type: 'LOAN' | 'ROYALTY' | 'SHARED_SERVICE' | 'GUARANTEE';
  value: number;
}

export interface ScenarioValidationResult {
  scenarioId: string;
  datasetType: GoldenDatasetType;
  passed: boolean;
  stressTriggered: boolean;
  earlyWarningsActivated: number;
  orchestrationEvents: number;
  issues: string[];
}

export interface ScaleReadinessReport {
  reportId: string;
  tenantId: string;
  concurrencyScore: number; // 0 to 1
  sessionStabilityScore: number; // 0 to 1
  recoveryScore: number; // 0 to 1
  crossTenantIsolationValid: boolean;
  status: 'READY' | 'AT_RISK' | 'FAILING';
}
