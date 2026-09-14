import { InstitutionalContext, RuntimeConfidence, EngineExecutionResult } from './types';

export class ConfidencePropagator {
  
  static evaluateInputConfidence(context: InstitutionalContext) {
    if (context.input.isMockData) {
      context.globalConfidence = 'LOW';
      return;
    }

    if (context.input.historicalCyclesCount < 2) {
      this.downgradeConfidence(context, 'MEDIUM');
    }
    
    if (!context.input.dreData || !context.input.dfcData) {
      this.downgradeConfidence(context, 'LOW');
    }
  }

  static propagateEngineConfidence(context: InstitutionalContext, result: EngineExecutionResult) {
    if (!result.success) {
       this.downgradeConfidence(context, 'LOW');
       return;
    }

    // Downgrade global confidence if an engine reports low confidence
    if (result.confidence === 'LOW') {
      this.downgradeConfidence(context, 'LOW');
    } else if (result.confidence === 'MEDIUM') {
      this.downgradeConfidence(context, 'MEDIUM');
    }
  }

  private static downgradeConfidence(context: InstitutionalContext, target: RuntimeConfidence) {
    const weights = { 'HIGH': 3, 'MEDIUM': 2, 'LOW': 1 };
    
    if (weights[target] < weights[context.globalConfidence]) {
      context.globalConfidence = target;
    }
  }
}
