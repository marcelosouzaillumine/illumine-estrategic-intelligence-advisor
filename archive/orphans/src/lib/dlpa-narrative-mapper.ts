// src/lib/dlpa-narrative-mapper.ts
import type { DLPANarrativeInput, DLPANarrativeReportLike } from "./dlpa-narrative-types";

/**
 * Maps a minimal report contract to the DLPA engine input.
 * Does not import ExecutiveIntelligenceReport to keep the mapper lightweight.
 */
export function mapReportToDlpaNarrativeInput(
  report: DLPANarrativeReportLike
): DLPANarrativeInput {
  return {
    narrativeContext: report.narrativeContext,
    accumulatedProfit: report.accumulatedProfit,
    accumulatedLoss: report.accumulatedLoss,
    retainedEarnings: report.retainedEarnings,
    distribution: report.distribution,
    reinvestment: report.reinvestment,
    patrimonialRecomposition: report.patrimonialRecomposition,
    capitalPreservation: report.capitalPreservation,
    partnerRemunerationPolicy: report.partnerRemunerationPolicy,
  };
}
