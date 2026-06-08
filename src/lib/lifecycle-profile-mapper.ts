// src/lib/lifecycle-profile-mapper.ts

import { CompanyProfile } from "./institutional-lifecycle-assessment";

/**
 * Maps the runtime output (ExecutiveIntelligenceReport) to a CompanyProfile.
 * Only fields that exist in the runtime are used; missing fields become undefined.
 * This ensures the ILAE dataConfidence is reduced automatically.
 */
export function mapRuntimeToCompanyProfile(
  runtime: any,
): CompanyProfile {
  // Helper to safely extract a numeric field or return undefined
  const numOrUndef = (value: any): number | undefined =>
    typeof value === "number" ? value : undefined;

  // Fiscal years – derived from historical cycles count if present
  const fiscalYears = runtime.temporalCausality?.cycleCount ?? undefined;

  // Recent capitalization – infer from recent capital injection flag if available
  const recentCapitalization =
    (runtime.capitalStructure?.operationalDependency ?? "") === "CAPITAL_INJECTION"
      ? true
      : undefined;

  return {
    fiscalYears,
    recentCapitalization,
    ebitda: numOrUndef(runtime.metrics?.financialMetrics?.ebitda),
    ebit: numOrUndef(runtime.metrics?.financialMetrics?.ebit),
    netProfit: numOrUndef(runtime.metrics?.financialMetrics?.netProfit),
    operatingCashFlow: numOrUndef(runtime.metrics?.financialMetrics?.operatingCashFlow),
    runwayMonths: numOrUndef(runtime.metrics?.financialMetrics?.runwayMonths),
    revenueGrowthPct: numOrUndef(runtime.metrics?.financialMetrics?.revenueGrowthPct),
    ebitdaGrowthPct: numOrUndef(runtime.metrics?.financialMetrics?.ebitdaGrowthPct),
    dlpa: numOrUndef(runtime.causalIntelligenceReport?.dlpa),
  };
}
