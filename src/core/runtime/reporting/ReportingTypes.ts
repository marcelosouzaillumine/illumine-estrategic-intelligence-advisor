import { GovernanceViolationRecord } from '../observability/observability-types';
import { ProjectedConfidence, ScenarioShock, InstitutionalStressResult, ScenarioNarrative } from '../scenario/ScenarioTypes';

export interface ReportLineageMetadata {
  executionId: string;
  scenarioId?: string;
  inputHash: string; // Hash do payload raw que gerou tudo
  lineageHash: string; // Hash da árvore de relatórios gerada
  runtimeVersion: string;
  reportVersion: number;
  timestamp: string;
}

export interface FiduciarySnapshot {
  snapshotId: string;
  groupId: string;
  lineage: ReportLineageMetadata;
  
  // Apenas outputs e hashes! Nada de BPs crus.
  historicalConfidence: 'HIGH' | 'MEDIUM' | 'LOW';
  projectedConfidence?: ProjectedConfidence;
  
  violations: GovernanceViolationRecord[];
  systemicRisks: any[]; // vindo do Advisory
  
  advisoryText: string;
  totalDurationMs: number;
  
  // Opcional se for resultado de Scenario
  stressResult?: InstitutionalStressResult;
}

export interface GovernanceAuditReport {
  reportId: string;
  groupId: string;
  timestamp: string;
  totalViolations: number;
  criticalViolations: GovernanceViolationRecord[];
  warningViolations: GovernanceViolationRecord[];
  lineage: ReportLineageMetadata;
}

export interface ScenarioStressReport {
  reportId: string;
  groupId: string;
  timestamp: string;
  shocksApplied: ScenarioShock[];
  projectedConfidence: ProjectedConfidence;
  institutionalStress: InstitutionalStressResult;
  narrative: ScenarioNarrative;
  lineage: ReportLineageMetadata;
}

export interface InstitutionalExecutiveReport {
  reportId: string;
  groupId: string;
  timestamp: string;
  executiveSummary: string;
  systemicRisks: any[];
  violations: GovernanceViolationRecord[];
  lineage: ReportLineageMetadata;
}

export interface ExecutiveBoardPack {
  packId: string;
  groupId: string;
  timestamp: string;
  version: number;
  
  executiveReport: InstitutionalExecutiveReport;
  governanceReport: GovernanceAuditReport;
  scenarioReport?: ScenarioStressReport;
  
  fiduciarySnapshotRef: string; // O ID do snapshot imutável atrelado
}

export interface ReportVersionRecord {
  packId: string;
  groupId: string;
  version: number;
  timestamp: string;
  executionId: string;
  lineageHash: string;
}
