import { QuotaId, TenantSubscription } from './ProductGovernanceTypes';
import { ProductPlanRegistry } from './ProductPlanRegistry';
import { ProductAccessAuditLogger } from './ProductAccessAuditLogger';

export class UsageQuotaEngine {
  /**
   * Tenta consumir uma quota. Se não houver saldo, bloqueia e loga.
   */
  static attemptConsume(subscription: TenantSubscription, quotaId: QuotaId, amount: number = 1): boolean {
    const plan = ProductPlanRegistry.getPlan(subscription.planId);
    if (!plan) return false;

    const limit = plan.quotas[quotaId] || 0;
    const currentUsage = subscription.quotasState[quotaId] || 0;

    if (currentUsage + amount > limit) {
      ProductAccessAuditLogger.logEvent(
        subscription.tenantId,
        'QUOTA_EXCEEDED',
        quotaId,
        `Tentativa de consumo negada. Limite: ${limit}. Uso atual: ${currentUsage}. Solicitado: ${amount}.`
      );
      return false; // Bloqueio institucional
    }

    // Se aprovado, consome no memory state da subscrição (MVP volátil)
    subscription.quotasState[quotaId] = currentUsage + amount;

    ProductAccessAuditLogger.logEvent(
      subscription.tenantId,
      'QUOTA_CONSUMED',
      quotaId,
      `Quota consumida: +${amount}. Uso atual: ${subscription.quotasState[quotaId]}/${limit}.`
    );

    return true;
  }

  static getQuotaStatus(subscription: TenantSubscription, quotaId: QuotaId): { limit: number; consumed: number } {
    const plan = ProductPlanRegistry.getPlan(subscription.planId);
    return {
      limit: plan?.quotas[quotaId] || 0,
      consumed: subscription.quotasState[quotaId] || 0
    };
  }
}
