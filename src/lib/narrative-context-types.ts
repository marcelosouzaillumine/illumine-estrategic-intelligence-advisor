import type { NarrativeStage } from "./maturity-context-types";

export type OrganizationalMomentum = "ACCELERATING" | "STABLE" | "DECELERATING";
export type GovernanceReadiness = "LOW" | "MODERATE" | "HIGH";

export interface NarrativeContext {
  /** Institutional stage derived from ILAE */
  institutionalStage: NarrativeStage;
  /** Raw confidence level 0‑100 */
  confidenceLevel: number;
  /** Momentum of the organization, defaults to "STABLE" when not inferable */
  organizationalMomentum: OrganizationalMomentum;
  /** Governance readiness, defaults to "MODERATE" when not inferable */
  governanceReadiness: GovernanceReadiness;
  /** Warnings from the ILAE audit */
  contextualWarnings: string[];
}
