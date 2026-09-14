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
    subscription.quotasState = ({ MAX_SCENARIOS: 1, MAX_UPLOADS: 1, MAX_BOARD_PACKS: 1, MAX_MONITORING_CYCLES: 1, MAX_WORKSPACES: 1 } as unknown) as Record<import('./ProductGovernanceTypes').QuotaId, number>;
    
    ProductAccessAuditLogger.logEvent(
      subscription.tenantId,
      'DEMO_RESET' as unknown as "DEMO_RESET" | "FEATURE_GRANTED",
      'SYSTEM',
      'Ambiente demonstrativo resetado para estado virgem.'
    );
  }
}
