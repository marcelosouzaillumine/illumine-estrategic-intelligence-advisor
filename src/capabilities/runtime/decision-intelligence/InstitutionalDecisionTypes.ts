export type DecisionCategory = 
  | 'INVENTORY_EXPANSION'
  | 'CUSTOMER_CREDIT_EXPANSION'
  | 'SUPPLIER_DEPENDENCY_EXTENSION'
  | 'EMERGENCY_CAPITALIZATION'
  | 'DEBT_REFINANCING'
  | 'DIVIDEND_DISTRIBUTION'
  | 'COST_CUTTING'
  | 'HEADCOUNT_EXPANSION'
  | 'CAPEX_EXPANSION'
  | 'PRICING_CHANGE'
  | 'TAX_POSTPONEMENT'
  | 'RELATED_PARTY_TRANSACTION'
  | 'STRATEGIC_EXPANSION'
  | 'OPERATIONAL_RESTRUCTURING'
  | 'UNKNOWN_DECISION';

export type InstitutionalBehavioralPattern = 
  | 'REACTIVE_MANAGEMENT'
  | 'DISCIPLINED_EXECUTION'
  | 'CHRONIC_OVEREXPANSION'
  | 'ARTIFICIAL_SCALING'
  | 'TREASURY_NEGLECT'
  | 'RECURRENT_WORKING_CAPITAL_STRESS'
  | 'GOVERNANCE_MATURITY_EVOLUTION'
  | 'STRATEGIC_DISCIPLINE'
  | 'INSUFFICIENT_DATA';

export type DecisionConfidenceLevel = 'HIGH' | 'MODERATE' | 'INFERRED' | 'LOW';
export type DecisionSeverity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface DecisionImpact {
  fcoImpact: number; // positive or negative absolute impact
  runwayImpactMonths: number;
  workingCapitalImpact: number;
}

export interface ExecutiveDecisionEvent {
  decisionId: string;
  decisionType: DecisionCategory;
  decisionDate: string; // ISO date
  affectedDomain: string;
  expectedImpact: string;
  observedImpact: DecisionImpact;
  linkedFinancialCycle: string; // cycle ID or year
  evidenceSource: string; // Document, metric, or reconciliation layer
  confidence: DecisionConfidenceLevel;
  lineageHash: string;
  decisionSeverity: DecisionSeverity;
  recurrenceFlag: boolean;
  fiduciaryRiskFlag: boolean;
}

export interface DecisionMemoryOutput {
  recurringDecisionPatterns: DecisionCategory[];
  destructiveDecisionRecurrence: boolean;
  correctiveDecisionEvidence: boolean;
  institutionalLearningSignal: 'POSITIVE' | 'NEGATIVE' | 'NEUTRAL' | 'NOT_AVAILABLE';
  decisionDisciplineScore: number | 'NOT_AVAILABLE';
  decisionMemoryWarnings: string[];
}
