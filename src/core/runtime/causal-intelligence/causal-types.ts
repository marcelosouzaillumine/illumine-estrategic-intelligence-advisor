// src/core/runtime/causal-intelligence/causal-types.ts

export type CausalCategory =
  | 'OPERATIONAL'
  | 'COMMERCIAL'
  | 'TREASURY'
  | 'WORKING_CAPITAL'
  | 'DEBT'
  | 'GOVERNANCE'
  | 'CAPITAL_STRUCTURE'
  | 'CONSTITUTIONAL';

export type CausalConfidence =
  | 'HIGH'
  | 'MEDIUM'
  | 'LOW'
  | 'CAUSALITY_RESTRICTED';

export interface CausalEvidence {
  metricName: string;
  metricValue: number | string;
  sourcePeriod: string;
}

export interface CausalChain {
  cause: string;            // e.g. "Inventory Expansion"
  driver: string;           // e.g. "Working Capital Pressure"
  effect: string;           // e.g. "FCO Deterioration"
  narrative: string;        // Localized detailed narrative
  category: CausalCategory;
  severity: 'INFO' | 'WARNING' | 'CRITICAL' | 'RESTRICTIVE';
  lineageHash: string;
}

export interface InstitutionalCausalityOutput {
  primaryCause: string;
  secondaryCauses: string[];
  causalChains: CausalChain[];
  confidenceLevel: CausalConfidence;
  supportingEvidence: CausalEvidence[];
  executiveNarrative: string;
  lineageHash: string;
}
