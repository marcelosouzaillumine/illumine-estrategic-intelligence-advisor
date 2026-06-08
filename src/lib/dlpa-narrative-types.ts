// Types for the DLPA Narrative Layer
import type { NarrativeContext } from "./narrative-context-types";

export interface DLPANarrative {
  accumulatedProfitNarrative: string;
  accumulatedLossNarrative: string;
  retainedEarningsNarrative: string;
  distributionNarrative: string;
  reinvestmentNarrative: string;
  patrimonialRecompositionNarrative: string;
  capitalPreservationNarrative: string;
  partnerRemunerationNarrative: string;
  fiduciaryDisclaimer: string; // fixed disclaimer
}

/** Input for the DLPA engine – all fields optional. */
export interface DLPANarrativeInput {
  narrativeContext?: NarrativeContext;
  accumulatedProfit?: number;
  accumulatedLoss?: number;
  retainedEarnings?: number;
  distribution?: number;
  reinvestment?: number;
  patrimonialRecomposition?: number;
  capitalPreservation?: number;
  partnerRemunerationPolicy?: string; // textual policy description
}

/** Minimal contract for the mapper – avoids importing the full report. */
export interface DLPANarrativeReportLike {
  narrativeContext?: NarrativeContext;
  accumulatedProfit?: number;
  accumulatedLoss?: number;
  retainedEarnings?: number;
  distribution?: number;
  reinvestment?: number;
  patrimonialRecomposition?: number;
  capitalPreservation?: number;
  partnerRemunerationPolicy?: string;
}
