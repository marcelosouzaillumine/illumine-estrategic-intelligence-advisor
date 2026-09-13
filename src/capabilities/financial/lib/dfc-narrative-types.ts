import type { NarrativeContext } from "./narrative-context-types";

/** Input accepted by the pure engine. */
export interface DFCNarrativeInput {
  narrativeContext?: NarrativeContext;
  fco?: number;
  fci?: number;
  fcf?: number;
  runwayMonths?: number;
  externalCapitalDependency?: number;
  cashGenerationQuality?: string;
  growthFinancingMode?: "OPERATIONAL" | "DEBT" | "EQUITY" | "MIXED";
}

/** Minimal contract for the mapper – avoids pulling the full runtime type. */
export interface DFCNarrativeReportLike {
  narrativeContext?: NarrativeContext;
  fco?: number;
  fci?: number;
  fcf?: number;
  runwayMonths?: number;
  externalCapitalDependency?: number;
  cashGenerationQuality?: string;
  growthFinancingMode?: "OPERATIONAL" | "DEBT" | "EQUITY" | "MIXED";
}

/** Full narrative object – includes the mandatory fiduciary disclaimer. */
export interface DFCNarrative {
  fcoNarrative: string;
  fciNarrative: string;
  fcfNarrative: string;
  runwayNarrative: string;
  capitalDependencyNarrative: string;
  cashQualityNarrative: string;
  financingModeNarrative: string;
  fiduciaryDisclaimer: string; // fixed text, never altered
}
