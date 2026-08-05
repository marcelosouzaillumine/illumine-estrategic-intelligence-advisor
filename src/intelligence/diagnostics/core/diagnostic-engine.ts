import { DiagnosticExecutionContext } from './diagnostic-types';
import { ExecutiveIntelligenceProfile } from '../models/executive-intelligence-profile';
import { ScoringEngine } from './scoring-engine';
import { InterpretationEngine } from './interpretation-engine';

export class DiagnosticEngine {
  constructor(
    private readonly scoringEngine: ScoringEngine,
    private readonly interpretationEngine: InterpretationEngine
  ) {}

  /**
   * Orchestrates the full diagnostic execution pipeline:
   * Context -> Score -> Interpretation -> Profile
   */
  async execute(context: DiagnosticExecutionContext): Promise<ExecutiveIntelligenceProfile> {
    const score = await this.scoringEngine.calculate(context);
    const profile = await this.interpretationEngine.interpret(context, score);
    
    return profile;
  }
}
