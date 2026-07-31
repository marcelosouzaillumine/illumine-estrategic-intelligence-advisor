export interface ContextReference {
  type: string;
  id: string;
  snapshot: any;
}

export interface Assumption {
  id: string;
  description: string;
  confidence: number;
}

export interface Risk {
  id: string;
  category: string;
  description: string;
}

export interface OutcomeExpectation {
  horizonDays: number;
  metrics: any[];
}

export type ApprovalLevel = 'BOARD' | 'C_LEVEL' | 'DIRECTOR' | 'SYSTEM';

export interface InstitutionalLesson {
  id: string;
  text: string;
  category: string;
}

export interface DecisionIntent {
  strategicObjective: string;
  expectedValueCreation: string;
  successCriteria: string[];
  confidenceLevel: number;
}

export interface DecisionReview {
  reviewedAt: Date;
  reviewedBy: string;
  conclusion: 'CONFIRMED' | 'PARTIALLY_CONFIRMED' | 'INVALIDATED';
}

export interface DecisionMemoryRecord {
  id: string;
  organizationId: string;
  decisionDate: Date;
  decisionCategory: 'STRATEGIC' | 'FINANCIAL' | 'OPERATIONAL' | 'GOVERNANCE';
  intent: DecisionIntent;
  contextSnapshot: ContextReference[];
  assumptions: Assumption[];
  risksIdentified: Risk[];
  expectedOutcome: OutcomeExpectation;
  decisionAuthority: ApprovalLevel;
  actualOutcome?: any; // To be mapped to a specific OutcomeResult in the future
  review?: DecisionReview;
  lessonsLearned?: InstitutionalLesson;
  confidenceScore: number;
  classification: 'PRIVATE' | 'INTERNAL' | 'EXECUTIVE' | 'BOARD_LEVEL' | 'FIDUCIARY_RECORD';
}
