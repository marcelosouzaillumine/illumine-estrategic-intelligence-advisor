import { DiagnosticExecutionContext, MaturityLevel } from './diagnostic-types';

export interface DiagnosticScore {
  dimensionScores: Record<string, number>;
  overallScore: number;
  maturityLevel: MaturityLevel;
}

export interface ScoringEngine {
  /**
   * Calculates the internal score based on the raw responses.
   * This is designed to be asynchronous to allow future integration with
   * AI-based evaluation, external data enrichment, or background processing.
   */
  calculate(context: DiagnosticExecutionContext): Promise<DiagnosticScore>;
}
