// src/core/runtime/behavioral-intelligence/behavioral-types.ts
//
// Institutional Behavioral Intelligence & Governance Drift Framework Types

export type DriftSeverity =
  | 'STABLE'
  | 'MINOR_DRIFT'
  | 'MODERATE_DRIFT'
  | 'CRITICAL_DRIFT'
  | 'CONSTITUTIONAL_DRIFT';

export interface FatigueMetrics {
  operationalFatigue: number;     // 0-100 (pressure from recurrent operational issues)
  governanceFatigue: number;      // 0-100 (decisional degradation, recurring violations)
  strategicFatigue: number;       // 0-100 (constant change of direction/motivation)
  survivabilityFatigue: number;   // 0-100 (emergency decisions: repeated cost/workforce cuts)
  compositeFatigue: number;       // 0-100
}

export interface BehaviorProfile {
  prudence: number;
  aggressiveness: number;
  survivabilityDiscipline: number;
  governanceConsistency: number;
  executiveCoherence: number;
  capitalPreservationDiscipline: number;
  expansionAppetite: number;
  riskEscalationTendency: number;
  recoveryCapacity: number;
  operationalDiscipline: number;
  strategicStability: number;
}

export interface BehavioralScores {
  governanceStability: number;
  executiveConsistency: number;
  institutionalDiscipline: number;
  survivabilityAdaptation: number;
  fiduciaryPrudence: number;
  strategicCoherence: number;
  governanceFatigue: number;
}

export interface BehavioralAssessmentResult {
  dynamicIdentity: string;         // e.g. "Consolidação Prudente", "Deterioração Crítica"
  driftSeverity: DriftSeverity;
  driftCategories: {
    governanceDrift: DriftSeverity;
    riskAppetiteDrift: DriftSeverity;
    liquidityDisciplineDrift: DriftSeverity;
    strategicAggressivenessDrift: DriftSeverity;
    survivabilityDrift: DriftSeverity;
    executiveCoherenceDrift: DriftSeverity;
    capitalPreservationDrift: DriftSeverity;
  };
  scores: BehavioralScores;
  fatigue: FatigueMetrics;
  profile: BehaviorProfile;
  adaptationScore: number;
  maturityLevel: string;
  warnings: string[];
  timestamp: string;
}
