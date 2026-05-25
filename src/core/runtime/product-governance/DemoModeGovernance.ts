import { TenantSubscription } from './ProductGovernanceTypes';
import { ProductAccessAuditLogger } from './ProductAccessAuditLogger';

export class DemoModeGovernance {
  static enforceDemoIsolation(subscription: TenantSubscription): boolean {
    if (!subscription.isDemo) return true;

    // Em modo demo, certas publicações reais no backend seriam interceptadas aqui.
    // Exemplo: não pode rodar benchmark contra a rede real se for tenant demo.
    return false;
  }

  static resetDemo(subscription: TenantSubscription) {
    if (!subscription.isDemo) return;
    
    // Limpa quotas e dados fictícios
    subscription.quotasState = {} as any;
    
    ProductAccessAuditLogger.logEvent(
      subscription.tenantId,
      'DEMO_RESET' as any,
      'SYSTEM',
      'Ambiente demonstrativo resetado para estado virgem.'
    );
  }
}
