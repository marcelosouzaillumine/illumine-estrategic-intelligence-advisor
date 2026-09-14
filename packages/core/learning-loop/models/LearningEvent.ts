export interface LearningEvent {
  id: string;
  sourceDecisionId: string;
  evidence: any[];
  initialHypothesis: string;
  observedOutcome: string;
  decisionQuality: 'HIGH' | 'MEDIUM' | 'LOW';
  externalFactors: string[];
  interpretation: string;
  institutionalLesson: string;
  confidenceScore: number;
  approvedBy: string;
  createdAt: Date;
}
