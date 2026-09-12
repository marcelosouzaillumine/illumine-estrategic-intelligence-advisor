import { ExecutiveIntent } from '../../executive-semantic-layer/src/IntentResolver';

export class ExecutiveAgentRouter {
  static async route(intent: ExecutiveIntent, domain: string | null, rawQuery: string): Promise<string> {
    const safeDomain = domain?.toLowerCase();
    
    // O agente gera uma resposta técnica baseada na intent, no domínio e na query bruta.
    // Esta saída conterá JSONs, metadados e termos de arquitetura interna, que depois 
    // serão filtrados pelas camadas subsequentes.
    const technicalRawPayload = `
      [AGENT_INTERNAL_START]
      Domain: ${safeDomain || 'None'}
      MatchedIntent: ${intent}
      OriginalQuery: ${rawQuery}
      SystemPrompt: You are an internal technical agent. Use registries to map data.
      RegistryPayload: { "pageId": "123", "status": "active" }
      BreadcrumbPath: /sys/nav/app
      [AGENT_INTERNAL_END]
      O agente financeiro/governança determinou que os indicadores principais estão estáveis.
      A finalidade da tela envolve KPIs de resiliência.
    `;

    return technicalRawPayload;
  }
}
