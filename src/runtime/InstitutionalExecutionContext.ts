import { InstitutionalContext, RuntimeInput } from './types';
import { buildFiscalYearScope } from './FiscalYearScopeBuilder';

export class InstitutionalExecutionContext {
  static create(input: RuntimeInput): InstitutionalContext {
    // FYSIF v1.0 (Fiscal Year Scope Isolation Framework)
    // Prevent future year data from bleeding into analysis of past years
    const rawData = input.rawFinancialData || {};
    const selectedYear = Number(rawData.filterYear);
    
    if (rawData.allHistoryData && Array.isArray(rawData.allHistoryData) && !isNaN(selectedYear)) {
      // Create scope using FiscalYearScopeBuilder
      const scope = buildFiscalYearScope({
        selectedYear,
        allHistoryData: rawData.allHistoryData,
        foundationYear: rawData.foundationYear,
        analysisMode: rawData.analysisMode || 'ANNUAL'
      });
      
      // Inject scope into rawData for engines
      input.rawFinancialData = {
        ...rawData,
        scope,
        // Engines that still read allHistoryData directly for legacy reasons will get historicalDataToDate
        allHistoryData: scope.historicalDataToDate
      };
    }

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

  static addViolation(context: InstitutionalContext, rule: string, severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL', message: string, sourceEngine?: string, blocked?: boolean) {
    const isBlocked = blocked !== undefined ? blocked : (severity === 'CRITICAL');
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
