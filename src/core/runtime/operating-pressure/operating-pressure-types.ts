// src/core/runtime/operating-pressure/operating-pressure-types.ts

export type OperatingPressureSeverity = 'STABLE' | 'MODERATE' | 'ELEVATED' | 'CRITICAL' | 'ACUTE';

export interface PressureAccumulationOutput {
  accumulationScore: number; // 0 a 100
  persistenceTrend: 'STABLE' | 'DEGRADED' | 'ACCUMULATING';
  accumulatedFactors: string[];
}

export interface OperationalFatigueOutput {
  fatigueScore: number; // 0 a 100
  fatigueLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  operatingAbsorptionRatio: number;
  warnings: string[];
}

export interface LiquidityCompressionOutput {
  compressionScore: number; // 0 a 100
  deteriorationVelocity: number;
  compressionState: 'NORMAL' | 'WARNING' | 'COMPRESSED';
  strainFactors: string[];
}

export interface TreasuryErosionOutput {
  erosionScore: number; // 0 a 100
  drainVelocity: number;
  erosionState: 'STABLE' | 'MODERATE' | 'ERODING' | 'CRITICAL_EROSION';
  warnings: string[];
}

export interface FundingFragilityOutput {
  fragilityScore: number; // 0 a 100
  fundingDependency: 'NONE' | 'LOW' | 'MEDIUM' | 'HIGH';
  rolloverPressureRatio: number;
  rolloverRiskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  warnings: string[];
}

export interface PressurePropagationOutput {
  propagationLevel: 'LOW' | 'MODERATE' | 'HIGH' | 'SYSTEMIC';
  propagationChain: string[];
  activePathways: string[];
}

export interface PressureThesisOutput {
  thesisSummary: string;
  pressureProfile: string;
  operationalFatigueProfile: string;
  liquidityStrainProfile: string;
  treasuryErosionProfile: string;
  institutionalOperatingStrain: string;
}

export interface StrainDecompositionItem {
  engine: string;
  contribution: number;
  rationale: string;
}

export interface PressureExplainabilityOutput {
  pressureLineage: string;
  structuralRationale: string;
  strainDecomposition: StrainDecompositionItem[];
  propagationExplanation: string;
  confidenceDecomposition: string;
}

export interface InstitutionalPressureRuntimeOutput {
  isAvailable: boolean;
  overallPressureLevel: OperatingPressureSeverity;
  pressureScore: number; // 0 a 100
  pressureAccumulation: PressureAccumulationOutput;
  operationalFatigue: OperationalFatigueOutput;
  liquidityCompression: LiquidityCompressionOutput;
  treasuryErosion: TreasuryErosionOutput;
  fundingFragility: FundingFragilityOutput;
  propagation: PressurePropagationOutput;
  thesis: PressureThesisOutput;
  explainability: PressureExplainabilityOutput;
  pressureLineageHash: string;
  fiduciaryDisclosures: string[];
  auditTrail: string[];
}

export interface PressureRuntimeInput {
  tenantId: string;
  correlationId: string;
  historicalCycles: any[]; // outputs from past cycles if any
  currentCycle: {
    revenue: number;
    prevRevenue: number;
    ebitda: number;
    prevEbitda: number;
    grossProfit: number;
    prevGrossProfit: number;
    sga: number;
    prevSga: number;
    inventory: number;
    prevInventory: number;
    workingCapital: number;
    prevWorkingCapital: number;
    ocf: number; // FCO current
    prevOcf: number;
    availableCash: number;
    prevAvailableCash: number;
    runwayMonths: number;
    shortTermDebt: number;
    totalDebt: number;
    payables: number;
    receivables: number;
  };
  cashSustainabilityReport?: any;
  treasuryReport?: any;
  patrimonialReport?: any;
}
