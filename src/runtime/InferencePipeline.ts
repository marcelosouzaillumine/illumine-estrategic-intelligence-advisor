import { InstitutionalContext } from './types';
import { EngineRegistry } from './EngineRegistry';
import { ExecutionGuard } from './ExecutionGuard';
import { ConfidencePropagator } from './ConfidencePropagator';
import { RuntimeEnforcer } from './RuntimeEnforcer';

export class InferencePipeline {
  static async execute(context: InstitutionalContext): Promise<void> {
    context.executionStatus = 'RUNNING';

    // Base evaluation of input confidence
    ConfidencePropagator.evaluateInputConfidence(context);

    const engines = EngineRegistry.getAllEnginesOrdered();

    for (const engine of engines) {
      // Check if execution is blocked system-wide
      if (context.executionStatus === 'BLOCKED') {
        console.warn(`[InferencePipeline] Execução interrompida. Pipeline bloqueado antes de ${engine.name}.`);
        break;
      }

      // 1. Guard Check
      const canExecute = ExecutionGuard.canExecute(engine, context);
      if (!canExecute) {
        // Guard already logged violation and potentially blocked context
        continue;
      }

      try {
        // 2. Execute Engine
        const result = await engine.execute(context);

        // 3. Register execution success
        if (result.success && result.inference) {
           context.inferences[engine.name] = result.inference;
           context.executedEngines.push(engine.name);
        }

        // 4. Post-Execution Enforce
        RuntimeEnforcer.enforcePostExecution(context, result);

        // 5. Propagate Confidence
        ConfidencePropagator.propagateEngineConfidence(context, result);

      } catch (error: any) {
        // Institutional fail-safe for engine crash
        console.error(`[InferencePipeline] Engine ${engine.name} falhou miseravelmente.`, error);
        context.globalConfidence = 'LOW';
        context.violations.push({
           rule: 'ENGINE_CRASH',
           severity: 'CRITICAL',
           message: `Engine ${engine.name} crash: ${error.message}`,
           sourceEngine: engine.name,
           blocked: true
        });
        context.executionStatus = 'BLOCKED';
      }
    }

    if (context.executionStatus !== 'BLOCKED') {
       context.executionStatus = 'COMPLETED';
    }
  }
}
