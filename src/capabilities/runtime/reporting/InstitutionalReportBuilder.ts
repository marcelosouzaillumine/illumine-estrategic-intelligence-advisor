import { InstitutionalExecutiveReport, ReportLineageMetadata } from './ReportingTypes';
import { ConsolidatedExecutiveAdvisoryReport } from '../../financial/runtime/consolidated/advisory/advisoryTypes';
import { GovernanceViolationRecord } from '../../../core/runtime/observability/observability-types';

export class InstitutionalReportBuilder {
  /**
   * Monta o Relatório Executivo Oficial (Diagnóstico Institucional).
   * Ele não recalcula, apenas extrai e formaliza o output do Runtime.
   */
  static build(
    groupId: string,
    lineage: ReportLineageMetadata,
    advisory: ConsolidatedExecutiveAdvisoryReport,
    violations: GovernanceViolationRecord[]
  ): InstitutionalExecutiveReport {
    
    return {
      reportId: `INST-${crypto.randomUUID().slice(0,8).toUpperCase()}`,
      groupId,
      timestamp: lineage.timestamp,
      executiveSummary: advisory.narrative,
      systemicRisks: advisory.systemicRisks,
      violations,
      lineage
    };
  }
}
