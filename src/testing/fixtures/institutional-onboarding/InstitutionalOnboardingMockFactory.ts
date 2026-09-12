import { InstitutionalOnboardingInput } from '../../../capabilities/runtime/institutional-onboarding/InstitutionalOnboardingTypes';

export class InstitutionalOnboardingMockFactory {
  public static createDefaultInput(): InstitutionalOnboardingInput {
    // This is STRICTLY for dev/test environments.
    return {
      environmentConfiguration: {
        environmentType: (globalThis as any).EFOS_ENV || 'DEVELOPMENT',
        mockFactoriesEnabled: true,
        debugModeEnabled: true,
      },
      deploymentReadinessReport: {
        deploymentReadiness: 'FULL_PRODUCTION_READY',
        deploymentBlocked: false,
      } as any,
      executiveAccessGovernance: {
        currentUserRole: 'MASTER_SUPERVISOR',
      },
      tenantIsolationRuntime: {
        tenantId: 'mock-tenant-123',
        isPilotTenant: false,
        isProductionTenant: true,
        hasCrossTenantAccess: false,
      },
      organizationalMetadata: {
        organizationName: 'Mock Enterprise Inc',
        industry: 'Technology',
        jurisdiction: 'Brazil',
        fiduciaryLevelRequired: 'SOVEREIGN',
      },
      onboardingDocumentation: {
        masterServiceAgreementSigned: true,
        dataProcessingAgreementSigned: true,
        fiduciaryCharterAccepted: true,
        operationalPlaybookGenerated: true,
      },
      institutionalConfiguration: {
        allowedEnvironments: ['DEVELOPMENT', 'PRODUCTION'],
        maxAuthorizedUsers: 10,
        featuresEnabled: ['ALL'],
      },
      operationalChecklist: {
        dataIngestionConfigured: true,
        userRolesMapped: true,
        baselineMetricsEstablished: true,
      },
      pilotGovernanceStatus: {
        pilotApproved: true,
        pilotDurationDays: 90,
        pilotSupervisors: ['admin@mock.com'],
      },
      executiveReport: {
        metadata: { lineageHash: 'mock-hash-abc' },
        failClosedTriggered: false,
        resilienceReport: { confidenceLevel: 'HIGH' },
        regressionReport: { regressionDetected: false }
      } as any,
      auditTrail: ['Mock initialized', 'Mock audit trail loaded'],
      lineageHash: 'mock-hash-abc'
    } as InstitutionalOnboardingInput;
  }
}
