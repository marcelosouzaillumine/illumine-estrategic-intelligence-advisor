import { DecisionStatus } from './contracts/DecisionStatus';

export interface DecisionRecord {
  id: string;
  decisionTopic: string;
  alternativesEvaluated: string[];
  chosenPath?: string;
  expectedImpact: string;
  monitoringIndicators: string[];
  status: DecisionStatus;
  reviewDate?: string;
}

export class ExecutiveDecisionMemory {
  private decisions: DecisionRecord[] = [];

  public logDecisionExploration(topic: string, alternatives: string[]): DecisionRecord {
    const decision: DecisionRecord = {
      id: `dec_${Date.now()}`,
      decisionTopic: topic,
      alternativesEvaluated: alternatives,
      expectedImpact: 'TBD',
      monitoringIndicators: [],
      status: DecisionStatus.EXPLORING
    };
    this.decisions.push(decision);
    return decision;
  }

  public registerHumanDecision(id: string, chosenPath: string, expectedImpact: string, indicators: string[], reviewDate: string): DecisionRecord | null {
    const decision = this.decisions.find(d => d.id === id);
    if (!decision) return null;

    decision.chosenPath = chosenPath;
    decision.expectedImpact = expectedImpact;
    decision.monitoringIndicators = indicators;
    decision.status = DecisionStatus.APPROVED_BY_HUMAN;
    decision.reviewDate = reviewDate;

    return decision;
  }

  public getDecision(id: string): DecisionRecord | undefined {
    return this.decisions.find(d => d.id === id);
  }
}
