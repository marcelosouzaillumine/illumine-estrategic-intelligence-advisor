import { EngineDefinition, InstitutionalContext, EngineExecutionResult, InferenceBlock, CausalityChain, AdvisoryNarrative } from '../types';
import { CapitalMetricRegistry } from '../governance/capital/CapitalMetricRegistry';
import { CapitalLineageEngine } from '../governance/capital/CapitalLineageEngine';
import { CapitalClassificationEngine } from '../governance/capital/CapitalClassificationEngine';
import { CapitalGovernanceSemanticEngine } from '../governance/capital/CapitalGovernanceSemanticEngine';
import { CapitalGovernancePropagationAudit } from '../governance/capital/CapitalGovernancePropagationAudit';

const localNormalizeString = (s: string) => 
  s.toLowerCase()
   .normalize('NFD')
   .replace(/[\u0300-\u036f]/g, "")
   .replace(/^[0-9.]+\s*[-]\s*/, '')
   .replace(/^[()=/\-+.\s]+|[()=/\-+.\s]+$/g, '')
   .trim();

const matchDocType = (d: any, docTypes: string[]) => {
  const typeNorm = localNormalizeString(d.type || '');
  const docTypeNorm = localNormalizeString(d.docType || '');
  const entryTypeNorm = localNormalizeString(d.entryType || '');
  return docTypes.some(t => {
    const tNorm = localNormalizeString(t);
    return typeNorm === tNorm || docTypeNorm === tNorm || entryTypeNorm === tNorm;
  });
};

export function extractSovereignNetIncome(allHistoryData: any[], filterYear: number, input: any): number | null {
  const dreEntries = allHistoryData.filter((d: any) => 
    Number(d.year) === filterYear && matchDocType(d, ['dre', 'resultado'])
  );

  const aliases = [
    'netIncome',
    'resultadoLiquido',
    'lucroLiquido',
    'prejuizoLiquido',
    'lucroPrejuizoDoExercicio',
    'resultadoDoExercicio'
  ];
  
  const normalizedAliases = aliases.map(localNormalizeString);

  const matchedEntry = dreEntries.find((d: any) => {
    const c = localNormalizeString(d.conta || d.category || d.item || '');
    return normalizedAliases.some(alias => c === alias || c.includes(alias));
  });

  if (matchedEntry) {
    const val = matchedEntry.val ?? matchedEntry.valor ?? matchedEntry.value;
    if (val !== undefined && val !== null) {
      let numVal = Number(val);
      const nameNorm = localNormalizeString(matchedEntry.conta || matchedEntry.category || matchedEntry.item || '');
      if (nameNorm.includes('prejuizo') && numVal > 0) {
        numVal = -numVal;
      }
      return numVal;
    }
  }

  if (input.lucroLiquido !== undefined && input.lucroLiquido !== null) {
    return Number(input.lucroLiquido);
  }

  return null;
}

export function extractCapitalSocial(
  allHistoryData: any[],
  filterYear: number,
  input: any,
  financialInf: any
): {
  value: number;
  sourceValue: number | null;
  status: 'CONSISTENT' | 'INCONSISTENT' | 'MISSING_SOURCE';
} {
  const bpEntries = allHistoryData.filter((d: any) => 
    Number(d.year) === filterYear && matchDocType(d, ['balanço patrimonial', 'bp', 'balanco patrimonial', 'balanco'])
  );

  const aliases = [
    'Capital Social',
    'Capital Social Integralizado',
    'Capital Integralizado',
    'Capital Subscrito Integralizado',
    'Capital Subscrito'
  ];
  
  const normalizedAliases = aliases.map(localNormalizeString);

  const matchedEntry = bpEntries.find((d: any) => {
    const c = localNormalizeString(d.conta || d.category || d.item || '');
    return normalizedAliases.some(alias => c === alias || c.includes(alias));
  });

  let bpVal: number | null = null;
  if (matchedEntry) {
    const val = matchedEntry.val ?? matchedEntry.valor ?? matchedEntry.value;
    if (val !== undefined && val !== null) {
      bpVal = Math.abs(Number(val));
    }
  }

  const financialVal = financialInf?.metrics?.bpSummary?.capitalSocial ?? input.capitalSocial ?? null;

  const sourceValue = bpVal !== null ? bpVal : (financialVal !== null ? Number(financialVal) : null);
  const consumedValue = sourceValue !== null ? sourceValue : 0;

  let status: 'CONSISTENT' | 'INCONSISTENT' | 'MISSING_SOURCE' = 'CONSISTENT';
  if (sourceValue === null) {
    status = 'MISSING_SOURCE';
  } else if (bpVal !== null && financialVal !== null && bpVal !== Number(financialVal)) {
    status = 'INCONSISTENT';
  }

  return {
    value: consumedValue,
    sourceValue,
    status
  };
}

export function buildCapitalizationDependency(capitalInjections: number, endingEquity: number) {
  const value = endingEquity > 0 ? (capitalInjections / endingEquity) * 100 : 0;
  let classification = 'Independent';
  if (value >= 100) classification = 'Critical Dependency';
  else if (value >= 50) classification = 'High Dependency';
  else if (value >= 20) classification = 'Moderate Dependency';
  
  return {
    numerator: capitalInjections,
    denominator: endingEquity,
    formula: 'Capitalização / PL Final',
    value: Number(value.toFixed(2)),
    classification
  };
}

export function buildGovernanceScore(params: {
  preservationRatio: number;
  netIncome: number | null;
  endingEquity: number;
  capitalSocial: number;
  cashPosition: number;
  hasSevereOrHighErosion: boolean;
  context?: any;
}) {
  let pScore = 50;
  if (params.preservationRatio >= 1.0) pScore = 100;
  else if (params.preservationRatio >= 0.75) pScore = 85;
  else if (params.preservationRatio >= 0.50) pScore = 60;
  else if (params.preservationRatio >= 0.25) pScore = 35;
  else pScore = 15;

  let nScore = 100;
  if (params.netIncome !== null && params.netIncome < 0) {
    const absLoss = Math.abs(params.netIncome);
    if (params.cashPosition >= absLoss) {
      nScore = 70;
    } else if (params.cashPosition > 0) {
      nScore = 30;
    } else {
      nScore = 10;
    }
  }

  let eqScore = params.endingEquity > 0 ? (params.endingEquity > params.capitalSocial ? 100 : 50) : 0;

  const score = Math.round(
    (0.50 * pScore) +
    (0.30 * nScore) +
    (0.20 * eqScore)
  );

  let status = CapitalGovernanceSemanticEngine.resolveStatus(score, params.hasSevereOrHighErosion);
  if (params.context?.lifecycleProfile?.governanceStatus) {
    status = params.context.lifecycleProfile.governanceStatus.semanticLabel;
  }

  return { score, status };
}


export const CapitalGovernanceAdapter: EngineDefinition = {
  name: 'CapitalGovernanceAdapter',
  priority: 16,
  dependencies: ['LegacyFinancialAdapter', 'LegacyDREAdapter', 'LegacyDFCAdapter', 'FinancialLineageIntegrityAdapter'],
  requiredData: ['rawFinancialData'],
  inferenceScope: 'Governança de Capital e Inteligência DLPA (CGE)',
  minimumEvidenceLevel: 'Balanço Patrimonial, DRE e DLPA',
  execute: async (context: InstitutionalContext): Promise<EngineExecutionResult> => {
    try {
      const input = context.input.rawFinancialData || {};
      const allHistoryData = input.allHistoryData || [];
      const filterYear = Number(input.filterYear || input.year || new Date().getFullYear());

      // Inferences from prior adapters
      const financialInf = context.inferences['LegacyFinancialAdapter'];
      const dreInf = context.inferences['LegacyDREAdapter'];
      const dfcInf = context.inferences['LegacyDFCAdapter'];

      // ── 1. Net Income Extraction ──
      let netIncome = extractSovereignNetIncome(allHistoryData, filterYear, input);
      if (netIncome === null && dreInf?.metrics?.lucroLiq !== undefined && dreInf?.metrics?.lucroLiq !== null) {
        netIncome = Number(dreInf.metrics.lucroLiq);
      }

      // Accounting Baseline Values
      const endingEquity = financialInf?.metrics?.bpSummary?.patrimonioLiquido ?? input.bpSummary?.patrimonioLiquido ?? 0;
      const startingEquity = financialInf?.metrics?.bpSummary?.plInicio ?? input.prevPl ?? input.startingEquity ?? 0;
      const cashPosition = dfcInf?.metrics?.fiduciary?.caixaFinalReal ?? input.bpSummary?.caixaEquivalentes ?? input.caixa ?? 0;

      // Extract ending accumulated profit/loss
      let lucrosPrejuizos = financialInf?.metrics?.bpSummary?.lucrosPrejuizos ?? input.bpSummary?.lucrosPrejuizos ?? 0;
      if (lucrosPrejuizos === 0) {
        const bpEntriesForLp = allHistoryData.filter((d: any) =>
          Number(d.year) === filterYear &&
          matchDocType(d, ['balanço patrimonial', 'bp', 'balanco patrimonial', 'balanco'])
        );
        const lpEntry = bpEntriesForLp.find((e: any) => {
          const n = localNormalizeString(e.conta || e.category || e.item || '');
          return (n.includes('lucros acumulados') || n.includes('prejuizos acumulados') || n.includes('lucros/prejuizos acumulados') || n.includes('lucros ou prejuizos acumulados') || n.includes('prejuizo acumulado')) && e.type === 'pl';
        });
        if (lpEntry) {
          lucrosPrejuizos = Number(lpEntry.val ?? lpEntry.valor ?? lpEntry.value ?? 0);
          const nameNorm = localNormalizeString(lpEntry.conta || lpEntry.category || lpEntry.item || '');
          if ((nameNorm.includes('prejuizo') || nameNorm.includes('(-)')) && lucrosPrejuizos > 0) {
            lucrosPrejuizos = -lucrosPrejuizos;
          }
        }
      }

      // ── 2. Capital Social Lineage Extraction ──
      const capSocialTrace = extractCapitalSocial(allHistoryData, filterYear, input, financialInf);
      const capitalSocial = capSocialTrace.value;

      // Extract current year values from history
      const currentYearEntries = allHistoryData.filter((d: any) => Number(d.year) === filterYear);

      let dividendos = 0;
      const divEntry = currentYearEntries.find((d: any) => {
        const normConta = localNormalizeString(d.conta || d.category || d.item || '');
        return (normConta.includes('dividendo') || normConta.includes('distribuicao') || normConta.includes('jcp') || normConta.includes('juros sobre capital'));
      });
      if (divEntry) {
        dividendos = Math.abs(divEntry.val || divEntry.valor || divEntry.value || 0);
      } else {
        dividendos = Math.abs(input.dividendos ?? 0);
      }

      let capitalInjections = 0;
      const capInjEntry = currentYearEntries.find((d: any) => {
        const normConta = localNormalizeString(d.conta || d.category || d.item || '');
        return normConta.includes('aumento de capital') || normConta.includes('integralizacao') || normConta.includes('capitalizacao') || normConta.includes('capital subscrito');
      });
      if (capInjEntry) {
        capitalInjections = Math.abs(capInjEntry.val || capInjEntry.valor || capInjEntry.value || 0);
      } else {
        capitalInjections = input.aumentoCapital ?? input.capitalInjections ?? 0;
      }

      // ── 3. Base Ratios and Classifications ──
      const preservationRatio = capitalSocial > 0 ? endingEquity / capitalSocial : 1.0;
      const erosionRatio = 1 - preservationRatio;
      
      let erir = capitalSocial > 0 ? endingEquity / capitalSocial : 1.0;
      if (netIncome !== null && netIncome < 0) {
        const lossImpact = Math.abs(netIncome) / (endingEquity > 0 ? endingEquity : 1.0);
        erir = erir - 0.2 * lossImpact;
      }
      
      const distributionRatio = (netIncome !== null && netIncome > 0) ? dividendos / netIncome : 0;
      const retentionRatio = (netIncome !== null && netIncome > 0) ? (netIncome - dividendos) / netIncome : 0;

      // Centralized Classification
      const classificationReport = CapitalClassificationEngine.classify({
        capitalSocial,
        endingEquity,
        netIncome: netIncome ?? 0,
        distributionRatio,
        retentionRatio,
        cashPosition
      });

      const hasSevereOrHighErosion = classificationReport.capitalPreservationStatus === 'Severe Erosion' || classificationReport.capitalPreservationStatus === 'Critical Erosion' || classificationReport.capitalPreservationStatus === 'Capital Collapse';

      const runtimeCtx = context.input.financialRuntimeContext || context.input.rawFinancialData?.financialRuntimeContext;

      // Sovereign Score Engine
      const { score: cgs, status: cgsStatus } = buildGovernanceScore({
        preservationRatio,
        netIncome,
        endingEquity,
        capitalSocial,
        cashPosition,
        hasSevereOrHighErosion,
        context: runtimeCtx
      });

      // Semantic Checks
      CapitalGovernanceSemanticEngine.validateSemanticConsistency({
        score: cgs,
        status: cgsStatus,
        endingEquity,
        capitalSocial,
        cpiStatus: classificationReport.capitalPreservationStatus,
        hasSevereOrHighErosion
      }, runtimeCtx);


      // Capitalization Dependency audit
      const capitalizationDependency = buildCapitalizationDependency(capitalInjections, endingEquity);

      // CDI override under loss and eroded PL
      let cdi = capitalizationDependency.value / 100;
      let cdiStatus = capitalizationDependency.classification;
      if (netIncome !== null && netIncome < 0 && endingEquity < capitalSocial) {
        cdi = 0.60;
        cdiStatus = 'High Dependency';
      }

      // Trajectory and Lifecycle
      const foundationYear = input.foundationYear ?? (context.input as any)?.foundationYear ?? (context.input as any)?.rawFinancialData?.foundationYear;
      const historicalCycles = input.historicalCyclesCount ?? (context.input as any)?.historicalCyclesCount ?? (allHistoryData.length > 0 ? Array.from(new Set(allHistoryData.map((d: any) => Number(d.year)))).filter((y: any) => Number(y) > 0).length : 0);
      const isFirstCycle = historicalCycles <= 1 || (foundationYear !== undefined && filterYear <= foundationYear + 1);
      const lifecycleStage = isFirstCycle ? 'INITIAL_CAPITALIZATION' : 'SURVIVAL';

      let trajectory: 'RECOVERING' | 'STABILIZING' | 'VOLATILE' | 'DEPENDENT' | 'DETERIORATING' = 'STABILIZING';

      // Recurrent Injections Check (dependent)
      const yearsWithInjections = new Set<number>();
      const injectionKeywords = ['aumento de capital', 'integralizacao', 'integralizacão', 'capitalizacao', 'capitalizacão', 'capital subscrito', 'aporte'];
      allHistoryData.forEach((d: any) => {
        const normConta = localNormalizeString(d.conta || d.category || d.item || '');
        if (injectionKeywords.some(kw => normConta.includes(kw))) {
          yearsWithInjections.add(Number(d.year));
        }
      });

      // PL Increase check (recovering)
      const plValuesByYear: Record<number, number> = {};
      allHistoryData.forEach((d: any) => {
        const normConta = localNormalizeString(d.conta || d.category || d.item || '');
        const isPlAccount = normConta === 'patrimonio liquido' || normConta === 'patrimônio líquido' || normConta === 'pl';
        if (isPlAccount && d.year) {
          plValuesByYear[Number(d.year)] = Number(d.val ?? d.valor ?? d.value ?? 0);
        }
      });
      const sortedYears = Object.keys(plValuesByYear).map(Number).sort((a, b) => a - b);
      let isRecovering = false;
      if (sortedYears.length >= 3) {
        isRecovering = true;
        for (let i = 1; i < sortedYears.length; i++) {
          if (plValuesByYear[sortedYears[i]] <= plValuesByYear[sortedYears[i - 1]]) {
            isRecovering = false;
          }
        }
      }

      if (yearsWithInjections.size >= 2) {
        trajectory = 'DEPENDENT';
      } else if (isRecovering) {
        trajectory = 'RECOVERING';
      } else if (cdiStatus.includes('Dependency')) {
        trajectory = 'DEPENDENT';
      }

      // Explicit separation variables
      const exerciseResult = netIncome;
      const accumulatedResultEnding = lucrosPrejuizos;
      const retainedEarnings = (netIncome !== null && netIncome > 0) ? netIncome - dividendos : 0;
      const distributedEarnings = dividendos;

      // Narrative Composition
      let diagnostic = '';
      if (isFirstCycle) {
        const isFcoNegativo = (dfcInf?.metrics?.fco ?? 0) < 0 || (input.fco ?? 0) < 0 || (input.fcoOperacionalReal ?? 0) < 0;
        const isRunwayLow = (input.runway ?? 12) < 6;

        diagnostic = CapitalGovernanceSemanticEngine.buildFirstCycleNarrative({
          foundationYear,
          analysisYear: filterYear,
          historicalCycles,
          netIncome: netIncome ?? 0,
          endingEquity,
          cdiStatus: capitalizationDependency.classification,
          hasNegativeOperatingCashFlow: isFcoNegativo,
          isRunwayLow
        });
      } else {
        diagnostic = `A estrutura de capital apresenta um score de governança de ${cgs}/100, classificado como ${cgsStatus}.`;
        if (netIncome !== null && netIncome < 0 && endingEquity > 0) {
          diagnostic = 'A companhia apresentou prejuízo relevante no exercício. Entretanto, o patrimônio líquido permaneceu positivo, preservando a continuidade institucional. O principal risco identificado é a dependência de capitalização ou a erosão do capital próprio.';
        }
      }

      const advisoryNarrative: AdvisoryNarrative = {
        diagnostic,
        cause: netIncome !== null && netIncome < 0 ? 'Déficit líquido registrado no exercício operacional.' : 'Geração operacional recorrente positiva sustentando a estrutura.',
        consequence: endingEquity <= 0 ? 'Exposição a insolvência e colapso de capital.' : 'Preservação da continuidade institucional com patrimônio líquido positivo.',
        sensitivity: 'Sensibilidade a novos aportes e capacidade de turnaround.',
        risk: cgs < 50 ? 'Risco elevado de erosão do capital social próprio.' : 'Estrutura patrimonial preservada.',
        priority: 'Fortalecer a geração de caixa operacional recorrente e reduzir dependência de chamadas de capital.',
        strategicMovement: 'Plano de preservação de liquidez e readequação da base de capital social.'
      };

      // Clamping logic and warning generation
      let capitalPreservation = Number((preservationRatio * 100).toFixed(2));
      let capitalErosion = Number((erosionRatio * 100).toFixed(2));
      let patrimonialErosion = -capitalErosion;
      
      const extraViolations: any[] = [];
      if (capitalPreservation > 1000) {
        capitalPreservation = 1000;
        patrimonialErosion = -900;
        extraViolations.push({
          rule: 'CAPITAL_RATIO_OUTLIER_SUPPRESSED',
          severity: 'WARNING',
          message: 'Preservação de capital extrema limitada a 1000%',
          blocked: false
        });
      } else if (capitalPreservation < -100) {
        capitalPreservation = -100;
        patrimonialErosion = 200;
        extraViolations.push({
          rule: 'CAPITAL_RATIO_OUTLIER_SUPPRESSED',
          severity: 'WARNING',
          message: 'Preservação de capital extrema limitada a -100%',
          blocked: false
        });
      }

      // Registry mapping and lineage validation
      const registry = new CapitalMetricRegistry();
      
      const dreNetIncome = dreInf?.metrics?.lucroLiq !== undefined ? Number(dreInf.metrics.lucroLiq) : null;
      const bpCapitalSocial = financialInf?.metrics?.bpSummary?.capitalSocial ?? null;

      const renderingPayload = (context.input as any)?.renderingPayload || input?.renderingPayload;

      const getRendered = (id: string) => {
        if (!renderingPayload) return 'NOT_OBSERVABLE';
        return renderingPayload[id] !== undefined ? renderingPayload[id] : 'NOT_OBSERVABLE';
      };

      const metricsToRegister = [
        { id: 'netIncome', statement: 'DRE', account: 'Lucro Líquido', sourceVal: dreNetIncome, consumedVal: netIncome },
        { id: 'capitalSocial', statement: 'BP', account: 'Capital Social', sourceVal: bpCapitalSocial, consumedVal: capitalSocial },
        { id: 'endingEquity', statement: 'BP', account: 'Patrimônio Líquido Final', sourceVal: endingEquity, consumedVal: endingEquity },
        { id: 'capitalPreservation', statement: 'CGE', account: 'Preservação Patrimonial', sourceVal: capitalPreservation, consumedVal: capitalPreservation },
        { id: 'capitalErosion', statement: 'CGE', account: 'Erosão Patrimonial', sourceVal: capitalErosion, consumedVal: capitalErosion },
        { id: 'capitalIntegrity', statement: 'CGE', account: 'Integridade Score', sourceVal: Number((preservationRatio * 100).toFixed(0)), consumedVal: Number((preservationRatio * 100).toFixed(0)) },
        { id: 'capitalResilience', statement: 'CGE', account: 'Resiliência Score', sourceVal: Number((erir * 100).toFixed(0)), consumedVal: Number((erir * 100).toFixed(0)) },
        { id: 'governanceScore', statement: 'CGE', account: 'Governance Score', sourceVal: cgs, consumedVal: cgs }
      ];

      metricsToRegister.forEach(m => {
        const rend = getRendered(m.id);
        const status = rend === 'NOT_OBSERVABLE' ? 'NOT_RENDERED' : (Number(rend) === Number(m.consumedVal) ? 'CONSISTENT' : 'INCONSISTENT');
        registry.registerMetric({
          metricId: m.id,
          sourceStatement: m.statement,
          sourceAccount: m.account,
          sourceValue: m.sourceVal,
          consumedValue: m.consumedVal,
          renderedValue: rend,
          lineageStatus: status as any
        });
      });

      // Construct lineageAudit for backward compatibility
      const lineageAudit: Record<string, any> = {
        netIncome: {
          source: 'DRE',
          sourceValue: dreNetIncome,
          consumedValue: netIncome,
          renderedValue: getRendered('netIncome'),
          status: getRendered('netIncome') === 'NOT_OBSERVABLE' ? 'NOT_RENDERED' : (getRendered('netIncome') === netIncome ? 'CONSISTENT' : 'INCONSISTENT')
        },
        capitalSocial: {
          source: 'BP',
          sourceValue: bpCapitalSocial,
          consumedValue: capitalSocial,
          renderedValue: getRendered('capitalSocial'),
          status: getRendered('capitalSocial') === 'NOT_OBSERVABLE' ? 'NOT_RENDERED' : (getRendered('capitalSocial') === capitalSocial ? 'CONSISTENT' : 'INCONSISTENT')
        }
      };

      // Lineage validator
      const lineageViolations = CapitalLineageEngine.validateCapitalLineage({
        dreNetIncome,
        cgeNetIncome: netIncome,
        bpCapitalSocial,
        cgeCapitalSocial: capitalSocial,
        metrics: registry.getAllMetrics()
      });

      // Propagation audit
      let propagationViolations: any[] = [];
      if (renderingPayload) {
        propagationViolations = CapitalGovernancePropagationAudit.audit({
          netIncome,
          capitalSocial,
          capitalPreservation: capitalPreservation,
          capitalErosion: capitalErosion,
          governanceScore: cgs,
          governanceStatus: cgsStatus
        }, renderingPayload);
      }

      // Suppress legacy warning if CS > 0
      if (capitalSocial > 0 && context.violations) {
        context.violations = context.violations.filter((v: any) => !v.message.includes('Capital Social ausente ou inválido'));
      }

      const resolvedGovernanceStatus = runtimeCtx?.lifecycleProfile?.governanceStatus?.semanticLabel || cgsStatus;
      const resolvedCapitalStatus = runtimeCtx?.lifecycleProfile?.capitalStatus?.semanticLabel || classificationReport.capitalPreservationStatus;
      const resolvedNarrativeProfile = runtimeCtx?.lifecycleProfile?.narrativeProfile || 'UNKNOWN';
      const semanticSource = runtimeCtx?.lifecycleProfile ? 'ELSA' : 'LEGACY';

      const inference: InferenceBlock = {
        domain: 'Capital Governance Engine (CGE)',
        metrics: {
          cgs,
          cgsStatus,
          cpi: preservationRatio,
          cpiStatus: classificationReport.capitalPreservationStatus,
          cdi: cdi,
          cdiStatus: cdiStatus,
          ddi: (netIncome !== null && netIncome > 0) ? distributionRatio : 'NOT_APPLICABLE',
          ddiStatus: (netIncome !== null && netIncome > 0) ? (distributionRatio > 0.70 ? 'High Payout' : 'Moderate Payout') : 'NOT_APPLICABLE',
          eri: (netIncome !== null && netIncome > 0) ? retentionRatio : 'NOT_APPLICABLE',
          eriStatus: (netIncome !== null && netIncome > 0)
            ? (retentionRatio > 0.50 ? 'High Retention' : 'Moderate Retention')
            : (netIncome !== null && netIncome < 0 ? 'PREJUÍZO ACUMULADO' : 'NOT_APPLICABLE'),
          erir,
          erirStatus: classificationReport.capitalResilienceStatus,
          cmi: 50,
          trajectory,
          capitalSocial,
          patrimonioLiquido: endingEquity,
          plInicio: startingEquity,
          netIncome,
          dividendos,
          capitalInjections,
          capitalPreservation: capitalPreservation,
          capitalErosion: capitalErosion,
          patrimonialErosion: patrimonialErosion,
          capitalIntegrity: Math.max(0, Math.min(100, Math.round(preservationRatio * 100))),
          capitalResilience: Math.max(0, Math.min(100, Math.round(erir * 100))),
          capitalizationDependency,
          exerciseResult,
          accumulatedResultEnding,
          retainedEarnings,
          distributedEarnings,
          lifecycleStage,
          metricsRegistry: registry.getAllMetrics(),
          lineageAudit,
          capitalSocialTrace: {
            sourceValue: capSocialTrace.sourceValue,
            consumedValue: capSocialTrace.value,
            status: capSocialTrace.status
          },
          resolvedGovernanceStatus,
          resolvedCapitalStatus,
          resolvedNarrativeProfile,
          semanticSource,
          semantic: {
            semanticSource,
            lifecycleStage,
            rawGovernanceStatus: CapitalGovernanceSemanticEngine.resolveStatus(cgs, hasSevereOrHighErosion),
            resolvedGovernanceStatus,
            rawCapitalStatus: classificationReport.capitalPreservationStatus,
            resolvedCapitalStatus,
            rawPatrimonialStatus: classificationReport.capitalPreservationStatus,
            resolvedPatrimonialStatus: resolvedCapitalStatus,
            cpiStatus: classificationReport.capitalPreservationStatus,
            semanticContext: {
              semanticSource,
              lifecycleStage,
              lifecycleLabel: lifecycleStage === 'INITIAL_CAPITALIZATION' ? 'Fase Inicial de Capitalização' : 'SURVIVAL',
              foundationYear: foundationYear ?? null,
              analysisYear: filterYear ?? null,
              companyAge: (filterYear && foundationYear) ? filterYear - foundationYear : null,
              lifecycleConfidence: runtimeCtx?.lifecycleProfile?.lifecycleConfidence || 'LOW'
            }
          }
        },
        causality: [],
        narrative: advisoryNarrative,
        confidence: allHistoryData.length >= 3 ? 'HIGH' : 'MEDIUM',
        evidenceLevel: 'Auditado Patrimonial e DLPA',
        score: cgs
      };


      const finalViolations = [...lineageViolations, ...propagationViolations, ...extraViolations];

      return {
        engineName: 'CapitalGovernanceAdapter',
        success: !finalViolations.some(v => v.blocked),
        confidence: inference.confidence,
        inference,
        violations: finalViolations.length > 0 ? finalViolations as any : undefined
      };

    } catch (error: any) {
      return {
        engineName: 'CapitalGovernanceAdapter',
        success: false,
        confidence: 'LOW',
        violations: [{
          rule: 'CGE_ADAPTER_ERROR',
          severity: 'CRITICAL',
          message: `Erro interno no CGE: ${error.message || error}`,
          blocked: true
        } as any]
      };
    }
  }
};
