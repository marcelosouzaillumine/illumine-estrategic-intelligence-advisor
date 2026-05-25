import { GovernanceAuditReport, ReportLineageMetadata } from './ReportingTypes';
import { GovernanceViolationRecord } from '../observability/observability-types';

export class GovernanceAuditReportBuilder {
  static build(
    groupId: string,
    lineage: ReportLineageMetadata,
    violations: GovernanceViolationRecord[]
  ): GovernanceAuditReport {
    
    const criticalViolations = violations.filter(v => v.severity === 'CRITICAL');
    const warningViolations = violations.filter(v => v.severity === 'WARNING');

    return {
      reportId: `GOV-${crypto.randomUUID().slice(0,8).toUpperCase()}`,
      groupId,
      timestamp: lineage.timestamp,
      totalViolations: violations.length,
      criticalViolations,
      warningViolations,
      lineage
    };
  }
}
