import { DiagnosticExecutionContext, MaturityLevel } from '../core/diagnostic-types';
import { DiagnosticScore } from '../core/scoring-engine';
import { SampleIntelligenceProfile } from './sample-profile';
import { SAMPLE_DOMAIN } from './sample-model';

export class SampleDiagnosticEvaluator {
  public async calculateScores(context: DiagnosticExecutionContext): Promise<DiagnosticScore> {
    const dimensionScores: Record<string, number> = {};
    let totalScore = 0;
    
    // Very simple evaluation mock
    let score = 0;
    if (context.responses.length > 0 && context.responses[0].selectedOptionId === 'opt1') {
      score = 5;
    }
    
    let maturityLevel: MaturityLevel = 'initial';
    if (score === 5) maturityLevel = 'excellence';

    return {
      dimensionScores: {
        'dim_sample_test': score
      },
      overallScore: score,
      maturityLevel
    };
  }

  public async generateInterpretation(
    context: DiagnosticExecutionContext, 
    score: DiagnosticScore
  ): Promise<SampleIntelligenceProfile> {
    
    return {
      domain: SAMPLE_DOMAIN,
      maturityLevel: score.maturityLevel,
      strengths: ['Sample Strength'],
      attentionPoints: score.overallScore < 5 ? ['att_sample_warning'] : [],
      executiveInsights: ['Sample Insight'],
      recommendedActions: ['Sample Action'],
      isSample: true
    };
  }
}
