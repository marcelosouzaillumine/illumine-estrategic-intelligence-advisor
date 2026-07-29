import { Score } from '@illumine/core-primitives';

export interface CopilotResponse {
  readonly primaryCause: string;
  readonly evidenceSummaries: string[];
  readonly consultedAgents: string[];
  readonly recommendationText: string;
  readonly expectedImpactSummary: string;
  readonly confidenceScore: Score;
}

export class ExecutiveCopilotEngine {
  public static answerContextualQuestion(question: string, domainContext: string): CopilotResponse {
    return {
      primaryCause: `Análise causal em ${domainContext}: desvio operacional em custos primários`,
      evidenceSummaries: ['CMV +8%', 'Produto X abaixo da margem', 'Fornecedor principal reajustou em 12%'],
      consultedAgents: ['cfo-intelligence-agent', 'controller-agent', 'operations-agent'],
      recommendationText: 'Executar plano de recuperação de margem e renegociação com fornecedores',
      expectedImpactSummary: '+350 bps de margem EBITDA',
      confidenceScore: Score.create(94)
    };
  }
}
