import { InstitutionalLesson, LearningPattern } from '@illumine/institutional-learning-intelligence';
import { Recommendation } from '@illumine/architecture-governance-recommendation';

export class LearningFeedbackConnector {
  feedbackToRecommendation(pattern: LearningPattern, recommendation: Recommendation): Recommendation {
    // This feeds validated principles back into recommendations
    if (pattern.maturity === 'INSTITUTIONAL_PRINCIPLE') {
       const updated = { ...recommendation } as any;
       updated.evidenceBase = [
         ...(updated.evidenceBase || updated.evidence || []),
         `Driven by institutional principle: PAT-${pattern.patternId}`
       ];
       return updated as Recommendation;
    }
    return recommendation;
  }
}
