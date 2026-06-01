import { InstitutionalStabilityIndexOutput } from './InstitutionalStabilityTypes';
import { LongitudinalCashIntelligenceOutput, CashIntelligenceRuntimeOutput } from '../cash-intelligence/CashIntelligenceTypes';
import { FiduciaryTimelineSection } from '../institutional-reporting/institutional-reporting-types';
import { DecisionMemoryOutput } from './InstitutionalDecisionTypes';
import { DecisionToCashCausalityOutput } from './DecisionToCashCausalityTypes';
import { InstitutionalBehavioralPatternsOutput } from './InstitutionalBehavioralTypes';
import { GovernanceDriftDetectionOutput } from './GovernanceDriftTypes';
import { ExecutiveAccountabilityOutput } from './ExecutiveAccountabilityTypes';
import { CrossStatementReconciliationReport } from '../governance/cross-statement/CrossStatementReconciliationEngine';

export type EarlyWarningLevel = 
  | 'STABLE_MONITORING'
  | 'EARLY_STRUCTURAL_STRESS'
  | 'EMERGING_WORKING_CAPITAL_PRESSURE'
  | 'EMERGING_LIQUIDITY_DEPENDENCY'
  | 'PRE_DISTRESS_STATE'
  | 'STRUCTURAL_DETERIORATION_ACCELERATION'
  | 'RECURSIVE_CAPITALIZATION_RISK'
  | 'OPERATIONAL_COLLAPSE_RISK'
  | 'HIGH_RECURRENCE_PROBABILITY'
  | 'CRITICAL_CONTINUITY_THREAT'
  | 'INSUFFICIENT_PREDICTIVE_EVIDENCE'
  | 'BLOCKED_BY_ACCOUNTING_INTEGRITY';

export interface EarlyWarningIntelligenceInput {
  stabilityOutput: InstitutionalStabilityIndexOutput;
  longitudinalCash: LongitudinalCashIntelligenceOutput;
  fiduciaryTimeline: FiduciaryTimelineSection;
  memoryOutput: DecisionMemoryOutput;
  causalityOutput: DecisionToCashCausalityOutput;
  behavioralPatterns: InstitutionalBehavioralPatternsOutput;
  driftOutput: GovernanceDriftDetectionOutput;
  accountabilityOutput: ExecutiveAccountabilityOutput;
  cashCycles: CashIntelligenceRuntimeOutput[];
  reconciliation: CrossStatementReconciliationReport;
  financialContext?: any;
}

export interface EarlyWarningIntelligenceOutput {
  earlyWarningLevel: EarlyWarningLevel;
  earlyWarningScore: number | 'NOT_AVAILABLE';
  detectedThreats: string[];
  emergingPatterns: string[];
  projectedContinuityRisk: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL' | 'BLOCKED';
  projectedRunwayPressure: 'STABLE' | 'INCREASING' | 'CRITICAL' | 'BLOCKED';
  recurrenceProbability: 'LOW' | 'MODERATE' | 'HIGH' | 'BLOCKED';
  deteriorationVelocity: 'STABLE' | 'ACCELERATING' | 'SLOWING_DOWN' | 'BLOCKED';
  stabilizationProbability: 'HIGH' | 'MODERATE' | 'LOW' | 'BLOCKED';
  fiduciaryStressSignals: string[];
  anticipatoryAlerts: string[];
  evidenceTrail: string[];
  fiduciaryWarnings: string[];
  narrativeEarlyWarningAssessment: string;
  confidence: 'HIGH' | 'MODERATE' | 'LOW' | 'BLOCKED';
  blockedReason?: string;
}
