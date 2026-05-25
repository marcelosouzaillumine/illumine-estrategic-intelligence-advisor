import { FiduciarySnapshot, ReportLineageMetadata } from './ReportingTypes';
import { ConsolidatedExecutiveAdvisoryReport } from '../consolidated/advisory/advisoryTypes';
import { GovernanceViolationRecord } from '../observability/observability-types';

export class FiduciarySnapshotBuilder {
  /**
   * Congela o estado institucional.
   * Não duplica os dados crus (DRE/BP), apenas as conclusões e hashes.
   */
  static freeze(
    groupId: string, 
    lineage: ReportLineageMetadata,
    advisory: ConsolidatedExecutiveAdvisoryReport,
    violations: GovernanceViolationRecord[],
    durationMs: number
  ): FiduciarySnapshot {
    
    return {
      snapshotId: `SNAP-${crypto.randomUUID().slice(0,8).toUpperCase()}`,
      groupId,
      lineage,
      historicalConfidence: advisory.finalConfidence,
      violations,
      systemicRisks: advisory.systemicRisks,
      advisoryText: advisory.narrative,
      totalDurationMs: durationMs
    };
  }
}
