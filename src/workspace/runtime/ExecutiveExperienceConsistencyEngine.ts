import { ExecutiveIntelligenceReport } from './executive-intelligence-runtime';

export interface ConsistencyValidationResult {
  isValid: boolean;
  inconsistencies: string[];
  severityLevel: 'INFO' | 'WARNING' | 'ERROR';
}

export class ExecutiveExperienceConsistencyEngine {
  public static validate(report: ExecutiveIntelligenceReport): ConsistencyValidationResult {
    const inconsistencies: string[] = [];

    const score = report.scores?.composite ?? 0;
    const severity = report.severity?.level;
    const mode = report.compliance?.runtimeMode;

    // 1. Score vs Severity consistency
    if (severity === 'CRÍTICO' || severity === 'COLAPSO' || severity === 'ESTRESSADO') {
      if (score > 70) {
        inconsistencies.push(`Inconsistência de Score/Severidade: Nível de risco é "${severity}" mas score de saúde composto é alto (${score}/100).`);
      }
    } else if (severity === 'SAUDÁVEL') {
      if (score < 40) {
        inconsistencies.push(`Inconsistência de Score/Severidade: Nível de risco é "${severity}" mas score de saúde composto é baixo (${score}/100).`);
      }
    }

    // 2. Mode vs Data consistency
    const hasDRE = report.metrics?.financialMetrics?.hasDRE ?? true; // fallback to true if undefined
    if (mode === 'FULL_FINANCIAL_VIEW') {
      const hasCashFlow = report.metrics?.financialMetrics?.hasCashFlow ?? true;
      if (!hasCashFlow) {
        inconsistencies.push('Inconsistência de Modo: Classificado como "FULL_FINANCIAL_VIEW" mas DFC está ausente.');
      }
    }

    // 3. Narrative Contradiction check
    const summary = report.advisory?.executiveSummary?.toLowerCase() ?? '';
    if (summary.includes('excelente saúde') && (severity === 'CRÍTICO' || severity === 'COLAPSO')) {
      inconsistencies.push('Contradição Semântica: Narrativa indica saúde excelente, mas severidade indica crise.');
    }

    let validationSeverity: 'INFO' | 'WARNING' | 'ERROR' = 'INFO';
    if (inconsistencies.length > 0) {
      validationSeverity = 'WARNING';
    }

    return {
      isValid: inconsistencies.length === 0,
      inconsistencies,
      severityLevel: validationSeverity
    };
  }
}
