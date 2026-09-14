import { EngineDefinition, InstitutionalContext } from './types';
import { InstitutionalExecutionContext } from './InstitutionalExecutionContext';

export class ExecutionGuard {
  static canExecute(engine: EngineDefinition, context: InstitutionalContext): boolean {
    // 1. Check for missing dependencies
    const missingDeps = engine.dependencies.filter(dep => !context.executedEngines.includes(dep));
    if (missingDeps.length > 0) {
      InstitutionalExecutionContext.addViolation(
        context,
        'MISSING_DEPENDENCY',
        'CRITICAL',
        `Engine ${engine.name} blocked due to missing executed dependencies: ${missingDeps.join(', ')}`,
        engine.name
      );
      return false;
    }

    // 2. Check for required data in input
    for (const req of engine.requiredData) {
      if (!context.input[req]) {
        // Enforce specific institutional blocks
        if (req === 'dreData') {
          InstitutionalExecutionContext.addViolation(
            context,
            'MISSING_DRE',
            'HIGH',
            'Bloqueio Institucional: Inferência operacional e rentabilidade exigem DRE.',
            engine.name
          );
        } else if (req === 'dfcData') {
          InstitutionalExecutionContext.addViolation(
            context,
            'MISSING_DFC',
            'HIGH',
            'Bloqueio Institucional: Inferência de resiliência e geração de caixa exigem DFC.',
            engine.name
          );
        } else {
          InstitutionalExecutionContext.addViolation(
            context,
            'MISSING_REQUIRED_DATA',
            'HIGH',
            `Engine ${engine.name} blocked due to missing data: ${req}`,
            engine.name
          );
        }
        return false;
      }
    }

    // 3. Check for specific epistemological rules (e.g. historical data)
    if (engine.inferenceScope.includes('tendência') || engine.inferenceScope.includes('crescimento estrutural')) {
      if (context.input.historicalCyclesCount < 3) {
        InstitutionalExecutionContext.addViolation(
          context,
          'INSUFFICIENT_HISTORY',
          'HIGH',
          'Bloqueio Institucional: Inferências longitudinais (tendência) exigem no mínimo 3 ciclos.',
          engine.name
        );
        return false;
      }
    }

    // 4. Check for mock data
    if (context.input.isMockData) {
      // Do not block completely, but flag appropriately, could be handled in Enforcer or Propagator
    }

    return true;
  }
}
