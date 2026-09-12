// src/core/runtime/decision-intelligence/decision-types.ts
//
// Institutional Decision Intelligence Framework Types
// Ref: docs/implementation_plan.md

export type DecisionDomain =
  | 'Liquidity'
  | 'Debt Expansion'
  | 'Dividend Distribution'
  | 'CAPEX'
  | 'Operational Expansion'
  | 'Workforce Expansion'
  | 'Cost Reduction'
  | 'Capital Preservation'
  | 'Governance Exposure'
  | 'Cash Sustainability'
  | 'Strategic Survival'
  | 'Institutional Restructuring'
  | 'Asset Disposal'
  | 'Financing Strategy'
  | 'Working Capital Allocation';

export type DecisionSeverity =
  | 'SAFE'
  | 'ATTENTION'
  | 'HIGH_RISK'
  | 'CRITICAL'
  | 'UNSUSTAINABLE'
  | 'CONSTITUTIONAL_VIOLATION';

export interface ExecutiveDecision {
  decisionId: string;
  tenantId: string;
  clientId: string;
  domains: DecisionDomain[];
  value?: number;
  motivation: string;
  assumptions: string[];
  expectedOutcomes: string[];
  timestamp: string;
  approverId: string;
  approverRole: string;
  lineageHash?: string;
}

export interface SurvivabilityScores {
  liquidity: number;            // 0-100
  operational: number;          // 0-100
  governance: number;           // 0-100
  debt: number;                  // 0-100
  capitalPreservation: number;   // 0-100
  strategic: number;             // 0-100
  composite: number;             // 0-100
}

export interface DecisionCertification {
  fiduciaryCompatibility: number;
  survivabilityIntegrity: number;
  governanceConsistency: number;
  mathematicalSustainability: number;
  liquidityCompatibility: number;
  strategicCoherence: number;
  constitutionalCompliance: number;
  overallGrade: 'A' | 'B' | 'C' | 'D' | 'F';
  certifiedAt: string;
  signature: string;
}

export interface DecisionValidationResult {
  decisionId: string;
  isValid: boolean;
  severity: DecisionSeverity;
  violations: string[];
  warnings: string[];
  survivabilityScores: SurvivabilityScores;
  certification: DecisionCertification;
  propagationPath: string[];
  timestamp: string;
  policyProfile?: string;
  predictiveAssessment?: any;
}
