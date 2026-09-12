import { DeploymentReadinessInput } from './DeploymentReadinessTypes';

export class EnvironmentIntegrityValidationEngine {
  public static validate(input: DeploymentReadinessInput) {
    const { environmentConfiguration, executiveReport } = input;
    const issues: string[] = [];
    let isUnsafe = false;
    
    // Environment Segregation & Mock Leakage
    if (environmentConfiguration.environmentType === 'PRODUCTION') {
      if (environmentConfiguration.mockFactoriesEnabled) {
        issues.push('CRITICAL: Mock factories are enabled in PRODUCTION environment.');
        isUnsafe = true;
      }
      if (environmentConfiguration.debugModeEnabled) {
        issues.push('CRITICAL: Debug mode is enabled in PRODUCTION environment.');
        isUnsafe = true;
      }
      if (environmentConfiguration.activeSimulations) {
        issues.push('CRITICAL: Active simulations detected in PRODUCTION environment.');
        isUnsafe = true;
      }
      if (!environmentConfiguration.tenantIsolationEnabled) {
        issues.push('CRITICAL: Tenant isolation is disabled in PRODUCTION environment.');
        isUnsafe = true;
      }
    }

    // Lineage Validation
    let lineageStatus: 'VALIDATED' | 'PARTIAL' | 'INVALID' = 'VALIDATED';
    const reportExt = executiveReport as unknown as { metadata?: { lineageHash?: string }, failClosedTriggered?: boolean };

    if (!input.lineageHash || input.lineageHash.trim() === '') {
      issues.push('CRITICAL: Missing runtime lineage hash.');
      lineageStatus = 'INVALID';
      isUnsafe = true;
    } else if (reportExt.metadata?.lineageHash && input.lineageHash !== reportExt.metadata?.lineageHash) {
      issues.push('CRITICAL: Runtime lineage hash mismatch.');
      lineageStatus = 'INVALID';
      isUnsafe = true;
    }

    // Fail-Closed Validation
    let failClosedStatus: 'VALIDATED' | 'PARTIAL' | 'BROKEN' = 'VALIDATED';
    if (executiveReport.resilienceReport?.confidenceLevel !== 'HIGH' && !reportExt.failClosedTriggered) {
       // If confidence is low/moderate but failClosed is not triggered, the fail-closed protection is broken.
       issues.push('CRITICAL: Fail-closed protection bypassed. Confidence is not HIGH but fail-closed was not triggered.');
       failClosedStatus = 'BROKEN';
       isUnsafe = true;
    }

    const status: 'UNSAFE' | 'VALIDATED' = isUnsafe ? 'UNSAFE' : 'VALIDATED';

    return {
      status,
      issues,
      lineageStatus,
      failClosedStatus
    };
  }
}
