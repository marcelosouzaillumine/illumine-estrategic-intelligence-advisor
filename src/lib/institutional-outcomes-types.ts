export type OutcomeEvidenceLevel = 'E1' | 'E2' | 'E3' | 'E4' | 'E5' | 'E6';

export type EvidenceSource =
  | 'BOARD_MINUTES'
  | 'BOARD_MEMO'
  | 'ACTION_PLAN'
  | 'AUDIT_REPORT'
  | 'MANAGEMENT_REPORT'
  | 'MANUAL_ENTRY'
  | 'EXTERNAL_DOCUMENT'
  | 'SYSTEM_RUNTIME'; // For E1/E2 generated natively by Illumine

export interface InstitutionalOutcomeRecord {
  id: string;
  category: 'GOVERNANCE' | 'CAPITAL_ALLOCATION' | 'EXECUTION' | 'STRATEGY' | 'FINANCIAL_HEALTH' | 'INSTITUTIONAL_MATURITY';
  level: OutcomeEvidenceLevel;
  source: EvidenceSource;
  sourceReference: string;
  description: string;
  dateLogged: string;
  linkedInsightId?: string; // Links an E3/E4/E5/E6 back to an E1/E2 insight
}

export interface InstitutionalConversionMetrics {
  totalInsights: number;        // E1
  totalRecommendations: number; // E2
  totalDecisions: number;       // E3
  totalActions: number;         // E4
  totalOutcomes: number;        // E5
  totalMeasured: number;        // E6
  
  insightToDecisionRate: number; // E3 / E1
  decisionToActionRate: number;  // E4 / E3
  actionToOutcomeRate: number;   // E5 / E4
  outcomeToMeasuredResultRate: number; // E6 / E5
}

export interface InstitutionalLearningPattern {
  patternId: string;
  type: 'BOTTLENECK' | 'EXECUTION_FAILURE' | 'ALLOCATION_MISTAKE' | 'TRANSFORMATION_DRIVER';
  frequency: number;
  description: string;
  evidenceLinks: string[]; // IDs of OutcomeRecords that form this pattern
}

export interface InstitutionalTransformationIndex {
  governanceScore: number;
  capitalAllocationScore: number;
  executionScore: number;
  strategyScore: number;
  financialHealthScore: number;
  institutionalMaturityScore: number;
  // Based exclusively on E3-E6 accumulation, not predictions
}

export interface EvidenceAuditSummary {
  evidenceStrengthClassification: 'WEAK' | 'MODERATE' | 'STRONG' | 'IRREFUTABLE';
  decisionInfluenceClassification: 'SUPPORT_TOOL' | 'ANALYTICAL_TOOL' | 'DECISION_SUPPORT_SYSTEM' | 'GOVERNANCE_INTELLIGENCE_PLATFORM' | 'INSTITUTIONAL_INTELLIGENCE_PLATFORM' | 'INSTITUTIONAL_OPERATING_SYSTEM';
  predominantLevel: OutcomeEvidenceLevel;
  totalVerifiedEvidence: number;
}

export interface InstitutionalOutcomesDatabase {
  records: InstitutionalOutcomeRecord[];
  conversionMetrics: InstitutionalConversionMetrics;
  learningPatterns: InstitutionalLearningPattern[];
  transformationIndex: InstitutionalTransformationIndex;
  evidenceAudit: EvidenceAuditSummary;
}

// Input payload for the Evidence Adapter
export interface InstitutionalEvidenceInput {
  existingRecords?: InstitutionalOutcomeRecord[]; // From DB or previous runs
  executiveSovereigntyReport?: any; // To extract natively generated E1/E2
}
