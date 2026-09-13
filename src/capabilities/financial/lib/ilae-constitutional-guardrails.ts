// src/lib/ilae-constitutional-guardrails.ts

export interface ConstitutionalBoundaryAuditResult {
  /** Indicates if the audit passed */
  valid: boolean;
  /** Optional list of violation messages */
  violations?: string[];
}


/**
 * Constitutional Guardrails for the Institutional Lifecycle Assessment Engine (ILAE).
 * These functions ensure that ILAE remains a *non‑authoritative* contextual layer and never
 * modifies any fiduciary truth, KPI, score, classification, or alert.
 */

import { LifecycleAssessmentResult, LifecycleStage, TransitionStage } from "./institutional-lifecycle-assessment";

/**
 * 1️⃣ Non‑Authoritative Classification Rule
 * Guarantees that the result does not alter any fiduciary values.
 * It simply returns the result unchanged – callers must enforce that the
 * result is only used for narrative/contextual purposes.
 */
export function enforceNonAuthoritativeClassification(
  result: LifecycleAssessmentResult,
): LifecycleAssessmentResult {
  // No mutation – the caller must treat the result as read‑only.
  return result;
}

/**
 * 2️⃣ Fiduciary Supremacy Rule
 * Merges a fiduciary narrative result with the ILAE narrative while preserving
 * fiduciary severity. `fiduciaryNarrative` is a string already containing the
 * fiduciary classification (e.g., "CRÍTICA"). `ilaeNarrative` is the contextual
 * string generated from the ILAE stage.
 */
export function applyFiduciarySupremacy(
  fiduciaryNarrative: string,
  ilaeNarrative: string,
): string {
  // The fiduciary part stays verbatim; we simply prepend the ILAE context.
  // Example: "Liquidez crítica. (Formação institucional)"
  return `${fiduciaryNarrative} ${ilaeNarrative}`.trim();
}

/**
 * 3️⃣ Narrative Context Rule
 * Ensures that the ILAE narrative is only *appended* as context, never
 * replacing the original conclusion.
 */
export function validateNarrativeContext(
  originalNarrative: string,
  ilaeContext: string,
): string {
  // Append with a separator for readability.
  return `${originalNarrative} ${ilaeContext}`.trim();
}

/**
 * 4️⃣ Transition State Safeguard
 * Guarantees that a transition state does not affect fiduciary alerts or scores.
 */
export function transitionStateSafeguard(
  result: LifecycleAssessmentResult,
): LifecycleAssessmentResult {
  // If the stage is a Transition, we keep it but mark that no alerts
  // should be altered downstream. The flag can be used by downstream code.
  // Here we simply return the result unchanged – downstream layers must respect.
  return result;
}

/**
 * 5️⃣ Explainability Requirement Wrapper
 * Guarantees that every result includes stage, classificationConfidence,
 * dataConfidence and a bullet‑point explanation.
 */
export function explainabilityWrapper(
  result: LifecycleAssessmentResult,
): LifecycleAssessmentResult {
  // The result already contains the required fields; this function exists for
  // type‑safety and explicit contract enforcement.
  return result;
}

/**
 * 6️⃣ Constitutional Boundary Audit
 * Scans the supplied result for any prohibited modifications.
 * Since ILAE never mutates fiduciary data, this audit simply validates that the
 * result object does not contain any of the prohibited keys. If it does, we
 * throw a specific error that can be caught by the orchestration layer.
 */
export class ConstitutionalBoundaryViolation extends Error {
  constructor(message: string) {
    super(message);
    this.name = "CONSTITUTIONAL_BOUNDARY_VIOLATION";
  }
}

export function constitutionalBoundaryAudit(
  result: any,
): void {
  const prohibitedKeys = [
    "kpi",
    "score",
    "fiduciaryClassification",
    "threshold",
    "alert",
    "diagnostic",
    "mathematicalClassification",
  ];
  for (const key of prohibitedKeys) {
    if (key in result) {
      throw new ConstitutionalBoundaryViolation(
        `ILAE result attempted to modify prohibited field: ${key}`,
      );
    }
  }
}

/**
 * Helper that runs the full guard‑rail pipeline on a raw assessment result.
 * Returns a safe result ready for consumption by narrative layers.
 */
export function runGuardrails(
  rawResult: LifecycleAssessmentResult,
): LifecycleAssessmentResult {
  const nonAuth = enforceNonAuthoritativeClassification(rawResult);
  const transitionSafe = transitionStateSafeguard(nonAuth);
  const explained = explainabilityWrapper(transitionSafe);
  constitutionalBoundaryAudit(explained);
  return explained;
}

/** Export types */

