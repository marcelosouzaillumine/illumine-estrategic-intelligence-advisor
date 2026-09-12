import { ExecutiveIntent } from '../../executive-semantic-layer/src/IntentResolver';

export class ExecutiveResponseTemplates {
  /**
   * Catálogo Institucional de Modelos de Resposta por Intenção.
   * Garante que a experiência do usuário seja uniforme, independente do agente.
   */
  static apply(intent: ExecutiveIntent, rawContent: string): string {
    switch (intent) {
      case ExecutiveIntent.PAGE_PURPOSE:
        return `## Visão Geral da Página\n\n${rawContent}\n\n**Uso Estratégico:** Esta visualização foi desenhada para apoiar decisões diretivas rápidas e seguras.`;
      case ExecutiveIntent.KPI_EXPLANATION:
        return `## Análise do Indicador\n\n${rawContent}\n\n**Atenção:** Monitorar a volatilidade desta métrica é crucial para a resiliência corporativa.`;
      case ExecutiveIntent.RISK_ANALYSIS:
        return `## Fatores de Risco Detectados\n\n${rawContent}\n\n**Recomendação:** Debater os apontamentos acima na próxima reunião de comitê.`;
      case ExecutiveIntent.RECOMMENDATION:
        return `## Ações Recomendadas\n\n${rawContent}`;
      case ExecutiveIntent.EXECUTIVE_SUMMARY:
        return `## Resumo Executivo\n\n${rawContent}`;
      default:
        return `## Análise Executiva\n\n${rawContent}`;
    }
  }
}
