import { FinancialInsightRegistry, FinancialInsight } from './FinancialInsightRegistry';
import { ExecutiveQuestionGenerator } from './ExecutiveQuestionGenerator';
import { FinancialIntelligenceMemory, MemorySnapshot } from './FinancialIntelligenceMemory';
import { FinancialDiagnosticValidator, ValidationInput } from '../calibration/FinancialDiagnosticValidator';
import { FinancialContradictionDetector } from '../calibration/FinancialContradictionDetector';
import { ExecutiveDiagnosisResolver } from '../calibration/ExecutiveDiagnosisResolver';
import { FinancialReasoningStatus } from '../calibration/contracts/CalibrationContracts';

export interface UnifiedFinancialIntelligenceContext {
  financialHealthProfile: string;
  criticalFindings: FinancialInsight[];
  strategicThemes: string[];
  executiveQuestions: string[];
  intelligenceTrace: string[];
  history: MemorySnapshot[];
  financialReasoningStatus?: FinancialReasoningStatus;
}

export class FinancialIntelligenceCoordinator {
  private registry = new FinancialInsightRegistry();
  private questionGenerator = new ExecutiveQuestionGenerator();
  private memory = new FinancialIntelligenceMemory();
  private validator = new FinancialDiagnosticValidator();
  private detector = new FinancialContradictionDetector();
  private resolver = new ExecutiveDiagnosisResolver();

  public orchestrate(
    period: string,
    balanceSheetContext: any,
    performanceContext: any,
    cashFlowContext: any,
    decisionContext: any
  ): UnifiedFinancialIntelligenceContext {
    this.registry.clear();
    
    if (cashFlowContext?.signals?.attentionPoints?.includes("Lucro não convertido em caixa")) {
      this.registry.register({
        finding: "PROFIT_WITHOUT_CASH",
        origin: "CashConversionEngine",
        severity: "HIGH",
        confidence: 90,
        period
      });
    }

    if (performanceContext?.signals?.attentionPoints?.includes("Deterioração de Margem")) {
      this.registry.register({
        finding: "VALUE_DESTRUCTION_RISK",
        origin: "ProfitabilityRelationshipEngine",
        severity: "CRITICAL",
        confidence: 95,
        period
      });
    }

    const allFindings = this.registry.getInsights();
    const criticalFindings = this.registry.getCriticalFindings();
    const executiveQuestions = this.questionGenerator.generate(allFindings);

    // 1. Raw Diagnosis from naive rules
    let rawHealthProfile = "STABLE_OPERATION";
    if (criticalFindings.some(f => f.finding === 'PROFIT_WITHOUT_CASH')) {
      rawHealthProfile = "LIQUIDITY_STRESS";
    }

    // 2. Cognitive Governance Calibration
    const validationInput: ValidationInput = {
      diagnosis: rawHealthProfile,
      liquidityImmediate: balanceSheetContext?.kpis?.liquidityImmediate,
      debtRatio: balanceSheetContext?.kpis?.debtRatio,
      equityRatio: balanceSheetContext?.kpis?.equityRatio,
      netIncome: performanceContext?.kpis?.netIncome,
      operatingCashFlow: cashFlowContext?.kpis?.operatingCashFlow,
      revenueGrowth: performanceContext?.kpis?.revenueGrowth,
      ebitdaMarginGrowth: performanceContext?.kpis?.ebitdaMarginGrowth,
      roe: performanceContext?.kpis?.roe,
      roic: performanceContext?.kpis?.roic,
      cashBalance: balanceSheetContext?.kpis?.cashBalance,
      receivablesGrowth: balanceSheetContext?.kpis?.receivablesGrowth
    };

    const validationResult = this.validator.validate(validationInput);
    const contradictions = this.detector.detect(validationInput);
    const resolvedDiagnosis = this.resolver.resolve(validationResult, contradictions);

    // 3. Apply Calibration
    const calibratedProfile = resolvedDiagnosis.resolvedDiagnosis;
    const reasoningStatus: FinancialReasoningStatus = {
      calibrated: true,
      confidenceLevel: resolvedDiagnosis.confidence,
      contradictionsResolved: contradictions.length,
      evidenceQuality: validationResult.validationStatus === "VALID" ? "HIGH" : (validationResult.validationStatus === "CONFLICT" ? "MEDIUM" : "LOW")
    };

    let traceLog = [
      'Data aggregated',
      'Engines executed',
      `Calibration applied: ${resolvedDiagnosis.detectedConflict} conflict detected and resolved.`
    ];

    this.memory.saveSnapshot(period, {
      profile: calibratedProfile,
      topRisks: criticalFindings.map(f => f.finding),
      keyEvolutions: ["Stable growth recorded"] // Mock evolution
    });

    return {
      financialHealthProfile: calibratedProfile,
      criticalFindings,
      strategicThemes: ['Liquidity Management', 'Operational Efficiency'],
      executiveQuestions,
      intelligenceTrace: traceLog,
      history: this.memory.getHistory(),
      financialReasoningStatus: reasoningStatus
    };
  }
}
