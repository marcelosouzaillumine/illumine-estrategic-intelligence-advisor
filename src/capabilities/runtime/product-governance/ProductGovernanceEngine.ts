import { FeatureId, QuotaId, TenantSubscription } from './ProductGovernanceTypes';
import { SubscriptionScopeGuard } from './SubscriptionScopeGuard';
import { UsageQuotaEngine } from './UsageQuotaEngine';
import { TrialModeController } from './TrialModeController';
import { DemoModeGovernance } from './DemoModeGovernance';
import { ProductAccessAuditLogger } from './ProductAccessAuditLogger';

/**
 * MOCK: Simula a assinatura atual injetada via contexto.
 * Na Fase 16, usaremos isso em-memória sob o plano PROFESSIONAL para validar.
 */
const mockActiveSubscription: TenantSubscription = {
  tenantId: 'TENANT-HQ',
  planId: 'PROFESSIONAL',
  status: 'ACTIVE',
  startDate: new Date().toISOString(),
  quotasState: {
    MAX_SCENARIOS: 5, // Quota já excedida para testar bloqueio
    MAX_UPLOADS: 12,
    MAX_BOARD_PACKS: 0,
    MAX_MONITORING_CYCLES: 1,
    MAX_WORKSPACES: 1
  },
  isDemo: false
};

export class ProductGovernanceEngine {
  /**
   * Ponto único de entrada da UI para solicitar acesso a uma Feature.
   */
  static requestFeatureAccess(tenantId: string, featureId: FeatureId): boolean {
    const sub = this.getSubscription(tenantId);
    if (!sub) return false;

    if (TrialModeController.checkTrialExpiration(sub)) return false;

    return SubscriptionScopeGuard.authorizeFeature(sub, featureId);
  }

  /**
   * Ponto único de entrada do Runtime para consumir uma Quota.
   */
  static requestQuotaConsumption(tenantId: string, quotaId: QuotaId, amount: number = 1): boolean {
    const sub = this.getSubscription(tenantId);
    if (!sub) return false;

    if (TrialModeController.checkTrialExpiration(sub)) return false;

    return UsageQuotaEngine.attemptConsume(sub, quotaId, amount);
  }

  static getSubscription(tenantId: string): TenantSubscription | null {
    // MVP Mock implementation
    if (tenantId === mockActiveSubscription.tenantId) {
      return mockActiveSubscription;
    }
    return null;
  }

  static getQuotaStatus(tenantId: string, quotaId: QuotaId) {
    const sub = this.getSubscription(tenantId);
    if (!sub) return { limit: 0, consumed: 0 };
    return UsageQuotaEngine.getQuotaStatus(sub, quotaId);
  }
}
