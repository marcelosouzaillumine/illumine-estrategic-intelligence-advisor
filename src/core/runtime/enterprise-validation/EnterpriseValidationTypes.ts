export interface ValidationLineageReference {
  executionId: string;
  scenarioType: string;
  goldenDatasetId?: string;
  timestamp: string;
  lineageHash: string;
}

export interface RuntimeIntegrityReport {
  integrityId: string;
  tenantId: string;
  bpConsistency: boolean;
  dreConsistency: boolean;
  dfcConsistency: boolean;
  crossModuleAnomalies: number;
  status: 'COMPLIANT' | 'VIOLATION' | 'WARNING';
}

export interface DataHealthMetrics {
  metricId: string;
  completeness: number; // 0 to 1
  accuracy: number;     // 0 to 1
  timeliness: number;   // 0 to 1
}

export interface ProductionReadinessScore {
  readinessId: string;
  overallScore: number; // 0 to 100
  dataPillarScore: number;
  uxPillarScore: number;
  pilotPillarScore: number;
  playbookPillarScore: number;
  commercialPillarScore: number;
  status: 'READY' | 'NOT_READY' | 'EVALUATING';
}

export interface ValidationScenarioResult {
  scenarioId: string;
  name: string;
  success: boolean;
  issues: string[];
}
