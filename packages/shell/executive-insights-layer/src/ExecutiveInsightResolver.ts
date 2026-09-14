import { Score } from '@illumine/core-primitives';
import { ExecutiveInsightSummary } from './ExecutiveInsightSummary';

export class ExecutiveInsightResolver {
  public static resolveForPage(pageContext: string): ExecutiveInsightSummary {
    return {
      pageContext,
      opportunities: ['3 oportunidades identificadas no portfólio comercial'],
      risks: ['2 riscos monitorados em liquidez e fornecedores'],
      recommendedDecisions: ['1 decisão recomendada: renegociação contratual'],
      priority: 'High',
      confidence: Score.create(95),
      evidenceCount: 5
    };
  }
}

export class ExecutiveInsightsLayer {
  public static renderHeaderSummary(pageContext: string): ExecutiveInsightSummary {
    return ExecutiveInsightResolver.resolveForPage(pageContext);
  }
}
