// src/core/runtime/institutional-resilience/ResilienceTypes.ts

export type ResilienceClassification =
  | 'INSTITUTIONALLY_FRAGILE'
  | 'STRUCTURALLY_STABLE'
  | 'RESILIENT'
  | 'ADAPTIVE'
  | 'ANTIFRAGILE';

export interface InstitutionalResilienceOutput {
  resilienceClassification: ResilienceClassification;
  falseResilienceDetected: boolean;
  antifragilityValidated: boolean;
  resilienceScore: number;
  antifragilityScore: number;
  vulnerabilityReductionScore: number;
  institutionalLearningScore: number;
  shockAbsorptionScore: number;
  treasuryStrengtheningStatus: 'WEAKER' | 'UNCHANGED' | 'IMPROVED';
  governanceEvolutionStatus: 'REGRESSED' | 'STABLE' | 'IMPROVED';
  continuityResilienceStatus: 'FRAGILE' | 'STABLE' | 'ROBUST';
  crisisRecurrenceRisk: 'HIGH' | 'MODERATE' | 'LOW';
  resilienceDrivers: string[];
  antifragilityDrivers: string[];
  vulnerabilityDrivers: string[];
  institutionalLearningDrivers: string[];
  blockedConclusions: string[];
  allowedConclusions: string[];
  resilienceNarrative: string;
  auditTrail: string[];
  lineageHash: string;
  confidenceLevel: 'LOW' | 'MODERATE' | 'HIGH';
}

export interface ResilienceEvaluationInput {
  survivalReport?: any;
  recoveryReport?: any;
  regressionReport?: any;
  fiduciaryOutput?: any;
  treasuryRuntime?: any;
  cashIntelligenceRuntime?: any;
  patrimonialIntelligenceRuntime?: any;
  governanceTrajectoryRuntime?: any;
  historicalInstitutionalMemory?: any; // To be derived if missing
  longitudinalRuntimeHistory?: any[];
  historicalCycles?: any[];
  scenarioStressRuntime?: any;
  operationalContinuityRuntime?: any;
  fco?: number;
  availableCash?: number;
  netIncome?: number;
}
