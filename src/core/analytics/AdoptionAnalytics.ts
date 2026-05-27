import { DataAccessContext } from '../security/data-access-context';
import { OnboardingEngine } from '../onboarding/OnboardingEngine';
import { BoardWorkflowLayer } from '../workflows/BoardWorkflowLayer';

export interface TenantAdoptionMetrics {
  onboardingCompletionRate: number; // 0 to 100
  advisoryEngagementIndex: number; // 0 to 100
  simulationAdoptionRate: number; // 0 to 100
  observabilityUsageCount: number;
  workflowParticipationIndex: number;
  governanceDisciplineScore: number;
  executiveResponsivenessIndex: number;
}

export class AdoptionAnalytics {
  /**
   * Calculates adoption metrics for a tenant, strictly respecting tenant isolation boundaries.
   */
  public static getMetrics(context: DataAccessContext, targetTenantId: string): TenantAdoptionMetrics {
    if (!context || !context.tenantId) {
      throw new Error('Acesso negado: Contexto incompleto.');
    }

    const isSuperAdmin = context.role === 'SUPER_ADMIN';

    // If not SUPER_ADMIN, block cross-tenant queries
    if (!isSuperAdmin && context.tenantId !== targetTenantId) {
      throw new Error('[Adoption Analytics] Rejeitado: Acesso cross-tenant negado.');
    }

    // Retrieve onboarding state for this tenant
    const onboarding = OnboardingEngine.getOnboardingState(targetTenantId);

    // Calculate rates
    let onboardingCheckmarks = 0;
    if (onboarding.isolationValidated) onboardingCheckmarks++;
    if (onboarding.topologyValidated) onboardingCheckmarks++;
    if (onboarding.entityScopeConfigured) onboardingCheckmarks++;
    if (onboarding.minRolesAssigned) onboardingCheckmarks++;
    if (onboarding.telemetryActive) onboardingCheckmarks++;
    if (onboarding.observabilityActive) onboardingCheckmarks++;
    if (onboarding.initialBalanceSheetBalanced) onboardingCheckmarks++;
    if (onboarding.advisoryRuntimeOperational) onboardingCheckmarks++;

    const onboardingCompletionRate = Math.round((onboardingCheckmarks / 8) * 100);

    // Default mock data to represent calculations based on actual collections
    return {
      onboardingCompletionRate,
      advisoryEngagementIndex: onboarding.advisoryRuntimeOperational ? 85 : 0,
      simulationAdoptionRate: onboarding.governanceReadiness ? 75 : 10,
      observabilityUsageCount: onboarding.observabilityActive ? 42 : 0,
      workflowParticipationIndex: 90,
      governanceDisciplineScore: onboarding.governanceReadiness ? 95 : 30,
      executiveResponsivenessIndex: 80
    };
  }
}
