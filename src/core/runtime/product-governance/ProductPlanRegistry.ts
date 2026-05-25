import { ProductPlan } from './ProductGovernanceTypes';

export class ProductPlanRegistry {
  private static readonly plans: Record<string, ProductPlan> = {
    STARTER: {
      planId: 'STARTER',
      name: 'Starter',
      description: 'Acesso base fiduciário. Sem rede de inteligência.',
      entitlements: {
        INSTITUTIONAL_BENCHMARKING: false,
        AI_COPILOT_BASIC: false,
        AI_COPILOT_ENTERPRISE: false,
        SCENARIO_RUNTIME: true,
        BOARD_PACK_EXPORT: false,
        CONTINUOUS_MONITORING: false,
        MULTI_TENANT_DASHBOARD: false
      },
      quotas: {
        MAX_SCENARIOS: 3,
        MAX_UPLOADS: 5,
        MAX_BOARD_PACKS: 0,
        MAX_MONITORING_CYCLES: 0,
        MAX_WORKSPACES: 1
      }
    },
    PROFESSIONAL: {
      planId: 'PROFESSIONAL',
      name: 'Professional',
      description: 'Acesso institucional. Sem IA Avançada e sem Benchmarking global.',
      entitlements: {
        INSTITUTIONAL_BENCHMARKING: false, // Bloqueado conforme req MVP
        AI_COPILOT_BASIC: true,
        AI_COPILOT_ENTERPRISE: false, // Bloqueado conforme req MVP
        SCENARIO_RUNTIME: true,
        BOARD_PACK_EXPORT: true,
        CONTINUOUS_MONITORING: true,
        MULTI_TENANT_DASHBOARD: false
      },
      quotas: {
        MAX_SCENARIOS: 5,
        MAX_UPLOADS: 50,
        MAX_BOARD_PACKS: 5,
        MAX_MONITORING_CYCLES: 10,
        MAX_WORKSPACES: 2
      }
    },
    ENTERPRISE: {
      planId: 'ENTERPRISE',
      name: 'Enterprise',
      description: 'Acesso corporativo irrestrito.',
      entitlements: {
        INSTITUTIONAL_BENCHMARKING: true,
        AI_COPILOT_BASIC: true,
        AI_COPILOT_ENTERPRISE: true,
        SCENARIO_RUNTIME: true,
        BOARD_PACK_EXPORT: true,
        CONTINUOUS_MONITORING: true,
        MULTI_TENANT_DASHBOARD: true
      },
      quotas: {
        MAX_SCENARIOS: 9999,
        MAX_UPLOADS: 9999,
        MAX_BOARD_PACKS: 9999,
        MAX_MONITORING_CYCLES: 9999,
        MAX_WORKSPACES: 9999
      }
    }
    // TODO: Adicionar ADVISOR_NETWORK, FAMILY_OFFICE, WHITE_LABEL no futuro.
  };

  static getPlan(planId: string): ProductPlan | null {
    return this.plans[planId] || null;
  }

  static getAllPlans(): ProductPlan[] {
    return Object.values(this.plans);
  }
}
