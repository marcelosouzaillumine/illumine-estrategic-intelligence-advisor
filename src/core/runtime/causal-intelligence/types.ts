// src/core/runtime/causal-intelligence/types.ts

import { CashIntelligenceRuntimeOutput } from '../cash-intelligence/CashIntelligenceTypes';

export type CausalFactorType =
  | 'MARGIN_COMPRESSION'
  | 'EXCESS_INVENTORY'
  | 'CUSTOMER_CREDIT_EXPANSION'
  | 'SUPPLIER_FINANCING_CONTRACTION'
  | 'EXCESSIVE_CAPEX'
  | 'DEBT_SERVICE_BURDEN'
  | 'INADEQUATE_PRICING'
  | 'SALES_QUALITY_DETERIORATION'
  | 'CUSTOMER_CONCENTRATION_RISK'
  | 'OPERATING_EXPENSE_LEVERAGE'
  | 'TAX_BURDEN_PRESSURE'
  | 'PRICE_COST_MISMATCH'
  | 'SHORT_TERM_DEBT_REFINANCING_PRESSURE'
  | 'CASH_DRAIN_BY_DISTRIBUTIONS';

export type CausalSeverity = 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';

export interface CausalFactor {
  type: CausalFactorType;
  label: string;
  severity: CausalSeverity;
  rationale: string;
  confidence: number; // 0 to 1
  isDefinitive: boolean; // false if DFC is missing (shows as possible pressure area)
}

export interface PressureVector {
  sourceLayer: 'SALES' | 'OPERATIONS' | 'WORKING_CAPITAL' | 'FINANCING' | 'TAX';
  targetLayer: 'CASH_FLOW' | 'SOLVENCY' | 'RECONCILIATION';
  pressureIndex: number; // 0 to 1
  description: string;
}

export interface CausalNode {
  id: string;
  label: string;
  type: 'SYMPTOM' | 'ROOT_CAUSE' | 'INTERMEDIARY_PRESSURE';
  severity: CausalSeverity;
}

export interface CausalEdge {
  source: string;
  target: string;
  description: string;
}

export interface CausalGraph {
  nodes: CausalNode[];
  edges: CausalEdge[];
}

export interface CausalIntelligenceReport {
  isAvailable: boolean;
  confidenceLevel: 'HIGH' | 'MODERATE' | 'LOW' | 'BLOCKED';
  rootCauses: CausalFactor[];
  pressurePropagation: PressureVector[];
  dependencyGraph: CausalGraph;
  stressCascadePath: string[];
  fragilityCorrelations: string[];
  causalOpinion: string;
  lineageHash: string;
  auditTrail: string[];
}
