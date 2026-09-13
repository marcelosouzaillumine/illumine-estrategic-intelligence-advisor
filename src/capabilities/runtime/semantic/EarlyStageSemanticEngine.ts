import { LifecycleClassificationEngine, LifecycleStage, LifecycleClassificationParams } from './LifecycleClassificationEngine';
import { EarlyStageNarrativeEngine } from './EarlyStageNarrativeEngine';
import { EarlyStageConsistencyValidator } from './EarlyStageConsistencyValidator';

export interface SemanticContext {
  isEarlyStage: boolean;
  confidence: number;
  foundationYear: number;
  analysisYear: number;
  historicalCycles: number;
}

export interface EarlyStageSemanticResult {
  lifecycleStage: LifecycleStage;
  semanticContext: SemanticContext;
}

export class EarlyStageSemanticEngine {
  public static evaluateContext(params: LifecycleClassificationParams): EarlyStageSemanticResult {
    const lifecycleStage = LifecycleClassificationEngine.classify(params);
    const foundation = params.foundationYear ?? (params.analysisYear - params.historicalCycles + 1);

    const isEarlyStage = lifecycleStage === 'INITIAL_CAPITALIZATION' || lifecycleStage === 'EARLY_GROWTH';
    const confidence = isEarlyStage ? 0.9 : 1.0;

    return {
      lifecycleStage,
      semanticContext: {
        isEarlyStage,
        confidence,
        foundationYear: foundation,
        analysisYear: params.analysisYear,
        historicalCycles: params.historicalCycles
      }
    };
  }

  public static generateNarrative(lifecycleStage: LifecycleStage, defaultNarrative: string, hasPositiveEquity: boolean): string {
    return EarlyStageNarrativeEngine.interpret(lifecycleStage, defaultNarrative, { hasPositiveEquity });
  }

  public static validateNarrative(lifecycleStage: LifecycleStage, narrativeText: string): void {
    EarlyStageConsistencyValidator.validate(lifecycleStage, narrativeText);
  }
}
