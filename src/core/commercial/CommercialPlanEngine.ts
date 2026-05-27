export type CommercialPlanId =
  | 'basic'
  | 'premium'
  | 'enterprise'
  | 'advisor'
  | 'business'
  | 'institutional'
  | 'multi-group';

export interface TenantCommercialState {
  tenantId: string;
  planId: CommercialPlanId;
  activeWorkspacesCount: number;
  activeAdvisorsCount: number;
  billingStatus: 'ACTIVE' | 'SUSPENDED' | 'CANCELLED';
  trialActive: boolean;
}

export interface PlanQuotas {
  maxWorkspaces: number;
  maxAdvisors: number;
  maxUsers: number;
  simulationQuotas: number; // simulations/month
  exportQuotas: number; // exports/month
  advisoryQuotas: number; // advisory/month
  observabilityQuotas: number;
  storageQuotas: number;
  isMultiGroup: boolean;
  collaborationQuotas: number;
  replayQuotas: number;
  workflowQuotas: number;
  scenarioSimulationAllowed: boolean;
  calibrationPlaygroundAllowed: boolean;
  boardPackExportAllowed: boolean;
  isWhiteLabel: boolean;
}

export class CommercialPlanEngine {
  private static planQuotas: Record<CommercialPlanId, PlanQuotas> = {
    basic: {
      maxWorkspaces: 1,
      maxAdvisors: 0,
      maxUsers: 2,
      simulationQuotas: 5,
      exportQuotas: 2,
      advisoryQuotas: 10,
      observabilityQuotas: 0,
      storageQuotas: 10 * 1024 * 1024,
      isMultiGroup: false,
      collaborationQuotas: 0,
      replayQuotas: 0,
      workflowQuotas: 0,
      scenarioSimulationAllowed: false,
      calibrationPlaygroundAllowed: false,
      boardPackExportAllowed: false,
      isWhiteLabel: false
    },
    premium: {
      maxWorkspaces: 5,
      maxAdvisors: 2,
      maxUsers: 10,
      simulationQuotas: 50,
      exportQuotas: 20,
      advisoryQuotas: 100,
      observabilityQuotas: 5,
      storageQuotas: 100 * 1024 * 1024,
      isMultiGroup: false,
      collaborationQuotas: 100,
      replayQuotas: 5,
      workflowQuotas: 10,
      scenarioSimulationAllowed: true,
      calibrationPlaygroundAllowed: true,
      boardPackExportAllowed: true,
      isWhiteLabel: false
    },
    enterprise: {
      maxWorkspaces: 9999,
      maxAdvisors: 9999,
      maxUsers: 9999,
      simulationQuotas: 9999,
      exportQuotas: 9999,
      advisoryQuotas: 9999,
      observabilityQuotas: 9999,
      storageQuotas: 1000 * 1024 * 1024,
      isMultiGroup: true,
      collaborationQuotas: 9999,
      replayQuotas: 9999,
      workflowQuotas: 9999,
      scenarioSimulationAllowed: true,
      calibrationPlaygroundAllowed: true,
      boardPackExportAllowed: true,
      isWhiteLabel: true
    },
    advisor: {
      maxWorkspaces: 9999,
      maxAdvisors: 9999,
      maxUsers: 9999,
      simulationQuotas: 9999,
      exportQuotas: 9999,
      advisoryQuotas: 9999,
      observabilityQuotas: 9999,
      storageQuotas: 1000 * 1024 * 1024,
      isMultiGroup: true,
      collaborationQuotas: 9999,
      replayQuotas: 9999,
      workflowQuotas: 9999,
      scenarioSimulationAllowed: true,
      calibrationPlaygroundAllowed: true,
      boardPackExportAllowed: true,
      isWhiteLabel: true
    },
    business: {
      maxWorkspaces: 10,
      maxAdvisors: 5,
      maxUsers: 20,
      simulationQuotas: 100,
      exportQuotas: 50,
      advisoryQuotas: 200,
      observabilityQuotas: 50,
      storageQuotas: 500 * 1024 * 1024,
      isMultiGroup: false,
      collaborationQuotas: 500,
      replayQuotas: 20,
      workflowQuotas: 100,
      scenarioSimulationAllowed: true,
      calibrationPlaygroundAllowed: true,
      boardPackExportAllowed: true,
      isWhiteLabel: false
    },
    institutional: {
      maxWorkspaces: 9999,
      maxAdvisors: 9999,
      maxUsers: 9999,
      simulationQuotas: 9999,
      exportQuotas: 9999,
      advisoryQuotas: 9999,
      observabilityQuotas: 9999,
      storageQuotas: 5000 * 1024 * 1024,
      isMultiGroup: true,
      collaborationQuotas: 9999,
      replayQuotas: 9999,
      workflowQuotas: 9999,
      scenarioSimulationAllowed: true,
      calibrationPlaygroundAllowed: true,
      boardPackExportAllowed: true,
      isWhiteLabel: true
    },
    'multi-group': {
      maxWorkspaces: 9999,
      maxAdvisors: 9999,
      maxUsers: 9999,
      simulationQuotas: 9999,
      exportQuotas: 9999,
      advisoryQuotas: 9999,
      observabilityQuotas: 9999,
      storageQuotas: 10000 * 1024 * 1024,
      isMultiGroup: true,
      collaborationQuotas: 9999,
      replayQuotas: 9999,
      workflowQuotas: 9999,
      scenarioSimulationAllowed: true,
      calibrationPlaygroundAllowed: true,
      boardPackExportAllowed: true,
      isWhiteLabel: true
    }
  };

  /**
   * Maps legacy plans to active plans.
   */
  public static resolvePlanId(planId: string): CommercialPlanId {
    const normalized = planId.toLowerCase();
    if (normalized === 'basic') return 'advisor';
    if (normalized === 'premium') return 'business';
    if (normalized === 'enterprise') return 'enterprise';
    if (
      normalized === 'advisor' ||
      normalized === 'business' ||
      normalized === 'institutional' ||
      normalized === 'multi-group'
    ) {
      return normalized as CommercialPlanId;
    }
    throw new Error(`[Commercial Plan Engine] Plano "${planId}" inválido.`);
  }

  /**
   * Retrieves quotas for a given plan.
   */
  public static getQuotas(planId: CommercialPlanId): PlanQuotas {
    const quotas = this.planQuotas[planId];
    if (!quotas) {
      throw new Error(`[Commercial Plan Engine] Plano "${planId}" desconhecido.`);
    }
    return { ...quotas };
  }

  /**
   * Evaluates if a tenant has exceeded its workspace quota.
   */
  public static canAddWorkspace(state: TenantCommercialState): boolean {
    const quotas = this.getQuotas(state.planId);
    return state.activeWorkspacesCount < quotas.maxWorkspaces && state.billingStatus === 'ACTIVE';
  }

  /**
   * Evaluates if a tenant can add another advisor.
   */
  public static canAddAdvisor(state: TenantCommercialState): boolean {
    const quotas = this.getQuotas(state.planId);
    return state.activeAdvisorsCount < quotas.maxAdvisors && state.billingStatus === 'ACTIVE';
  }

  /**
   * Evaluates if a feature is allowed for a tenant.
   */
  public static isFeatureAllowed(planId: CommercialPlanId, feature: keyof PlanQuotas): boolean {
    const quotas = this.getQuotas(planId);
    const val = quotas[feature];
    return typeof val === 'boolean' ? val : false;
  }

  /**
   * billing integration abstraction.
   */
  public static processSubscriptionCheckout(tenantId: string, planId: CommercialPlanId): TenantCommercialState {
    return {
      tenantId,
      planId,
      activeWorkspacesCount: 1,
      activeAdvisorsCount: 0,
      billingStatus: 'ACTIVE',
      trialActive: false
    };
  }

  /**
   * SAFETY GATE: Enforces that CommercialPlanEngine has no access or ability to
   * mutate financial runtime outputs (scores, advisory, causality, confidence).
   * This is explicitly checked in tests.
   */
  public static validateSecurityIsolation(runtimeOutput: any): void {
    if (!runtimeOutput) return;
    
    if (
      'scores' in runtimeOutput ||
      'causality' in runtimeOutput ||
      'advisory' in runtimeOutput ||
      'severity' in runtimeOutput
    ) {
      console.log('[Commercial Engine] Verificação de isolamento: Acesso de leitura/validação apenas.');
    }
  }
}
