import { ExecutiveDiagnosticJourney } from '../journeys/diagnostic-journey';
import { DiagnosticExecutionContext, DiagnosticResponse } from '../core/diagnostic-types';
import { GovernanceIntelligenceProfile } from './governance-profile';
import { GovernanceDiagnosticEvaluator } from './governance-evaluator';
import { ExecutiveDiagnostic } from '../core/diagnostic-contracts';
import { GOVERNANCE_DIMENSIONS, GOVERNANCE_DOMAIN } from './governance-model.v1';
import { GOVERNANCE_QUESTIONS } from './governance-questions.v1';
import { DiagnosticScore } from '../core/scoring-engine';

export class GovernanceDiagnosticJourney extends ExecutiveDiagnosticJourney {
  private evaluator = new GovernanceDiagnosticEvaluator();
  private currentContext!: DiagnosticExecutionContext;
  private currentScore?: DiagnosticScore;
  
  public get descriptor(): ExecutiveDiagnostic {
    return {
      id: 'diag_governance_v1',
      journeyId: 'governance-intelligence',
      name: 'Governance Intelligence Diagnostic Journey™',
      domain: GOVERNANCE_DOMAIN,
      description: 'Uma jornada executiva para compreender como sua organização estrutura decisões, responsabilidades e mecanismos de liderança.',
      dimensions: GOVERNANCE_DIMENSIONS,
      questions: GOVERNANCE_QUESTIONS,
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

  public async generateProfile(): Promise<GovernanceIntelligenceProfile> {
    if (!this.currentScore) {
      await this.evaluate();
    }
    return this.evaluator.generateInterpretation(this.currentContext, this.currentScore!);
  }

  public async recommendActions(): Promise<string[]> {
    const profile = await this.generateProfile();
    return profile.signature.evolutionVectors;
  }
}
