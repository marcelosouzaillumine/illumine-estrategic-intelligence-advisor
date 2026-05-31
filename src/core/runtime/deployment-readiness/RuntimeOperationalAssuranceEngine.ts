import { DeploymentReadinessInput } from './DeploymentReadinessTypes';

export class RuntimeOperationalAssuranceEngine {
  public static validate(input: DeploymentReadinessInput) {
    const { runtimeHealthMetrics, executiveReport } = input;
    const issues: string[] = [];
    const recommendations: string[] = [];
    
    let assuranceStatus: 'LOW' | 'MODERATE' | 'HIGH' = 'HIGH';
    let regressionRisk: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL' = 'LOW';
    
    // Check runtime health metrics (the mandatory FULL_PRODUCTION_READY rules)
    if (!runtimeHealthMetrics.testsPassed) {
      issues.push('CRITICAL: CI Tests failed. FULL_PRODUCTION_READY blocked.');
      assuranceStatus = 'LOW';
    }
    if (!runtimeHealthMetrics.typecheckPassed) {
      issues.push('CRITICAL: Typecheck failed. FULL_PRODUCTION_READY blocked.');
      assuranceStatus = 'LOW';
    }
    if (!runtimeHealthMetrics.buildPassed) {
      issues.push('CRITICAL: Build validation failed. FULL_PRODUCTION_READY blocked.');
      assuranceStatus = 'LOW';
    }
    
    if (runtimeHealthMetrics.unresolvedAnomalies > 0) {
      issues.push(`WARNING: ${runtimeHealthMetrics.unresolvedAnomalies} unresolved runtime anomalies detected.`);
      if (assuranceStatus === 'HIGH') assuranceStatus = 'MODERATE';
    }
    
    // Evaluate regression risk from ExecutiveReport
    if (executiveReport.regressionReport?.regressionDetected) {
      regressionRisk = 'HIGH';
      if ((executiveReport.regressionReport as any).activeRecoveryStage === 'COLLAPSE') {
        regressionRisk = 'CRITICAL';
        issues.push('CRITICAL: Critical runtime regression detected during collapse state.');
        assuranceStatus = 'LOW';
      } else {
         recommendations.push('Supervise deployment closely due to detected longitudinal regression.');
         if (assuranceStatus === 'HIGH') assuranceStatus = 'MODERATE';
      }
    }
    
    // Check missing audit continuity
    if (!input.auditTrail || input.auditTrail.length === 0) {
       issues.push('CRITICAL: Missing audit continuity.');
       assuranceStatus = 'LOW';
    }

    return {
      assuranceStatus,
      regressionRisk,
      issues,
      recommendations
    };
  }
}
