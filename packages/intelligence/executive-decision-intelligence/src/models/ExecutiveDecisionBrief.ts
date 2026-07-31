import { EvidenceReference } from './ExecutiveDecisionContext';

export interface StrategicAlternative {
  readonly id: string;
  readonly description: string;
  readonly expectedEffects: readonly string[];
}

export interface ScenarioAnalysis {
  readonly alternativeId: string;
  readonly potentialOutcomes: readonly string[];
}

export interface RiskExposure {
  readonly description: string;
  readonly severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
}

export interface ExecutiveDecisionBrief {
  readonly briefId: string;
  
  // 1. Decision Statement
  readonly decisionStatement: string;
  
  // 2. Current Situation
  readonly currentSituation: string;
  
  // 3. Evidence Base
  readonly evidenceBase: readonly EvidenceReference[];
  
  // 4. Strategic Alternatives
  readonly strategicAlternatives: readonly StrategicAlternative[];
  
  // 5. Scenario Analysis
  readonly scenarioAnalysis: readonly ScenarioAnalysis[];
  
  // 6. Risks
  readonly risks: readonly RiskExposure[];
  
  // 7. Recommendation
  readonly recommendation: {
    readonly recommendedAlternativeId: string;
    readonly rationale: string;
  };
  
  // 8. Decision Authority
  readonly decisionAuthority: string; // e.g., role or specific name required
  
  // 9. Expected Outcome
  readonly expectedOutcome: string;
  
  // 10. Review Point
  readonly reviewPointDate: string;
}
