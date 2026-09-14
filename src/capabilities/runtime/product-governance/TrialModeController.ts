import { TenantSubscription } from './ProductGovernanceTypes';
import { ProductAccessAuditLogger } from './ProductAccessAuditLogger';

export class TrialModeController {
  static checkTrialExpiration(subscription: TenantSubscription): boolean {
    if (subscription.status !== 'TRIAL' || !subscription.endDate) return false;

    const now = new Date();
    const endDate = new Date(subscription.endDate);

    if (now > endDate) {
      subscription.status = 'PAST_DUE';
      ProductAccessAuditLogger.logEvent(
        subscription.tenantId,
        'TRIAL_EXPIRED',
        'SYSTEM',
        'Trial expirou institucionalmente e a conta foi suspensa passivamente.'
      );
      return true; // Expirou
    }

    return false; // Ativo
  }

  static isTrial(subscription: TenantSubscription): boolean {
    return subscription.status === 'TRIAL';
  }
}
