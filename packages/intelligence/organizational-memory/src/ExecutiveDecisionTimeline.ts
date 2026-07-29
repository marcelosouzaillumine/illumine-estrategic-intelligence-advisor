import { Identifier, Score } from '@illumine/core-primitives';
import { ExperienceRecord } from './memory/ExperienceRecord';

export interface HistoricalDecisionMatch {
  readonly recordId: Identifier;
  readonly similarityScore: Score;
  readonly contextSummary: string;
  readonly outcomeResult: string;
  readonly keyLearnings: string[];
}

export class ExecutiveDecisionTimeline {
  private readonly experienceRecords: ExperienceRecord[] = [];

  public addRecord(record: ExperienceRecord): void {
    this.experienceRecords.push(record);
  }

  public findSimilarDecisions(currentContext: string): readonly HistoricalDecisionMatch[] {
    return this.experienceRecords.map(rec => ({
      recordId: rec.recordId,
      similarityScore: Score.create(88),
      contextSummary: rec.context.summary,
      outcomeResult: rec.appliedDecision,
      keyLearnings: [rec.context.businessUnit]
    }));
  }
}
