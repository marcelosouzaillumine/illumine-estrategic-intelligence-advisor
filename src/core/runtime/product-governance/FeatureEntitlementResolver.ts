import { FeatureId, FeatureEntitlement, TenantSubscription } from './ProductGovernanceTypes';
import { ProductPlanRegistry } from './ProductPlanRegistry';

export class FeatureEntitlementResolver {
  /**
   * Verifica se o tenant atual tem direito à funcionalidade solicitada baseada no seu plano.
   */
  static resolve(subscription: TenantSubscription, featureId: FeatureId): FeatureEntitlement {
    if (subscription.status !== 'ACTIVE' && subscription.status !== 'TRIAL') {
      return {
        featureId,
        isEnabled: false,
        blockedReason: 'SUBSCRIPTION_INACTIVE'
      };
    }

    const plan = ProductPlanRegistry.getPlan(subscription.planId);
    
    if (!plan) {
      return {
        featureId,
        isEnabled: false,
        blockedReason: 'PLAN_NOT_FOUND'
      };
    }

    const isEnabled = plan.entitlements[featureId] === true;

    return {
      featureId,
      isEnabled,
      blockedReason: isEnabled ? undefined : `Feature ${featureId} requires upgrade from ${plan.name}.`
    };
  }
}
