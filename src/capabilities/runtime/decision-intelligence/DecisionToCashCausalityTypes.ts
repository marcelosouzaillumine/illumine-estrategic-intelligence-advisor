import { ExecutiveDecisionEvent } from './InstitutionalDecisionTypes';
import { CashIntelligenceRuntimeOutput, LongitudinalCashIntelligenceOutput } from '../../capabilities/financial/runtime/cash-intelligence/CashIntelligenceTypes';
import { FiduciaryTimelineSection } from '../institutional-reporting/institutional-reporting-types';

export type CausalityConfidenceLevel = 
  | 'HIGH_CONFIDENCE_CAUSAL_CHAIN'
  | 'MODERATE_CONFIDENCE_CAUSAL_CHAIN'
  | 'LOW_CONFIDENCE_ASSOCIATION'
  | 'CAUSALITY_NOT_ESTABLISHED'
  | 'BLOCKED_BY_ACCOUNTING_INTEGRITY';

export type RecognizedCausalChainType = 
  | 'INVENTORY_EXPANSION_TO_CASH_PRESSURE'
  | 'CUSTOMER_CREDIT_TO_WORKING_CAPITAL_STRESS'
  | 'CAPITALIZATION_TO_ARTIFICIAL_LIQUIDITY'
  | 'DISTRIBUTION_TO_CONTINUITY_RISK'
  | 'CAPEX_WITHOUT_OPERATIONAL_RETURN'
  | 'CORRECTIVE_ACTION_TO_RECOVERY'
  | 'NO_ESTABLISHED_CHAIN';

export interface CausalChain {
  chainId: string;
  chainType: RecognizedCausalChainType;
  triggerEvent: ExecutiveDecisionEvent;
  impactedCycle: string;
  affectedFinancialMetrics: string[];
  description: string;
  confidence: CausalityConfidenceLevel;
  evidenceTrail: string[];
}

export interface DecisionToCashCausalityOutput {
  causalChains: CausalChain[];
  decisionImpactMap: Record<string, CausalChain>; // decisionId -> CausalChain
  affectedFinancialMetrics: string[];
  runwayImpactAssessment: string;
  fcoImpactAssessment: string;
  liquidityQualityImpact: string;
  continuityRiskImpact: string;
  confidence: CausalityConfidenceLevel;
  evidenceTrail: string[];
  causalityLimitations: string[];
  fiduciaryWarnings: string[];
}

export interface DecisionToCashCausalityInput {
  decisions: ExecutiveDecisionEvent[];
  cashCycles: CashIntelligenceRuntimeOutput[];
  longitudinalCash: LongitudinalCashIntelligenceOutput;
  fiduciaryTimeline: FiduciaryTimelineSection;
  financialContext: any; // Simplified placeholder for FinancialRuntimeContext
}
