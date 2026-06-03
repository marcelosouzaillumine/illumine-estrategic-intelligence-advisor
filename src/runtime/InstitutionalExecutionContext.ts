import { InstitutionalContext, RuntimeInput } from './types';
import { buildFiscalYearScope } from './FiscalYearScopeBuilder';
import { TemporalEvidenceFilter } from '../core/runtime/temporal-governance/TemporalEvidenceFilter';

export class InstitutionalExecutionContext {
  static create(input: RuntimeInput): InstitutionalContext {
    // FYSIF v1.0 (Fiscal Year Scope Isolation Framework)
    // Prevent future year data from bleeding into analysis of past years
    const rawData = input.rawFinancialData || {};
    const selectedYear = Number(rawData.filterYear);
    
    let filteredInput = { ...input };
    let tempValidation: any = null;

    if (!isNaN(selectedYear)) {
      const filterRes = TemporalEvidenceFilter.filter(input, selectedYear);
      filteredInput = filterRes.filteredRawData;
      tempValidation = filterRes.validationResult;
    }

    const rawDataFiltered = filteredInput.rawFinancialData || {};

    if (rawDataFiltered.allHistoryData && Array.isArray(rawDataFiltered.allHistoryData) && !isNaN(selectedYear)) {
      // Create scope using FiscalYearScopeBuilder
      const scope = buildFiscalYearScope({
        selectedYear,
        allHistoryData: rawDataFiltered.allHistoryData,
        foundationYear: rawDataFiltered.foundationYear,
        analysisMode: rawDataFiltered.analysisMode || 'ANNUAL'
      });
      
      // Inject scope into rawData for engines
      filteredInput.rawFinancialData = {
        ...rawDataFiltered,
        scope,
        // Engines that still read allHistoryData directly for legacy reasons will get historicalDataToDate
        allHistoryData: scope.historicalDataToDate
      };
    }

    const context: InstitutionalContext = {
      input: filteredInput,
      normalizedData: {},
      inferences: {},
      globalConfidence: 'HIGH', // Starts high, downgrades on issues
      violations: [],
      executedEngines: [],
      executionStatus: 'PENDING',
    };

    if (tempValidation && tempValidation.temporalIntegrity === 'FILTERED_WITH_BLOCKED_YEARS') {
      InstitutionalExecutionContext.addViolation(
        context,
        'TEMPORAL_FIDUCIARY_VIOLATION',
        'CRITICAL',
        `Future cycle contamination detected: year > ${selectedYear} is blocked under ${tempValidation.perspective} perspective.`,
        'TemporalEvidenceFilter',
        true
      );
    } else if (tempValidation && tempValidation.temporalIntegrity === 'INVALID') {
      InstitutionalExecutionContext.addViolation(
        context,
        'TEMPORAL_FIDUCIARY_VIOLATION',
        'CRITICAL',
        `Temporal integrity is INVALID. Bypassed or overridden temporal protection.`,
        'TemporalEvidenceFilter',
        true
      );
    }

    return context;
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
