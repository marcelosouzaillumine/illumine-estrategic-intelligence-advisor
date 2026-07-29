import { licenseManager } from '../../packages/subscription/src/index';

export function testSubscriptionFlow(): boolean {
  const sub = licenseManager.createSubscription('tnt-globex', 'ENTERPRISE');

  if (sub.plan !== 'ENTERPRISE' || sub.limits.maxUsers !== 9999) {
    throw new Error('Falha no plano de assinatura Enterprise');
  }

  const allowed = licenseManager.isFeatureAllowed('tnt-globex', 'ai-advisor');
  if (!allowed) {
    throw new Error('Feature AI Advisor deveria estar liberada no plano Enterprise');
  }

  return true;
}
