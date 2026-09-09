import { CopilotResponse } from './ExecutiveCopilotEngine';
import { CopilotContextResolver, ActiveInteractionContext } from './CopilotContextResolver';

export class ExecutiveCopilotExperience {
  public static processUserPrompt(
    prompt: string,
    context: ActiveInteractionContext
  ): CopilotResponse {
    const focusArea = context.activeMetric || context.currentPage;
    return {
      primaryCause: `Análise contextual de "${prompt}" sobre ${focusArea}: variação decorrente de insumos e margem.`,
      evidenceSummaries: [`Evidência 1 de ${focusArea}`, `Evidência 2 de ${focusArea}`],
      consultedAgents: ['cfo-governance-agent', 'controller-agent'],
      recommendationText: `Recomenda-se plano de ação para ${focusArea}`,
      expectedImpactSummary: '+250 bps de margem',
      confidenceScore: { value: 95 } as any
    };
  }
}
