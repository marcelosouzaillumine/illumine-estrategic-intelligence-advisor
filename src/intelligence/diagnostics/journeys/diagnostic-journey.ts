import { DiagnosticExecutionContext, DiagnosticResponse } from '../core/diagnostic-types';
import { ExecutiveIntelligenceProfile } from '../models/executive-intelligence-profile';

export abstract class ExecutiveDiagnosticJourney {
  /**
   * Initializes the diagnostic session, loading necessary contexts or state.
   */
  abstract initialize(context: DiagnosticExecutionContext): Promise<void>;

  /**
   * Collects responses. In a UI this might be called interactively;
   * in an Agent flow, this might process bulk data.
   */
  abstract collectResponses(responses: DiagnosticResponse[]): Promise<void>;

  /**
   * Evaluates the collected data using the underlying ScoringEngine.
   */
  abstract evaluate(): Promise<void>;

  /**
   * Generates the final Executive Intelligence Profile using the InterpretationEngine.
   */
  abstract generateProfile(): Promise<ExecutiveIntelligenceProfile>;

  /**
   * Translates the profile into actionable business or platform recommendations.
   */
  abstract recommendActions(): Promise<string[]>;
}
