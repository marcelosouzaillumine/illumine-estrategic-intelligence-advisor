// src/core/runtime/scenario-intelligence/scenario-types.ts

export type ScenarioVariable = 
  | 'INVENTORY_VOLUME'
  | 'REVENUE_VOLUME'
  | 'EBITDA_MARGIN'
  | 'SUPPLIER_PAYMENT_DAYS'
  | 'CUSTOMER_RECEIPT_DAYS'
  | 'CAPITAL_RETENTION'
  | 'CAPEX_VOLUME'
  | 'DEBT_AMORTIZATION';

export interface ScenarioInput {
  variable: ScenarioVariable;
  variationPercentage: number; // e.g. 30 for +30%, -15 for -15%
}

export type ScenarioConstraintStatus = 'VALID' | 'BLOCKED_BY_EXTRAPOLATION' | 'BLOCKED_BY_ECONOMIC_LAW';

export interface ScenarioConstraintValidation {
  status: ScenarioConstraintStatus;
  reason?: string;
  blockedVariable?: ScenarioVariable;
  attemptedVariation?: number;
  allowedMaxVariation?: number;
}

export interface PropagationNode {
  dimension: 'BP' | 'DRE' | 'DFC' | 'DLPA' | 'LIQUIDITY' | 'FUNDING' | 'COVENANT';
  metric: string;
  impactMagnitude: number; // percentage change or absolute change depending on context
  impactDirection: 'POSITIVE' | 'NEGATIVE' | 'NEUTRAL';
  severity: 'BAIXA' | 'MODERADA' | 'ALTA' | 'CRÍTICA';
}

export interface PropagationEdge {
  source: PropagationNode;
  target: PropagationNode;
  mechanism: string; // purely structural rationale, e.g. "Consumo de Caixa Operacional"
}

export interface PropagationSimulationProfile {
  nodes: PropagationNode[];
  edges: PropagationEdge[];
  structuralIntegrityScore: number; // 0 to 100, measures how much it stretches reality
  systemicSeverity: 'BAIXA' | 'MODERADA' | 'ALTA' | 'CRÍTICA';
}

export interface ScenarioExplainabilityPayload {
  baselineHash: string;
  simulationHash: string;
  lineageHash: string;
  constraintTriggers: string[];
  propagationRationale: string[];
}

export interface InstitutionalScenarioResult {
  id: string;
  inputs: ScenarioInput[];
  validation: ScenarioConstraintValidation;
  propagationProfile?: PropagationSimulationProfile;
  explainability?: ScenarioExplainabilityPayload;
}
