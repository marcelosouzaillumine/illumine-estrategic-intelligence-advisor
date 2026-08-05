export interface BusinessContext {
  sector: string;
  size: string;
  maturity: string;
  governanceLevel: string;
}

export interface DecisionContext {
  objective: string;
  urgency: string;
  stakeholder: string;
  timeHorizon: string;
}

export interface EnvironmentalContext {
  inflationTrend: string;
  interestRates: string;
  exchangeRate: string;
  macroeconomicScenario: string;
  countryRisk: string;
}

export interface OrganizationalContext {
  mission: string;
  culture: string;
  boardDirectives: string[];
}

export interface HistoricalContext {
  previousDecisions: any[];
  previousOutcomes: any[];
  institutionalMemory: any[];
}

export interface ExecutiveReasoningContext {
  business: BusinessContext;
  decision: DecisionContext;
  environment: EnvironmentalContext;
  organizational: OrganizationalContext;
  historical: HistoricalContext;
}
