import { ExecutiveIntelligenceReport } from '../executive-intelligence-runtime';
import { InstitutionalSurvivalOutput } from '../institutional-survival/SurvivalTypes';
import { InstitutionalRecoveryOutput } from '../institutional-recovery/RecoveryTypes';
import { InstitutionalResilienceOutput } from '../institutional-resilience/ResilienceTypes';
import { RecoveryRegressionOutput } from '../recovery-regression/RecoveryRegressionTypes';

export type DeploymentEnvironment = 'LOCAL' | 'DEVELOPMENT' | 'STAGING' | 'PILOT' | 'PRODUCTION';
export type ExecutiveAccessRole = 'MASTER_SUPERVISOR' | 'TENANT_ADMIN' | 'EXECUTIVE_USER' | 'FIDUCIARY_AUDITOR' | 'PILOT_OPERATOR';

export interface EnvironmentConfiguration {
  environmentType: DeploymentEnvironment;
  mockFactoriesEnabled: boolean;
  debugModeEnabled: boolean;
  tenantIsolationEnabled: boolean;
  activeSimulations: boolean;
}

export interface TenantIsolationRuntime {
  tenantId: string;
  isPilotTenant: boolean;
  isProductionTenant: boolean;
  hasCrossTenantAccess: boolean;
}

export interface RuntimeHealthMetrics {
  testsPassed: boolean;
  typecheckPassed: boolean;
  buildPassed: boolean;
  unresolvedAnomalies: number;
}

export interface DeploymentReadinessInput {
  executiveReport: ExecutiveIntelligenceReport;
  environmentConfiguration: EnvironmentConfiguration;
  tenantIsolationRuntime: TenantIsolationRuntime;
  runtimeHealthMetrics: RuntimeHealthMetrics;
  currentUserRole: ExecutiveAccessRole;
  lineageHash: string;
  auditTrail: string[];
}

export interface InstitutionalDeploymentReadinessOutput {
  deploymentReadiness:
    | 'NOT_READY'
    | 'PILOT_READY'
    | 'LIMITED_PRODUCTION_READY'
    | 'FULL_PRODUCTION_READY';
  
  deploymentBlocked: boolean;
  
  runtimeIntegrityStatus:
    | 'UNSTABLE'
    | 'STABLE'
    | 'VALIDATED';
  
  failClosedIntegrityStatus:
    | 'BROKEN'
    | 'PARTIAL'
    | 'VALIDATED';
  
  lineageValidationStatus:
    | 'INVALID'
    | 'PARTIAL'
    | 'VALIDATED';
  
  operationalAssuranceStatus:
    | 'LOW'
    | 'MODERATE'
    | 'HIGH';
  
  environmentIntegrityStatus:
    | 'UNSAFE'
    | 'ISOLATED'
    | 'VALIDATED';
  
  pilotGovernanceStatus:
    | 'INACTIVE'
    | 'ACTIVE'
    | 'VALIDATED';
  
  executiveAccessGovernanceStatus:
    | 'WEAK'
    | 'CONTROLLED'
    | 'VALIDATED';
  
  runtimeRegressionRisk:
    | 'LOW'
    | 'MODERATE'
    | 'HIGH'
    | 'CRITICAL';
  
  unresolvedCriticalIssues: string[];
  deploymentWarnings: string[];
  blockedDeploymentReasons: string[];
  operationalRecommendations: string[];
  readinessNarrative: string;
  auditTrail: string[];
  lineageHash: string;
  
  confidenceLevel:
    | 'LOW'
    | 'MODERATE'
    | 'HIGH';
  
  readinessMatrix?: InstitutionalReadinessMatrix;
}

export interface ReadinessDimension {
  status: 'VALIDATED' | 'NOT_READY';
  issues: string[];
  description: string;
}

export interface InstitutionalReadinessMatrix {
  productionReadiness: ReadinessDimension;
  fiduciaryReadiness: ReadinessDimension;
  governanceReadiness: ReadinessDimension;
  continuityReadiness: ReadinessDimension;
  observabilityReadiness: ReadinessDimension;
  auditabilityReadiness: ReadinessDimension;
}

