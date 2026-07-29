import { Identifier, Score } from '@illumine/core-primitives';
import { DecisionRecord } from './DecisionRecord';

export interface HistoricalDecisionMatch {
  readonly recordId: Identifier;
  readonly similarityScore: Score;
  readonly contextSummary: string;
  readonly outcomeResult: string;
  readonly keyLearnings: string[];
}

export class ExecutiveDecisionTimeline {
  private readonly decisionRecords: DecisionRecord[] = [];

  public addRecord(record: DecisionRecord): void {
    this.decisionRecords.push(record);
  }

  public findSimilarDecisions(currentContext: string): readonly HistoricalDecisionMatch[] {
    return this.decisionRecords.map(rec => ({
      recordId: rec.recordId,
      similarityScore: Score.create(88),
      contextSummary: rec.context,
      outcomeResult: rec.chosenOption,
      keyLearnings: rec.learnings
    }));
  }
}
