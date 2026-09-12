import { DecisionMemoryOutput } from './InstitutionalDecisionTypes';
import { DecisionToCashCausalityOutput } from './DecisionToCashCausalityTypes';
import { InstitutionalBehavioralPatternsOutput } from './InstitutionalBehavioralTypes';
import { LongitudinalCashIntelligenceOutput } from '../../capabilities/financial/runtime/cash-intelligence/CashIntelligenceTypes';
import { CrossStatementReconciliationReport } from '../governance/cross-statement/CrossStatementReconciliationEngine';
import { FiduciaryTimelineSection } from '../institutional-reporting/institutional-reporting-types';

export type GovernanceDriftType = 
  | 'NO_DRIFT'
  | 'OPTIMISTIC_LIQUIDITY_DRIFT'
  | 'SUSTAINABLE_GROWTH_DRIFT'
  | 'ARTIFICIAL_TURNAROUND_DRIFT'
  | 'GOVERNANCE_MATURITY_DRIFT'
  | 'CASH_GENERATION_DRIFT'
  | 'CAPITAL_DEPENDENCY_DRIFT'
  | 'RISK_UNDERSTATEMENT_DRIFT'
  | 'ACCOUNTING_INTEGRITY_BLOCKED';

export type DriftSeverity = 'NONE' | 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';

export interface GovernanceDriftDetectionInput {
  executiveNarrative: string;
  executiveIntelligenceReport?: any; // Representação simplificada para o teste de escopo
  longitudinalCash: LongitudinalCashIntelligenceOutput;
  behavioralPatterns: InstitutionalBehavioralPatternsOutput;
  causalityOutput: DecisionToCashCausalityOutput;
  reconciliation: CrossStatementReconciliationReport;
  fiduciaryTimeline: FiduciaryTimelineSection;
  financialContext?: any;
}

export interface DriftCorrection {
  originalClaim: string;
  recommendedSubstitution: string;
}

export interface GovernanceDriftDetectionOutput {
  driftDetected: boolean;
  driftSeverity: DriftSeverity;
  driftTypes: GovernanceDriftType[]; // Pode ter múltiplos
  conflictingClaims: string[];
  fiduciaryReality: string[];
  affectedDomains: string[];
  narrativeRiskScore: number;
  evidenceTrail: string[];
  recommendedNarrativeCorrections: DriftCorrection[];
  blockedOptimisticClaims: string[];
  confidence: 'HIGH' | 'MODERATE' | 'LOW' | 'BLOCKED';
  fiduciaryWarnings: string[];
}
