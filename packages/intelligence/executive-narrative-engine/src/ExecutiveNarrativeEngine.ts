import { Identifier, Score } from '@illumine/core-primitives';
import { AgentEvidenceBundle } from '@illumine/agent-runtime';

export type ExecutiveBriefType =
  | 'Executive Brief'
  | 'Board Brief'
  | 'Committee Brief'
  | 'Risk Brief'
  | 'Investment Brief'
  | 'Operational Brief'
  | 'Weekly Brief'
  | 'Monthly Brief'
  | 'Quarterly Brief';

export interface ExecutiveNarrativeReport {
  readonly narrativeId: Identifier;
  readonly briefType: ExecutiveBriefType;
  readonly whatHappened: string;
  readonly whyItHappened: string;
  readonly contributingFactors: string[];
  readonly risksIdentified: string[];
  readonly inactionConsequence: string;
  readonly recommendedDecision: string;
  readonly expectedImpactSummary: string;
  readonly confidenceScore: Score;
  readonly evidenceBundle: AgentEvidenceBundle;
}

export class ExecutiveNarrativeEngine {
  public static generateNarrative(
    briefType: ExecutiveBriefType,
    context: string,
    insight: string,
    recommendation: string
  ): ExecutiveNarrativeReport {
    return {
      narrativeId: `narr-${Date.now()}`,
      briefType,
      whatHappened: `Compressão observada no indicador em ${context}`,
      whyItHappened: `Variação dos fatores de entrada conforme análise causal`,
      contributingFactors: ['Custo de matérias-primas', 'Desvio na taxa de conversão'],
      risksIdentified: ['Redução no fluxo de caixa livre'],
      inactionConsequence: 'Deterioração adicional de 12% na margem em 2 trimestres',
      recommendedDecision: recommendation,
      expectedImpactSummary: 'Recuperação estimada de 350 bps de margem',
      confidenceScore: Score.create(94),
      evidenceBundle: { bundleId: 'b-narr-01', metricCodes: ['MARGIN'], factSummaries: [insight], lineageHash: 'sha-narr-01' }
    };
  }
}
