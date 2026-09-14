import type { NarrativeContext } from "./narrative-context-types";

/** Minimal contract for the mapper – avoids pulling the full runtime type. */
export interface DRENarrativeReportLike {
  narrativeContext?: NarrativeContext;
  // DRE‑related numeric fields needed by the narrative engine
  ebitda?: number;
  ebitdaMargin?: number;
  breakEvenGap?: number;
  economicStatus?: string;
}

/** Input accepted by the pure engine. */
export interface DRENarrativeInput {
  narrativeContext?: NarrativeContext;
  ebitda?: number;
  ebitdaMargin?: number;
  breakEvenGap?: number;
  economicStatus?: string;
}

/** Context exposed to UI (type‑only). */
export type DRENarrativeContext = Pick<
  NarrativeContext,
  "institutionalStage" | "confidenceLevel" | "organizationalMomentum" | "governanceReadiness" | "contextualWarnings"
>;

/** Full narrative object – includes the mandatory fiduciary disclaimer. */
export interface DRENarrative {
  ebitdaNarrative: string;
  marginNarrative: string;
  breakEvenNarrative: string;
  economicNarrative: string;
  /** Fixed disclaimer – never altered. */
  fiduciaryDisclaimer: string;
}
