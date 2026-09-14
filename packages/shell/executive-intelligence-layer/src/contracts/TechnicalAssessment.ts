export type AssessmentDomain = 'FINANCIAL' | 'ECONOMIC' | 'CASH_FLOW' | 'COMMERCIAL' | 'OPERATIONAL' | 'PEOPLE' | 'GOVERNANCE' | 'RISK' | 'INNOVATION';

export type NoRecommendationAllowed = {
  decision?: never;
  recommendation?: never;
  executionPlan?: never;
  strategy?: never;
  approval?: never;
  actionPlan?: never;
  priority?: never;
  nextStep?: never;
};

export type TechnicalAssessment = {
  domain: AssessmentDomain;
  executiveState: 'HEALTHY' | 'ATTENTION' | 'STRESSED' | 'CRITICAL';
  confidence: number;
  
  executiveVerdict: string;
  executiveSummary: string[];
  criticalFindings: string[];
  supportingEvidence: string[];
  quantitativeEvidence: string[];
  limitations: string[];
  unresolvedQuestions: string[];
  confidenceDrivers: string[];
  lineage: string[];
} & NoRecommendationAllowed;
