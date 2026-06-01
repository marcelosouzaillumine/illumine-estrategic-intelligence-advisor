import { DeploymentReadinessInput, InstitutionalReadinessMatrix, ReadinessDimension } from './DeploymentReadinessTypes';
import { FiduciaryReadinessAssessmentEngine } from './FiduciaryReadinessAssessmentEngine';

export class InstitutionalReadinessOrchestrator {
  /**
   * Consolidates and structures all six dimensions of deployment readiness.
   */
  public static orchestrate(input: DeploymentReadinessInput): InstitutionalReadinessMatrix {
    const { environmentConfiguration, runtimeHealthMetrics, currentUserRole, tenantIsolationRuntime, executiveReport } = input;

    // 1. Production Readiness
    const prodIssues: string[] = [];
    if (!runtimeHealthMetrics.buildPassed) {
      prodIssues.push('Build production bundle compilation failed.');
    }
    if (!runtimeHealthMetrics.typecheckPassed) {
      prodIssues.push('TypeScript compiler validation (typecheck) has errors.');
    }
    if (!runtimeHealthMetrics.testsPassed) {
      prodIssues.push('Unit or regression tests failed in the environment.');
    }
    if (environmentConfiguration.environmentType === 'PRODUCTION') {
      if (environmentConfiguration.debugModeEnabled) {
        prodIssues.push('Debug mode is active under PRODUCTION environment configuration.');
      }
    }
    const productionReadiness: ReadinessDimension = {
      status: prodIssues.length === 0 ? 'VALIDATED' : 'NOT_READY',
      issues: prodIssues,
      description: 'Garante conformidade do build, testes e parametrização de ambiente produtivo.'
    };

    // 2. Fiduciary Readiness (integrated with FiduciaryReadinessAssessmentEngine)
    const fidValidation = FiduciaryReadinessAssessmentEngine.evaluate(input);
    const fiduciaryReadiness: ReadinessDimension = {
      status: fidValidation.fiduciaryReadinessStatus,
      issues: fidValidation.issues,
      description: 'Garante a integridade fiduciária da linhagem (lineage) e o comportamento fail-closed.'
    };

    // 3. Governance Readiness
    const govIssues: string[] = [];
    if (!environmentConfiguration.tenantIsolationEnabled) {
      govIssues.push('Cross-tenant data isolation boundary is disabled.');
    }
    if (tenantIsolationRuntime.hasCrossTenantAccess) {
      govIssues.push('Unauthorized cross-tenant data access vector detected.');
    }
    if (currentUserRole !== 'MASTER_SUPERVISOR' && currentUserRole !== 'FIDUCIARY_AUDITOR' && currentUserRole !== 'TENANT_ADMIN') {
      govIssues.push(`Current user role '${currentUserRole}' is unauthorized for production deployment operations.`);
    }
    const governanceReadiness: ReadinessDimension = {
      status: govIssues.length === 0 ? 'VALIDATED' : 'NOT_READY',
      issues: govIssues,
      description: 'Garante a segurança de acessos executivos e o isolamento de inquilinos (Tenant Isolation).'
    };

    // 4. Continuity Readiness
    const contIssues: string[] = [];
    const historicalCyclesCount = (executiveReport as unknown as { historicalCyclesCount?: number }).historicalCyclesCount ?? 1;
    if (historicalCyclesCount < 3) {
      contIssues.push(`Insufficient historical records for longitudinal continuity (Current: ${historicalCyclesCount} cycles, Expected: 3).`);
    }
    if (!executiveReport.recoveryReport) {
      contIssues.push('Institutional Recovery Engine report not generated.');
    }
    if (!executiveReport.resilienceReport) {
      contIssues.push('Resilience & Antifragility Engine report not generated.');
    }
    const continuityReadiness: ReadinessDimension = {
      status: contIssues.length === 0 ? 'VALIDATED' : 'NOT_READY',
      issues: contIssues,
      description: 'Valida se a maturidade e a continuidade histórica impedem inferências prematuras.'
    };

    // 5. Observability Readiness
    const obsIssues: string[] = [];
    if (runtimeHealthMetrics.unresolvedAnomalies > 5) {
      obsIssues.push(`Elevated number of unresolved telemetry anomalies in current window: ${runtimeHealthMetrics.unresolvedAnomalies}`);
    }
    const observabilityReadiness: ReadinessDimension = {
      status: obsIssues.length === 0 ? 'VALIDATED' : 'NOT_READY',
      issues: obsIssues,
      description: 'Valida se as métricas de performance e logs de auditoria estão saudáveis e limpos.'
    };

    // 6. Auditability Readiness
    const auditIssues: string[] = [];
    if (!input.auditTrail || input.auditTrail.length === 0) {
      auditIssues.push('System audit trail log is empty.');
    }
    const auditabilityReadiness: ReadinessDimension = {
      status: auditIssues.length === 0 ? 'VALIDATED' : 'NOT_READY',
      issues: auditIssues,
      description: 'Valida a persistência e imutabilidade dos registros de auditoria (ledger) e nexos causais.'
    };

    return {
      productionReadiness,
      fiduciaryReadiness,
      governanceReadiness,
      continuityReadiness,
      observabilityReadiness,
      auditabilityReadiness
    };
  }
}
