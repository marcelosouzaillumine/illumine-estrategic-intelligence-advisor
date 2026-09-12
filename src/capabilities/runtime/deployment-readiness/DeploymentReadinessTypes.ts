// src/core/runtime/deployment-readiness/DeploymentReadinessTypes.ts

import { RuntimeOutputBase } from '../../../core/runtime/shared/runtime-contracts';
import { ExecutiveIntelligenceReport } from '../../../core/runtime/executive-intelligence-runtime';

export type DeploymentEnvironment = 'PRODUCTION' | 'PILOT' | 'DEVELOPMENT' | 'LOCAL';
export type ExecutiveAccessRole = 'MASTER_SUPERVISOR' | 'FIDUCIARY_AUDITOR' | 'TENANT_ADMIN' | 'PILOT_OPERATOR' | 'UNAUTHORIZED';

export interface TenantIsolationRuntime {
  tenantId: string;
  isPilotTenant: boolean;
  isProductionTenant: boolean;
  hasCrossTenantAccess: boolean;
}

export interface ReadinessDimension {
  status: 'READY' | 'RESTRICTED' | 'NOT_READY' | 'VALIDATED';
  confidence?: 'HIGH' | 'MODERATE' | 'LOW';
  evidence?: string[];
  blockers?: string[];
  issues?: string[];
  description?: string;
}

export interface InstitutionalReadinessMatrix {
  productionReadiness: ReadinessDimension;
  fiduciaryReadiness: ReadinessDimension;
  governanceReadiness: ReadinessDimension;
  continuityReadiness: ReadinessDimension;
  observabilityReadiness: ReadinessDimension;
  auditabilityReadiness: ReadinessDimension;
}

export interface DeploymentReadinessInput {
  executiveReport: ExecutiveIntelligenceReport;
  environmentConfiguration: {
    environmentType: DeploymentEnvironment;
    mockFactoriesEnabled: boolean;
    debugModeEnabled: boolean;
    tenantIsolationEnabled: boolean;
    activeSimulations: boolean;
  };
  tenantIsolationRuntime: {
    tenantId: string;
    isPilotTenant: boolean;
    isProductionTenant: boolean;
    hasCrossTenantAccess: boolean;
  };
  runtimeHealthMetrics: {
    testsPassed: boolean;
    typecheckPassed: boolean;
    buildPassed: boolean;
    unresolvedAnomalies: number;
  };
  currentUserRole: string;
  lineageHash: string;
  auditTrail: string[];
}


export interface InstitutionalDeploymentReadinessOutput extends RuntimeOutputBase {
  overallStatus: 'DEPLOYMENT_READY' | 'DEPLOYMENT_BLOCKED' | 'DEPLOYMENT_RESTRICTED';
  productionReadiness: ReadinessDimension | string;
  fiduciaryReadiness: ReadinessDimension;
  governanceReadiness: ReadinessDimension;
  continuityReadiness: ReadinessDimension;
  observabilityReadiness: ReadinessDimension;
  auditabilityReadiness: ReadinessDimension;

  // Legacy compatibility fields
  deploymentReadiness: string;
  deploymentBlocked: boolean;
  blockedDeploymentReasons: string[];
  operationalAssuranceStatus: string;
  environmentIntegrityStatus: string;
  pilotGovernanceStatus: string;
  runtimeIntegrityStatus: string;
  failClosedIntegrityStatus: string;
  runtimeRegressionRisk: string;
  executiveAccessGovernanceStatus: string;
  operationalRecommendations: string[];
  deploymentWarnings: string[];
  readinessNarrative: string;
}
