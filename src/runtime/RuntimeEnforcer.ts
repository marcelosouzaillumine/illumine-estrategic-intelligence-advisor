import { InstitutionalContext, EngineExecutionResult } from './types';
import { InstitutionalExecutionContext } from './InstitutionalExecutionContext';

export class RuntimeEnforcer {
  static enforcePostExecution(context: InstitutionalContext, result: EngineExecutionResult) {
    if (!result.success || !result.inference) {
       return; // Handle missing results generally
    }

    const inference = result.inference;

    // 1. Validate Causality
    if (!inference.causality || inference.causality.length === 0) {
      if (inference.narrative) {
        InstitutionalExecutionContext.addViolation(
          context,
          'NARRATIVE_WITHOUT_CAUSALITY',
          'CRITICAL',
          `Bloqueio Institucional: Engine ${result.engineName} gerou narrativa sem estabelecer cadeia causal.`,
          result.engineName
        );
      }
    }

    // 2. Validate Confidence propagation
    if (!inference.confidence) {
      InstitutionalExecutionContext.addViolation(
        context,
        'MISSING_CONFIDENCE',
        'HIGH',
        `Engine ${result.engineName} não declarou nível de confiança.`,
        result.engineName
      );
    }

    // 3. Ensure scores are traceable (have causality and confidence)
    if (inference.score !== null && inference.score !== undefined) {
      if (!inference.causality || inference.confidence === 'LOW') {
        InstitutionalExecutionContext.addViolation(
          context,
          'SCORE_WITHOUT_EVIDENCE',
          'HIGH',
          `Bloqueio Institucional: Score gerado com confiança LOW ou sem causalidade por ${result.engineName}.`,
          result.engineName
        );
      }
    }

    // Pass violations from engine internally
    if (result.violations) {
      result.violations.forEach(v => {
        InstitutionalExecutionContext.addViolation(context, v.rule, v.severity, v.message, result.engineName);
      });
    }
  }
}
