import type { DFCNarrativeInput, DFCNarrativeReportLike } from "./dfc-narrative-types";
import type { NarrativeContext } from "./narrative-context-types";

/**
 * Minimal contract – **does not** import `ExecutiveIntelligenceReport`.
 * No casting is performed; the contract already types `narrativeContext` correctly.
 */
export function mapReportToDfcNarrativeInput(report: DFCNarrativeReportLike): DFCNarrativeInput {
  return {
    narrativeContext: report.narrativeContext,
    fco: report.fco,
    fci: report.fci,
    fcf: report.fcf,
    runwayMonths: report.runwayMonths,
    externalCapitalDependency: report.externalCapitalDependency,
    cashGenerationQuality: report.cashGenerationQuality,
    growthFinancingMode: report.growthFinancingMode,
  };
}
