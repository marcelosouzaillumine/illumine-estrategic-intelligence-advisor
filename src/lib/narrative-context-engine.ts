import { NarrativeStage } from "./maturity-context-types";
import type { NarrativeContext, OrganizationalMomentum, GovernanceReadiness } from "./narrative-context-types";
import type { LifecycleAssessmentResult } from "./institutional-lifecycle-assessment";
import type { ConstitutionalBoundaryAuditResult } from "./ilae-constitutional-guardrails";

/** Safe local type extensions */
export type LifecycleWithOptionalScore = LifecycleAssessmentResult & {
  overallScore?: number;
};
export type LifecycleWithOptionalDimensionScores = LifecycleAssessmentResult & {
  scores?: {
    CashSelfSufficiency?: { value?: number };
  };
};

/** Type guard for NarrativeStage */
function isNarrativeStage(value: unknown): value is NarrativeStage {
  return (
    typeof value === "string" &&
    (Object.values(NarrativeStage) as string[]).includes(value as NarrativeStage)
  );
}

/** Build NarrativeContext – render‑only, no numeric interpretation. */
export function buildNarrativeContext(
  result: LifecycleAssessmentResult,
  audit: ConstitutionalBoundaryAuditResult,
): NarrativeContext | undefined {
  // Omit field when audit is invalid (fiduciary guardrails failed)
  if (!audit.valid) return undefined;

  // ---- Institutional stage ----
  const stage: NarrativeStage = isNarrativeStage(result.stage)
    ? result.stage
    : mapScoreToStage((result as LifecycleWithOptionalScore).overallScore ?? 0);

  // ---- Confidence level (raw 0‑100) ----
  const confidenceLevel = result.classificationConfidence;

  // ---- Organizational momentum (fallback STABLE) ----
  const momentum: OrganizationalMomentum = (() => {
    const cashScore = (result as LifecycleWithOptionalDimensionScores).scores?.CashSelfSufficiency?.value;
    if (typeof cashScore === "number") {
      if (cashScore >= 70) return "ACCELERATING";
      if (cashScore >= 40) return "STABLE";
      return "DECELERATING";
    }
    return "STABLE"; // default per user spec
  })();

  // ---- Governance readiness (fallback MODERATE) ----
  const governanceReadiness: GovernanceReadiness = "MODERATE";

  // ---- Contextual warnings ----
  const warnings = audit.violations ?? [];

  const ctx: NarrativeContext = {
    institutionalStage: stage,
    confidenceLevel,
    organizationalMomentum: momentum,
    governanceReadiness,
    contextualWarnings: warnings,
  };
  return ctx;
}

/** Provisional score‑to‑stage fallback (same thresholds used elsewhere). */
function mapScoreToStage(score: number): NarrativeStage {
  if (score >= 80) return NarrativeStage.SUSTAINABLE;
  if (score >= 60) return NarrativeStage.SCALING;
  if (score >= 40) return NarrativeStage.FORMATION;
  if (score >= 20) return NarrativeStage.RECOVERY;
  return NarrativeStage.STRESSED;
}
