import { InstitutionalContext, RuntimeInput } from './types';

export class InstitutionalExecutionContext {
  static create(input: RuntimeInput): InstitutionalContext {
    return {
      input,
      normalizedData: {},
      inferences: {},
      globalConfidence: 'HIGH', // Starts high, downgrades on issues
      violations: [],
      executedEngines: [],
      executionStatus: 'PENDING',
    };
  }

  static addViolation(context: InstitutionalContext, rule: string, severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL', message: string, sourceEngine?: string) {
    const isBlocked = severity === 'CRITICAL' || severity === 'HIGH';
    context.violations.push({
      rule,
      severity,
      message,
      sourceEngine,
      blocked: isBlocked
    });
    
    if (isBlocked) {
      context.executionStatus = 'BLOCKED';
    }
  }
}
