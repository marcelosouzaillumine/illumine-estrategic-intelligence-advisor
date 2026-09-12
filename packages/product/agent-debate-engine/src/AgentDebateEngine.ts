import { Identifier, Score } from '@illumine/core-primitives';

export type DebateStance = 'AGREE' | 'DISAGREE' | 'COMPLEMENT' | 'REQUEST_EVIDENCE';

export interface AgentOpinion {
  readonly agentId: string;
  readonly stance: DebateStance;
  readonly argumentText: string;
  readonly confidenceScore: Score;
}

export interface DebateSessionSummary {
  readonly debateId: Identifier;
  readonly topic: string;
  readonly opinions: AgentOpinion[];
  readonly convergenceScore: Score;
  readonly synthesizedConsensus: string;
  readonly remainingDivergences: string[];
}

export class AgentDebateEngine {
  public static runDebate(topic: string, opinions: AgentOpinion[]): DebateSessionSummary {
    const agreeCount = opinions.filter(o => o.stance === 'AGREE' || o.stance === 'COMPLEMENT').length;
    const ratio = opinions.length > 0 ? (agreeCount / opinions.length) * 100 : 100;
    const convergenceScore = Score.create(Math.round(ratio));

    return {
      debateId: `deb-${Date.now()}`,
      topic,
      opinions,
      convergenceScore,
      synthesizedConsensus: `Consenso sintetizado com ${convergenceScore.value}% de convergência entre os agentes.`,
      remainingDivergences: opinions.filter(o => o.stance === 'DISAGREE').map(o => o.argumentText)
    };
  }
}
