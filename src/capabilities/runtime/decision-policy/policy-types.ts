// src/core/runtime/decision-policy/policy-types.ts
//
// Decision Policy & Institutional Materiality Framework Types

export type DecisionPolicyProfile =
  | 'CONSERVATIVE'
  | 'BALANCED'
  | 'AGGRESSIVE_GROWTH'
  | 'TURNAROUND'
  | 'HYPER_GROWTH'
  | 'HIGH_CAPITAL_INTENSITY'
  | 'NONPROFIT'
  | 'HOSPITAL'
  | 'INDUSTRIAL'
  | 'HOLDING'
  | 'FAMILY_BUSINESS'
  | 'FINANCIAL_INSTITUTION';

export interface RiskAppetiteBounds {
  maxLeverageRatio: number;          // e.g. Debt/EBITDA limit (e.g. 3.5x)
  minLiquidityBufferRatio: number;   // e.g. Cash / 12-month liabilities (e.g. 0.20)
  maxCapexAsOcfRatio: number;        // e.g. CAPEX / OCF limit (e.g. 0.80)
  expansionPermissiveness: 'LOW' | 'MEDIUM' | 'HIGH';
  governanceFlexibility: 'NONE' | 'LOW' | 'MEDIUM' | 'HIGH';
}

export interface MaterialityAssessment {
  isMaterial: boolean;
  compositeScore: number;            // 0-100
  materialityBase: number;           // Calculated baseline value
  dimensions: {
    financialMagnitude: number;
    liquidityImpact: number;
    patrimonialExposure: number;
    operationalDependency: number;
    governanceExposure: number;
    survivabilityImpact: number;
    strategicImportance: number;
    recurrenceFrequency: number;
    systemicPropagation: number;
  };
}

export interface PolicyContext {
  activeProfile: DecisionPolicyProfile;
  riskAppetite: RiskAppetiteBounds;
  materiality: MaterialityAssessment;
  survivabilityTolerance: {
    minLiquidityScore: number;            // standard is 30, TURNAROUND might allow 20, HOSPITALS require 45
    minDebtScore: number;                 // standard is 30
    minCapitalPreservationScore: number;  // standard is 30
    minCompositeScore: number;            // standard is 50
  };
  flexibilityModifiers: {
    allowLeverageExceptions: boolean;
    degradeNonConstitutionalAlerts: boolean;
    bypassMinorBlocks: boolean;
  };
  sectorGovernance: {
    isStrictLiquidityRequired: boolean;
    allowDistribution: boolean;
  };
  timestamp: string;
}
