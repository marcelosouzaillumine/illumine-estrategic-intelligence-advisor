import { DiagnosticExecutionContext } from './diagnostic-types';
import { DiagnosticScore } from './scoring-engine';
import { ExecutiveIntelligenceProfile } from '../models/executive-intelligence-profile';

export interface InterpretationEngine {
  /**
   * Transforms raw scoring metrics into executive language.
   * Generates insights, defines priorities, and constructs recommendations.
   * This encapsulates the proprietary intelligence of Illumine.
   */
  interpret(
    context: DiagnosticExecutionContext, 
    score: DiagnosticScore
  ): Promise<ExecutiveIntelligenceProfile>;
}
