import { Identifier, Score } from '@illumine/core-primitives';
import { AgentRecommendation } from '@illumine/agent-runtime';

export interface ExecutiveDecisionCard {
  readonly cardId: Identifier;
  readonly title: string;
  readonly financialImpactBrl: number;
  readonly strategicAlignmentScore: Score;
  readonly operationalImpactScore: Score;
  readonly consultedAgents: string[];
  readonly confidenceScore: Score;
  readonly riskLevel: AgentRecommendation['riskLevel'];
  readonly priorityClassification: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  readonly evidenceSummary: string;
  readonly recommendationText: string;
  readonly status: 'DRAFT' | 'UNDER_REVIEW' | 'APPROVED' | 'EXECUTED';
}

export class ExecutiveDecisionWorkspace {
  private readonly decisionCards: ExecutiveDecisionCard[] = [];

  public registerDecisionCard(card: ExecutiveDecisionCard): void {
    this.decisionCards.push(card);
  }

  public getDecisionCards(): readonly ExecutiveDecisionCard[] {
    return this.decisionCards;
  }
}
