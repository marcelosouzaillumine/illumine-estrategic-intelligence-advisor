import { ExecutiveContextEnvelope, IntelligenceRouteContract } from '@illumine/executive-contracts';
import { IntelligenceCapabilityRegistry } from './IntelligenceCapabilityRegistry';

export class IntelligenceRoutingEngine {
  public static routeContext(context: ExecutiveContextEnvelope): IntelligenceRouteContract {
    const targetCapability = IntelligenceCapabilityRegistry.resolveCapabilityForDomain(context.activeDomain);

    if (!targetCapability) {
      throw new Error(`Nenhuma capacidade registrada ativa para o domínio: ${context.activeDomain}`);
    }

    return {
      routeId: `route-${context.contextId}`,
      targetCapability,
      routeReason: `Roteamento dinâmico via Registry para ${targetCapability.name}`,
      isRouteActive: true
    };
  }
}
