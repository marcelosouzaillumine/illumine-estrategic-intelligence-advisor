import { BalanceSheetExecutiveViewModel } from '../../../types/executive/BalanceSheetExecutiveViewModel';
import { BalanceSheetExecutivePlanBuilder } from './BalanceSheetExecutivePlanBuilder';
import { ExecutiveConsistencyEngine } from './ExecutiveConsistencyEngine';
import { ExecutiveBusinessTerminologyTranslator } from './ExecutiveBusinessTerminologyRegistry';
import { ExecutiveSemanticRegistry } from './ExecutiveSemanticRegistry';
import { DisplaySemanticResolver } from '../executive-presentation/DisplaySemanticResolver';
import { NumericIntegrityGuard } from './NumericIntegrityGuard';
import { BalanceSheetTechnicalIndicatorEngine } from './BalanceSheetTechnicalIndicatorRegistry';
import { EvidenceSelector } from './EvidenceSelector';
import { TechnicalLayerBuilder } from './builders/TechnicalLayerBuilder';
import { AuditLayerBuilder } from './builders/AuditLayerBuilder';
import { InstitutionalContextBuilder } from './builders/InstitutionalContextBuilder';
import { DecisionTraceBuilder } from './builders/DecisionTraceBuilder';
import { ExecutiveLabelResolver } from '../executive-presentation/ExecutiveLabelResolver';
import { BalanceSheetDecisionPolicyLayer } from './BalanceSheetDecisionPolicyLayer';
import { BalanceSheetCompletenessGuard } from './BalanceSheetCompletenessGuard';
import { BalanceSheetExecutiveFactsBuilder } from './BalanceSheetExecutiveFactsBuilder';
import { BalanceSheetExecutiveOpinionBuilder } from './builders/BalanceSheetExecutiveOpinionBuilder';

export class BalanceSheetExecutiveViewModelBuilder {
  public static build(executiveReport: any, mode: 'strict' | 'safe' | 'unsafe' = 'safe', filterYear?: number, directBpSummary?: any, directIndicators?: any[]): BalanceSheetExecutiveViewModel {
    const rawReport = executiveReport || {};
    const {
      assessments,
      indicators
    } = rawReport.patrimonialIntelligenceReport || {};

    const interpretations = rawReport.patrimonialIntelligenceReport?.executiveInterpretation || rawReport.patrimonialIntelligenceReport?.interpretations;

    // --- Phase 1: Facts Builder ---
    const finalIndicators = directIndicators && directIndicators.length > 0 ? directIndicators : (indicators && indicators.length > 0 ? indicators : (rawReport.rawFinancialData?.financialIndicators || []));
    const facts = BalanceSheetExecutiveFactsBuilder.build(rawReport, finalIndicators, directBpSummary);

    const technicalLayerFallback = TechnicalLayerBuilder.build(
      finalIndicators,
      (key: string) => DisplaySemanticResolver.resolve('label', key) || key,
      undefined,
      facts,
      undefined
    );

    // --- Phase 2: Decision Policy Layer ---
    const institutionalStage = rawReport.institutionalView?.maturity?.stageLabel || rawReport.context?.stage || '';
    const policyResult = BalanceSheetDecisionPolicyLayer.applyPolicies(
      facts,
      assessments,
      institutionalStage
    );

    const formatFact = (val: any, decimals = 1, isPercent = false) => {
      if (val === undefined || val === null || val === 'LIMITED_EVIDENCE') return '';
      return `${(val * (isPercent ? 100 : 1)).toFixed(decimals)}${isPercent ? '%' : 'x'}`;
    };

    const liqStr = facts?.liquidityCurrent !== undefined && facts?.liquidityCurrent !== null ? `liquidez corrente de ${formatFact(facts.liquidityCurrent, 2, false)}` : '';
    const autStr = facts?.financialAutonomy !== undefined && facts?.financialAutonomy !== null ? `autonomia financeira de ${formatFact(facts.financialAutonomy, 1, true)}` : '';
    
    let baseReason = 'Diagnóstico sustentado pela evolução da estrutura patrimonial.';
    if (liqStr && autStr) {
      baseReason = `Diagnóstico sustentado por ${liqStr} e ${autStr}.`;
    } else if (liqStr) {
      baseReason = `Diagnóstico sustentado por ${liqStr}.`;
    } else if (autStr) {
      baseReason = `Diagnóstico sustentado por ${autStr}.`;
    }

    const resolvedInterpretations = policyResult.interpretations;
    const globalSeverityReason = resolvedInterpretations?.strategicSeverityReason || baseReason;

    // 1. Validate Consistency (Phase 2)
    const consistencyAudit = ExecutiveConsistencyEngine.validateStrategicAlignment(
      globalSeverityReason,
      policyResult.decisionPanels,
      mode
    );

    // 2. Build Executive Plan (Phase 1)
    const planObj = BalanceSheetExecutivePlanBuilder.buildPlan(policyResult.institutionalScenario?.policyProfile, resolvedInterpretations, institutionalStage, facts);

    // 3. Technical Indicators & Evidence Selection (Phases 3 & 4)
    const technicalIndicators = (indicators || []).map((ind: any) => {
      const canonicalMetric = BalanceSheetTechnicalIndicatorEngine.getMetadata(ind.metricName);
      let val = ind.value;
      if (val === 'INSUFFICIENT_DATA' || isNaN(val) || val === null || val === undefined) {
        val = 'Avaliação limitada por disponibilidade de evidências históricas';
      } else {
        // Here we should not use generic toFixed, but let DisplayValueFormatter do it if needed
        val = Number(val).toFixed(2);
      }

      return {
        familyName: DisplaySemanticResolver.resolve('familyName', ind.familyName || 'Indicadores Gerais'),
        label: DisplaySemanticResolver.resolve('label', ind.metricName),
        formula: DisplaySemanticResolver.resolve('formula', canonicalMetric?.formula || 'Fórmula dinâmica calculada pelo motor analítico institucional.'),
        value: String(val),
        classificationLabel: DisplaySemanticResolver.resolve('classificationLabel', ind.classification || ''),
        purpose: DisplaySemanticResolver.resolve('purpose', canonicalMetric?.purpose || 'Avaliação contextual.'),
        limitations: DisplaySemanticResolver.resolve('limitations', canonicalMetric?.limitations || 'Sem limitações conhecidas.'),
        referenceRange: String(canonicalMetric?.referenceRange || 'Depende do setor e do modelo operacional.'),
        methodologicalNotes: DisplaySemanticResolver.resolve('methodologicalNotes', canonicalMetric?.methodologicalNotes || ''),
        origin: {
          sourceEngine: 'BalanceSheetTechnicalIndicatorRegistry',
          sourceRule: 'Canonical Definition',
          confidence: 100,
          lastValidatedAt: new Date().toISOString()
        }
      };
    });

    const decisionPanels = {
      protection: policyResult.decisionPanels?.protection,
      liquidity: policyResult.decisionPanels?.liquidity,
      capitalStructure: policyResult.decisionPanels?.capitalStructure,
      workingCapital: policyResult.decisionPanels?.workingCapital,
      capitalEfficiency: policyResult.decisionPanels?.capitalEfficiency,
      assetQuality: policyResult.decisionPanels?.assetQuality
    } as any;

    const technicalLayer = TechnicalLayerBuilder.build(
      finalIndicators,
      (key: string) => DisplaySemanticResolver.resolve('label', key) || key,
      decisionPanels,
      facts,
      policyResult.institutionalScenario?.scenario
    );

    const auditLayer = AuditLayerBuilder.build(
      executiveReport.patrimonialStructuralRestrictions,
      executiveReport.patrimonialIntelligenceReport?.governanceConsistency,
      executiveReport.patrimonialIntelligenceReport?.scoreBreakdown?.globalScore,
      executiveReport.patrimonialIntelligenceReport?.scoreBreakdown?.criticalOffenders,
      (key: string) => DisplaySemanticResolver.resolve('label', key) || key
    );

    const institutionalContext = InstitutionalContextBuilder.build(
      executiveReport.context,
      DisplaySemanticResolver.resolve('label', executiveReport.institutionalView?.maturity?.stageLabel || executiveReport.context?.stage || '')
    );

    const emptyBase = this.buildEmpty();
    
    // 6. Integrate SIS properties
    const executiveOpinion = BalanceSheetExecutiveOpinionBuilder.buildOpinion(policyResult.institutionalScenario, facts);
    const criticalFactor = BalanceSheetExecutiveOpinionBuilder.buildCriticalFactor(policyResult.institutionalScenario, facts);
    const managementImplication = BalanceSheetExecutiveOpinionBuilder.buildManagementImplication(policyResult.institutionalScenario, facts);
    const recommendedAction = BalanceSheetExecutiveOpinionBuilder.buildRecommendedAction(policyResult.institutionalScenario, facts);
    const decisionTrace = DecisionTraceBuilder.build(
      policyResult.institutionalScenario,
      rawReport.patrimonialIntelligenceReport,
      filterYear || new Date().getFullYear(),
      facts
    );

    const rawViewModel: BalanceSheetExecutiveViewModel = {
      ...emptyBase,
      institutionalContext,
      auditLayer,
      institutionalScenario: policyResult.institutionalScenario ? {
        scenario: policyResult.institutionalScenario.scenario,
        confidence: DisplaySemanticResolver.resolve('confidence', policyResult.institutionalScenario.confidence),
        primaryDriver: policyResult.institutionalScenario.primaryDriver,
        secondaryDriver: policyResult.institutionalScenario.secondaryDriver,
        severity: DisplaySemanticResolver.resolve('severity', policyResult.institutionalScenario.severity),
        policyProfile: policyResult.institutionalScenario.policyProfile,
        liquidityIntent: DisplaySemanticResolver.resolve('liquidityIntent', policyResult.institutionalScenario.liquidityIntent)
      } : undefined,
      policyProfile: policyResult.institutionalScenario?.policyProfile,
      executiveOpinion,
      criticalFactor,
      managementImplication,
      recommendedAction,
      strategicSeverity: DisplaySemanticResolver.resolve('status', policyResult.institutionalScenario?.severity || 'MEDIUM'),
      strategicSeverityReason: globalSeverityReason,
      dominantRiskFamily: planObj.planTitle || resolvedInterpretations?.dominantRiskFamily || 'Diretrizes Estratégicas',
      patrimonialThesis: resolvedInterpretations?.patrimonialThesis || 'Estrutura Financeira',
      diagnosisOrigin: {
        sourceEngine: 'ExecutiveConsistencyEngine',
        sourceRule: 'Phase 2 Validation',
        confidence: consistencyAudit.confidenceScore,
        lastValidatedAt: new Date().toISOString()
      },
      planFinanceiro: planObj.planFinanceiro,
      planOperacional: planObj.planOperacional,
      planGovernanca: planObj.planGovernanca,
      planOrigin: planObj.planFinanceiro?.origin || { sourceEngine: 'BalanceSheetExecutivePlanBuilder', sourceRule: 'Fallback', confidence: 100, lastValidatedAt: new Date().toISOString() },
      decisionPanels: decisionPanels as any,
      technicalIndicators,
      isConsistent: consistencyAudit.isConsistent,
      consistencyViolations: consistencyAudit.violations,
      decisionTrace,
      technicalLayer: { families: technicalLayer as any }
    };

    NumericIntegrityGuard.verify(indicators || [], rawViewModel);
    const guardedViewModel = BalanceSheetCompletenessGuard.enforce(rawViewModel, facts, mode);

    // Conciliation
    const patrimonialIndex = facts.patrimonialIndex || 0;
    if (auditLayer?.globalScore !== undefined && auditLayer.globalScore > 70 && patrimonialIndex < 30 && patrimonialIndex > 0) {
      (guardedViewModel as any).compositeIndexesConciliation = 'Nota Metodológica: A sólida proteção patrimonial (Score elevado) reflete a estrutura de capital e o nível de liquidez acumulada, enquanto a Eficiência Operacional (EFOS reduzida) evidencia pressões de curto prazo no capital de giro ou margens. Ambas as leituras são independentes e não contraditórias.';
    } else if (auditLayer?.globalScore !== undefined && auditLayer.globalScore < 40 && patrimonialIndex > 70) {
      (guardedViewModel as any).compositeIndexesConciliation = 'Nota Metodológica: A eficiência operacional atual é forte, porém o baixo Score Patrimonial reflete desequilíbrios estruturais crônicos no endividamento ou liquidez de longo prazo.';
    }

    const testMode = process.env.NODE_ENV === 'test';
    const sanitizedViewModel = ExecutiveSemanticRegistry.enforceViewModelSemanticMatrix(
      guardedViewModel,
      policyResult.institutionalScenario?.scenario || 'STRUCTURALLY_BALANCED',
      testMode
    );

    return this.assertNoRawEnums(sanitizedViewModel);
  }

  private static assertNoRawEnums(vm: BalanceSheetExecutiveViewModel): BalanceSheetExecutiveViewModel {
    const vmString = JSON.stringify(vm);
    // Removed NaN, null, N/A from string regex to avoid false positives
    const forbiddenPattern = /\b(HEALTHY|UNHEALTHY|WARNING|ATTENTION|NEUTRAL|RESILIENT|MINOR_WARNINGS|MONITORING|STABLE|EXCELLENT|Debt-to-Equity|Working Capital)\b/;
    if (forbiddenPattern.test(vmString)) {
      console.warn('[SSOT-VIOLATION] Enum técnico ou termo não traduzido vazou para o ViewModel Final:', vmString.match(forbiddenPattern));
    }
    
    // Traversal to catch NaN, null, undefined in displayable string fields
    const deepSanitizeValues = (obj: any): any => {
      if (Array.isArray(obj)) {
        return obj.map(deepSanitizeValues);
      } else if (obj !== null && typeof obj === 'object') {
        const newObj: any = {};
        for (const key in obj) {
          const val = obj[key];
          if (val === null || val === undefined) {
            newObj[key] = val; // Preserva o tipo estrutural para não quebrar arrays (ex: criticalOffenders)
          } else if (typeof val === 'number' && Number.isNaN(val)) {
            newObj[key] = '—';
          } else if (typeof val === 'string' && (val === 'NaN' || val === 'N/A' || val === 'null' || val === 'undefined')) {
            newObj[key] = '—';
          } else {
            newObj[key] = deepSanitizeValues(val);
          }
        }
        return newObj;
      }
      return obj;
    };

    return deepSanitizeValues(vm);
  }

  public static buildEmpty(): BalanceSheetExecutiveViewModel {
    const origin = { sourceEngine: 'Fallback', sourceRule: 'Empty', confidence: 0, lastValidatedAt: new Date().toISOString() };
    return {
      strategicSeverity: 'MONITORING',
      strategicSeverityReason: 'Sem dados',
      dominantRiskFamily: 'N/A',
      patrimonialThesis: 'Aguardando dados',
      diagnosisOrigin: origin,
      planFinanceiro: { prazo: 'Curto Prazo', acao: '', origin },
      planOperacional: { prazo: 'Médio Prazo', acao: '', origin },
      planGovernanca: { prazo: 'Longo Prazo', acao: '', origin },
      planOrigin: origin,
      decisionPanels: {},
      technicalIndicators: [],
      isConsistent: true,
      consistencyViolations: [],
      institutionalContext: undefined,
      auditLayer: undefined,
      decisionTrace: [],
      technicalLayer: { families: [] }
    };
  }
}
