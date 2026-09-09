import { ExecutiveDiagnosticJourney } from '../journeys/diagnostic-journey';
import { DiagnosticExecutionContext, DiagnosticResponse } from '../core/diagnostic-types';
import { FinancialIntelligenceProfile } from './financial-profile';
import { FinancialDiagnosticEvaluator } from './financial-evaluator';
import { ExecutiveDiagnostic } from '../core/diagnostic-contracts';
import { FINANCIAL_DIMENSIONS, FINANCIAL_DOMAIN } from './financial-model.v1';
import { FINANCIAL_QUESTIONS_V1 } from './financial-questions.v1';
import { DiagnosticScore } from '../core/scoring-engine';

export class FinancialDiagnosticJourney extends ExecutiveDiagnosticJourney {
  private evaluator = new FinancialDiagnosticEvaluator();
  private currentContext!: DiagnosticExecutionContext;
  private currentScore?: DiagnosticScore;
  
  public get descriptor(): ExecutiveDiagnostic {
    return {
      id: 'diag_financial_v1',
      journeyId: 'financial-governance',
      name: 'Financial Governance Diagnostic Journey™',
      domain: FINANCIAL_DOMAIN,
      description: 'Avaliação da maturidade e capacidade de antecipação financeira da organização.',
      dimensions: FINANCIAL_DIMENSIONS,
      questions: FINANCIAL_QUESTIONS_V1,
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

  public async generateProfile(): Promise<FinancialIntelligenceProfile> {
    if (!this.currentScore) {
      await this.evaluate();
    }
    return this.evaluator.generateInterpretation(this.currentContext, this.currentScore!);
  }

  public async recommendActions(): Promise<string[]> {
    const profile = await this.generateProfile();
    return profile.recommendedActions;
  }
}
