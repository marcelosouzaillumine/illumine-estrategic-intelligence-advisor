// src/core/runtime/strategic-simulation/simulation-types.ts
//
// Institutional Strategic Simulation Types

import { BehaviorProfile, FatigueMetrics } from '../behavioral-intelligence/behavioral-types';
import { SurvivabilityScores } from '../decision-intelligence/decision-types';

export type ScenarioCategory =
  | 'Aggressive Expansion'
  | 'Conservative Preservation'
  | 'Debt-Financed Growth'
  | 'Turnaround Recovery'
  | 'Cost Reduction'
  | 'Asset Liquidation'
  | 'Liquidity Preservation'
  | 'Capital Reinforcement'
  | 'Operational Restructuring'
  | 'Strategic Retrenchment'
  | 'Controlled Growth'
  | 'Governance Stabilization'
  | 'Survival Stabilization';

export type ScenarioClassification =
  | 'STABLE'
  | 'ATTENTION'
  | 'HIGH_RISK'
  | 'CRITICAL'
  | 'UNSUSTAINABLE'
  | 'COLLAPSE_TRAJECTORY';

export type SimulationHorizon = 3 | 5 | 8 | 10 | 12;

export type StressProfile = 'MODERATE' | 'SEVERE' | 'EXTREME';

export interface SimulatedPath {
  category: ScenarioCategory;
  horizon: number;
  classification: ScenarioClassification;
  traceHash: string;
  originatingAssumptions: string[];
  finalProfile: BehaviorProfile;
  finalSurvivabilityScores: SurvivabilityScores;
  finalFatigue: FatigueMetrics;
  liquidityRunwayCycles: number;
  warnings: string[];
  stressProfileApplied?: StressProfile;
}

export interface ComparisonReport {
  candidatePath: SimulatedPath;
  baselines: {
    conservativePreservation: SimulatedPath;
    controlledGrowth: SimulatedPath;
    survivalStabilization: SimulatedPath;
  };
  recommendedPath: ScenarioCategory;
  uncertaintyBoundaries: { min: number; max: number };
  advisoryNotes: string[];
  timestamp: string;
}
