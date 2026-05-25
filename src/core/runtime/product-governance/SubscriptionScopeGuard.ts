import { FeatureId, QuotaId, TenantSubscription } from './ProductGovernanceTypes';
import { FeatureEntitlementResolver } from './FeatureEntitlementResolver';
import { UsageQuotaEngine } from './UsageQuotaEngine';
import { ProductAccessAuditLogger } from './ProductAccessAuditLogger';

export class SubscriptionScopeGuard {
  /**
   * Garante que uma funcionalidade pode ser executada baseada no escopo da assinatura.
   * Não altera os dados, apenas diz SIM ou NÃO e loga se for bloqueado.
   */
  static authorizeFeature(subscription: TenantSubscription, featureId: FeatureId): boolean {
    const entitlement = FeatureEntitlementResolver.resolve(subscription, featureId);
    
    if (!entitlement.isEnabled) {
      ProductAccessAuditLogger.logEvent(
        subscription.tenantId,
        'FEATURE_BLOCKED',
        featureId,
        entitlement.blockedReason || 'Blocked by Subscription Scope'
      );
      return false;
    }
    
    // Sucesso log é muito verboso para todas as chamadas de renderização, logamos apenas bloqueios na leitura.
    return true;
  }

  /**
   * Valida se uma cota está livre antes de uma transação.
   */
  static verifyQuotaAvailable(subscription: TenantSubscription, quotaId: QuotaId, amount: number = 1): boolean {
    const status = UsageQuotaEngine.getQuotaStatus(subscription, quotaId);
    if (status.consumed + amount > status.limit) {
      // Não consumimos aqui, apenas validamos se PODE consumir
      return false;
    }
    return true;
  }
}
