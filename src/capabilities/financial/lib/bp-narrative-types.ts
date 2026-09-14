import type { NarrativeContext } from "./narrative-context-types";

export interface BPNarrative {
  quickLiquidityNarrative: string;
  disclaimer: string; // Fixed disclaimer, never altered
}

export interface BPNarrativeReportLike {
  narrativeContext?: NarrativeContext;
  liquidity?: number;
  quickLiquidity?: number;
  capitalStructure?: number;
  assetQuality?: number;
  workingCapital?: number;
  patrimonialConcentration?: number;
  financialAutonomy?: number;
}

export interface BPNarrativeInput {
  narrativeContext?: NarrativeContext;
  liquidity?: number;
  quickLiquidity?: number;
  capitalStructure?: number;
  assetQuality?: number;
  workingCapital?: number;
  patrimonialConcentration?: number;
  financialAutonomy?: number;
}

// NarrativeContext is defined elsewhere (./narrative-context-types)
