import { DeploymentReadinessInput, InstitutionalDeploymentReadinessOutput } from './DeploymentReadinessTypes';
import { EnvironmentIntegrityValidationEngine } from './EnvironmentIntegrityValidationEngine';
import { InstitutionalPilotGovernanceEngine } from './InstitutionalPilotGovernanceEngine';
import { RuntimeOperationalAssuranceEngine } from './RuntimeOperationalAssuranceEngine';
import { ExecutiveAccessGovernanceEngine } from './ExecutiveAccessGovernanceEngine';
import { InstitutionalReadinessOrchestrator } from './InstitutionalReadinessOrchestrator';

export class InstitutionalDeploymentReadinessEngine {
  public static evaluate(input: DeploymentReadinessInput): InstitutionalDeploymentReadinessOutput {
    // 1. Run Sub-Engines
    const envValidation = EnvironmentIntegrityValidationEngine.validate(input);
    const pilotValidation = InstitutionalPilotGovernanceEngine.validate(input);
    const opAssurance = RuntimeOperationalAssuranceEngine.validate(input);
    const accessGovernance = ExecutiveAccessGovernanceEngine.validate(input);

    // 2. Aggregate Issues
    const unresolvedCriticalIssues = [
      ...envValidation.issues.filter(i => i.startsWith('CRITICAL:')),
      ...pilotValidation.issues.filter(i => i.startsWith('CRITICAL:')),
      ...opAssurance.issues.filter(i => i.startsWith('CRITICAL:')),
      ...accessGovernance.issues.filter(i => i.startsWith('CRITICAL:')),
    ];

    const deploymentWarnings = [
      ...envValidation.issues.filter(i => i.startsWith('WARNING:')),
      ...pilotValidation.issues.filter(i => i.startsWith('WARNING:')),
      ...opAssurance.issues.filter(i => i.startsWith('WARNING:')),
      ...accessGovernance.issues.filter(i => i.startsWith('WARNING:')),
    ];

    // 3. Determine Readiness Status
    let deploymentReadiness: InstitutionalDeploymentReadinessOutput['deploymentReadiness'] = 'NOT_READY';
    let deploymentBlocked = false;
    let readinessNarrative = '';
    const blockedDeploymentReasons: string[] = [];

    if (unresolvedCriticalIssues.length > 0) {
      deploymentReadiness = 'NOT_READY';
      deploymentBlocked = true;
      blockedDeploymentReasons.push(...unresolvedCriticalIssues);
      readinessNarrative = 'Deployment blocked due to unresolved critical integrity or governance issues.';
    } else {
      // No critical issues, evaluate maximum allowed state
      if (input.environmentConfiguration.environmentType === 'PRODUCTION') {
         // FULL_PRODUCTION_READY checks
         if (
           envValidation.status === 'VALIDATED' &&
           opAssurance.assuranceStatus === 'HIGH' &&
           opAssurance.regressionRisk !== 'CRITICAL' &&
           envValidation.lineageStatus === 'VALIDATED' &&
           envValidation.failClosedStatus === 'VALIDATED'
         ) {
           deploymentReadiness = 'FULL_PRODUCTION_READY';
           readinessNarrative = 'Institutional runtime validated for full production execution.';
         } else {
           deploymentReadiness = 'LIMITED_PRODUCTION_READY';
           readinessNarrative = 'Runtime stable but requires enhanced supervision. Full production readiness not achieved.';
         }
      } else if (input.environmentConfiguration.environmentType === 'PILOT') {
         deploymentReadiness = 'PILOT_READY';
         readinessNarrative = 'Runtime authorized for supervised pilot execution.';
      } else {
         deploymentReadiness = 'NOT_READY';
         deploymentBlocked = true;
         blockedDeploymentReasons.push(`CRITICAL: Deployment requested for non-production environment: ${input.environmentConfiguration.environmentType}`);
         readinessNarrative = 'Non-production environment cannot be cleared for institutional deployment.';
      }
    }

    // Explicit Mocks/Debug Protection
    if (input.environmentConfiguration.environmentType === 'PRODUCTION' &&
       (input.environmentConfiguration.mockFactoriesEnabled || input.environmentConfiguration.debugModeEnabled || input.environmentConfiguration.activeSimulations)) {
       deploymentReadiness = 'NOT_READY';
       deploymentBlocked = true;
       if (!blockedDeploymentReasons.includes('CRITICAL: Mock factories or debug mode active in production.')) {
         blockedDeploymentReasons.push('CRITICAL: Mock factories or debug mode active in production.');
       }
       readinessNarrative = 'Deployment blocked: Artificial environments detected in production.';
    }

    // 4. Calculate Confidence Level
    let confidenceLevel: 'LOW' | 'MODERATE' | 'HIGH' = 'HIGH';
    if (deploymentBlocked || opAssurance.assuranceStatus === 'LOW' || envValidation.lineageStatus === 'INVALID') {
      confidenceLevel = 'LOW';
    } else if (opAssurance.assuranceStatus === 'MODERATE' || envValidation.status === 'UNSAFE' || deploymentWarnings.length > 0) {
      confidenceLevel = 'MODERATE';
    }

    // 5. Orchestrate Readiness Matrix
    const readinessMatrix = InstitutionalReadinessOrchestrator.orchestrate(input);

    return {
      deploymentReadiness,
      deploymentBlocked,
      readinessMatrix,
      runtimeIntegrityStatus: envValidation.status === 'VALIDATED' ? 'VALIDATED' : 'UNSTABLE',
      failClosedIntegrityStatus: envValidation.failClosedStatus,
      lineageValidationStatus: envValidation.lineageStatus,
      operationalAssuranceStatus: opAssurance.assuranceStatus,
      environmentIntegrityStatus: envValidation.status,
      pilotGovernanceStatus: pilotValidation.status,
      executiveAccessGovernanceStatus: accessGovernance.status,
      runtimeRegressionRisk: opAssurance.regressionRisk,
      unresolvedCriticalIssues,
      deploymentWarnings,
      blockedDeploymentReasons,
      operationalRecommendations: opAssurance.recommendations,
      readinessNarrative,
      auditTrail: [
        ...input.auditTrail,
        `[${new Date().toISOString()}] Deployment Readiness Evaluated: ${deploymentReadiness}`,
        `[${new Date().toISOString()}] Blocked Status: ${deploymentBlocked}`
      ],
      lineageHash: input.lineageHash,
      confidenceLevel
    };
  }
}
