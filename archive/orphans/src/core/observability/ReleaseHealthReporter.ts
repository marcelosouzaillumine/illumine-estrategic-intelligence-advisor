import { RuntimeTraceLogger } from './RuntimeTraceLogger';
import { GovernanceAuditTrace } from './GovernanceAuditTrace';
import { FirestoreFailureReporter } from './FirestoreFailureReporter';
import { TenantAccessTrace } from './TenantAccessTrace';

export interface HealthSummary {
  timestamp: string;
  totalTraces: number;
  totalAudits: number;
  totalFailures: number;
  totalTenantSwitches: number;
  isSystemDegraded: boolean;
  unresolvedDenialsCount: number;
  healthState: 'EXCELLENT' | 'DEGRADED' | 'CRITICAL';
}

export class ReleaseHealthReporter {
  public static compileSummary(tenantId?: string): HealthSummary {
    const traces = RuntimeTraceLogger.getRecentTraces();
    const audits = tenantId ? GovernanceAuditTrace.getTracesForTenant(tenantId) : [];
    const failures = FirestoreFailureReporter.getFailures();
    const switches = TenantAccessTrace.getHistory();

    const denials = audits.filter(a => !a.permissionGranted).length;
    const isDegraded = FirestoreFailureReporter.isSystemDegraded();

    let healthState: HealthSummary['healthState'] = 'EXCELLENT';
    if (isDegraded) {
      healthState = 'CRITICAL';
    } else if (failures.length > 0 || denials > 5) {
      healthState = 'DEGRADED';
    }

    return {
      timestamp: new Date().toISOString(),
      totalTraces: traces.length,
      totalAudits: audits.length,
      totalFailures: failures.length,
      totalTenantSwitches: switches.length,
      isSystemDegraded: isDegraded,
      unresolvedDenialsCount: denials,
      healthState
    };
  }
}
