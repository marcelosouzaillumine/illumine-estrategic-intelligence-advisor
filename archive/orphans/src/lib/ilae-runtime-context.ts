// src/lib/ilae-runtime-context.ts

/**
 * Minimal runtime context needed for ILAE integration.
 * All fields are optional – missing data stays undefined,
 * which naturally reduces dataConfidence downstream.
 */
export type ILAERuntimeContext = {
  fiscalYears?: number;
  ebitda?: number;
  fco?: number;
  runwayMonths?: number;
  recentCapitalization?: boolean;
  revenueGrowth?: number;
  capitalConsumed?: number;
};
