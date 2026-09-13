import { 
  ExecutiveBoardPack, 
  InstitutionalExecutiveReport, 
  GovernanceAuditReport, 
  ScenarioStressReport,
  FiduciarySnapshot
} from './ReportingTypes';

export class ExecutiveBoardPackBuilder {
  /**
   * Empacota todos os relatórios em um dossiê único e versionado.
   */
  static build(
    groupId: string,
    version: number,
    snapshot: FiduciarySnapshot,
    executiveReport: InstitutionalExecutiveReport,
    governanceReport: GovernanceAuditReport,
    scenarioReport?: ScenarioStressReport
  ): ExecutiveBoardPack {
    
    return {
      packId: `PACK-${crypto.randomUUID().slice(0,8).toUpperCase()}`,
      groupId,
      timestamp: new Date().toISOString(),
      version,
      fiduciarySnapshotRef: snapshot.snapshotId,
      executiveReport,
      governanceReport,
      scenarioReport
    };
  }
}
