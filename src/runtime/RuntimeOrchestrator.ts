import { RuntimeInput, RuntimeOutput, AdvisoryNarrative } from './types';
import { InstitutionalExecutionContext } from './InstitutionalExecutionContext';
import { InferencePipeline } from './InferencePipeline';

export class RuntimeOrchestrator {
  /**
   * PONTO DE ENTRADA ÚNICO DA PLATAFORMA ILLUMINE
   * Toda inteligência institucional deve passar obrigatoriamente por aqui.
   */
  static async runInstitutionalAnalysis(input: RuntimeInput, engineType?: string): Promise<RuntimeOutput> {
    // 1. Initialize Context
    const context = InstitutionalExecutionContext.create(input);

    // 2. Execute Institutional Pipeline
    await InferencePipeline.execute(context, engineType);

    // 3. Consolidate Output
    const hasCriticalViolations = context.violations.some(v => v.severity === 'CRITICAL');
    const hasHighViolations = context.violations.some(v => v.severity === 'HIGH');
    
    let finalStatus: RuntimeOutput['status'] = 'SUCCESS';
    if (context.executionStatus === 'BLOCKED' || hasCriticalViolations) {
      finalStatus = 'BLOCKED';
    } else if (hasHighViolations) {
      finalStatus = 'NON_COMPLIANT';
    } else if (context.violations.length > 0) {
      finalStatus = 'PARTIALLY_COMPLIANT';
    }

    // 4. Assemble final advisory and scores from successful inferences
    const consolidatedAdvisory: AdvisoryNarrative[] = [];
    const consolidatedScores: Record<string, number | string> = {};

    Object.values(context.inferences).forEach(inference => {
       if (inference.narrative) consolidatedAdvisory.push(inference.narrative);
       if (inference.score !== null) consolidatedScores[inference.domain] = inference.score;
    });

    return {
      status: finalStatus,
      globalConfidence: context.globalConfidence,
      inferences: context.inferences,
      advisory: consolidatedAdvisory,
      scores: consolidatedScores,
      violations: context.violations,
      context: context // Included for auditing / debugging
    };
  }
}

// Export the function directly as requested
export const runInstitutionalAnalysis = RuntimeOrchestrator.runInstitutionalAnalysis;
