import { ExecutiveDiagnosticJourney } from '../journeys/diagnostic-journey';
import { DiagnosticExecutionContext, DiagnosticResponse } from '../core/diagnostic-types';
import { SampleIntelligenceProfile } from './sample-profile';
import { SampleDiagnosticEvaluator } from './sample-evaluator';
import { ExecutiveDiagnostic } from '../core/diagnostic-contracts';
import { SAMPLE_DIMENSIONS, SAMPLE_DOMAIN } from './sample-model';
import { SAMPLE_QUESTIONS } from './sample-questions';
import { DiagnosticScore } from '../core/scoring-engine';

export class SampleDiagnosticJourney extends ExecutiveDiagnosticJourney {
  private evaluator = new SampleDiagnosticEvaluator();
  private currentContext!: DiagnosticExecutionContext;
  private currentScore?: DiagnosticScore;
  
  public get descriptor(): ExecutiveDiagnostic {
    return {
      id: 'diag_sample_v1',
      journeyId: 'sample-governance',
      name: 'Sample Governance Diagnostic™',
      domain: SAMPLE_DOMAIN,
      description: 'A mock diagnostic journey to test plugin architecture.',
      dimensions: SAMPLE_DIMENSIONS,
      questions: SAMPLE_QUESTIONS,
      scoringEngine: {
        calculate: (ctx) => this.evaluator.calculateScores(ctx)
      },
      generateProfile: async (ctx) => {
        const score = await this.evaluator.calculateScores(ctx);
        return this.evaluator.generateInterpretation(ctx, score);
      }
    };
  }

  public async initialize(context: DiagnosticExecutionContext): Promise<void> {
    this.currentContext = context;
  }

  public async collectResponses(responses: DiagnosticResponse[]): Promise<void> {
    this.currentContext.responses = responses;
  }

  public async evaluate(): Promise<void> {
    this.currentScore = await this.evaluator.calculateScores(this.currentContext);
  }

  public async generateProfile(): Promise<SampleIntelligenceProfile> {
    if (!this.currentScore) {
      await this.evaluate();
    }
    return this.evaluator.generateInterpretation(this.currentContext, this.currentScore!);
  }

  public async recommendActions(): Promise<string[]> {
    const profile = await this.generateProfile();
    return ['sample-action'];
  }
}
