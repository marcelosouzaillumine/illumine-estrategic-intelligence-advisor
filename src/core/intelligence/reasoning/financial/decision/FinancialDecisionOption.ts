import { DecisionGovernance } from './DecisionGovernance';

export interface ExpectedImpact {
  financial: string;
  operational: string;
  strategic: string;
}

export interface FinancialDecisionOption {
  id: string;
  title: string;
  category: "CAPITAL_ALLOCATION" | "LIQUIDITY_MANAGEMENT" | "DEBT_MANAGEMENT" | "GROWTH" | "OPERATIONAL_EFFICIENCY";
  triggerConcepts: string[];
  rationale: string;
  expectedImpact: ExpectedImpact;
  risks: string[];
  prerequisites: string[];
  confidence: number;
  governance: DecisionGovernance;
}
