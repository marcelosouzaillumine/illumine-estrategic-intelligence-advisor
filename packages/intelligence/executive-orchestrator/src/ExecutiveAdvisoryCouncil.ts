import { Identifier, Score } from '@illumine/core-primitives';
import { AgentRecommendation } from '@illumine/agent-runtime';

export interface UnifiedExecutiveAdvisoryBrief {
  readonly briefId: Identifier;
  readonly triggerId: Identifier;
  readonly primaryDomain: string;
  readonly participatingAgents: string[];
  readonly consolidatedRecommendations: AgentRecommendation[];
  readonly overallConfidenceScore: Score;
  readonly executiveSummary: string;
}

export class ExecutiveAdvisoryCouncil {
  public static coordinateCouncil(
    triggerId: Identifier,
    primaryDomain: string,
    recommendations: AgentRecommendation[]
  ): UnifiedExecutiveAdvisoryBrief {
    const agents = Array.from(new Set(recommendations.map(r => r.agentId)));

    return {
      briefId: `brief-council-${Date.now()}`,
      triggerId,
      primaryDomain,
      participatingAgents: agents,
      consolidatedRecommendations: recommendations,
      overallConfidenceScore: Score.create(93),
      executiveSummary: `Conselho Executivo Multi-Agente consolidou ${recommendations.length} pareceres para deliberação fiduciária.`
    };
  }
}
