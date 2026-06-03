import { EngineDefinition, InstitutionalContext, EngineExecutionResult, InferenceBlock, CausalityChain, AdvisoryNarrative, RuntimeViolation } from '../types';

export interface LineageMetric {
  metricId: string;
  name: string;
  source: string;
  sourceValue: number | null;
  consumedValue: number | null;
  renderedValue: number | null;
  confidence: 'LOW' | 'MEDIUM' | 'HIGH';
  lineageHash: string;
  transformationTrace?: string;
  status: 'COMPLIANT' | 'VIOLATION' | 'WARNING' | 'NOT_OBSERVABLE';
  violationMessage?: string;
}

export interface LineageAuditResult {
  auditedMetrics: LineageMetric[];
  edrs: number;
  reliabilityClassification: string;
  lineageBreaksCount: number;
  fallbackViolationsCount: number;
  renderMismatchesCount: number;
  crossEngineInconsistenciesCount: number;
  violations: RuntimeViolation[];
}

function generateHash(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return Math.abs(hash).toString(16).toUpperCase();
}

export const FinancialLineageIntegrityAdapter: EngineDefinition & {
  audit: (context: InstitutionalContext, renderingPayload?: Record<string, number | null>) => LineageAuditResult;
} = {
  name: 'FinancialLineageIntegrityAdapter',
  priority: 15,
  dependencies: ['LegacyFinancialAdapter', 'LegacyDREAdapter', 'LegacyDFCAdapter'],
  requiredData: ['rawFinancialData'],
  inferenceScope: 'Integridade da Linhagem Financeira',
  minimumEvidenceLevel: 'Balanço Patrimonial, DRE e DFC',

  audit(context: InstitutionalContext, renderingPayload?: Record<string, number | null>): LineageAuditResult {
    const violations: RuntimeViolation[] = [];
    const auditedMetrics: LineageMetric[] = [];

    const financialInf = context.inferences['LegacyFinancialAdapter'];
    const dreInf = context.inferences['LegacyDREAdapter'];
    const dfcInf = context.inferences['LegacyDFCAdapter'];
    const eneInf = context.inferences['EconomicNormalizationAdapter'];

    const bpSummary = financialInf?.metrics?.bpSummary || dfcInf?.metrics?.bpSummary || {};
    
    // Extract base metrics
    const dreNetIncome = dreInf?.metrics?.lucroLiq;
    const dfcNetIncome = dfcInf?.metrics?.lucroLiquido;

    const dreEbitda = dreInf?.metrics?.ebitda;
    const dfcEbitda = dfcInf?.metrics?.ebitda;

    const dreRevenue = dreInf?.metrics?.recLiquida;
    const dfcRevenue = dfcInf?.metrics?.receitaLiquida;

    const bpCaixaInicial = dfcInf?.metrics?.fiduciary?.caixaInicialBP;
    const dfcCaixaInicial = dfcInf?.metrics?.fiduciary?.caixaInicialDFC;

    const bpCaixaFinal = dfcInf?.metrics?.fiduciary?.caixaFinalBP;
    const dfcCaixaFinal = dfcInf?.metrics?.fiduciary?.caixaFinalEstimadoDFC;

    const bpVariacao = dfcInf?.metrics?.fiduciary?.variacaoLiquidaConciliada;
    const dfcVariacao = dfcInf?.metrics?.fiduciary?.variacaoDFC;

    const fcoOficial = dfcInf?.metrics?.fco;
    const fcoOperacionalReal = dfcInf?.metrics?.fiduciary?.fcoOperacionalReal;

    const capitalSocial = bpSummary?.capitalSocial;
    
    // CC Sócios raw extraction
    const allHistoryData = context.input.rawFinancialData?.allHistoryData || [];
    const filterYear = Number(context.input.rawFinancialData?.filterYear || new Date().getFullYear());
    
    const getHistoricalSum = (y: number, docTypes: string[], nameFilters: string[]) => {
      const yearEntries = allHistoryData.filter((d: any) => {
        const typeNorm = (d.type || d.docType || d.entryType || '').toLowerCase();
        return Number(d.year) === y && docTypes.some(t => typeNorm === t.toLowerCase() || typeNorm.includes(t.toLowerCase()));
      });
      let sum = 0;
      const normalizedFilters = nameFilters.map(f => f.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "").trim());
      yearEntries.forEach((d: any) => {
        const c = (d.conta || d.category || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "").trim();
        if (normalizedFilters.some(n => c === n || c.includes(n))) {
          sum += (d.val || d.valor || d.value || 0);
        }
      });
      return sum;
    };

    const ccSociosBP = getHistoricalSum(filterYear, ['balanço patrimonial', 'bp', 'balanco patrimonial', 'balanco'], ['mútuo', 'sócios', 'partes relacionadas', 'adiantamento a sócios', 'creditos com socios', 'conta corrente socios']);
    const ccSociosFlow = dfcInf?.metrics?.fiduciary?.fluxoPartesRelacionadas;

    const liqCorrente = financialInf?.metrics?.baseMetrics?.liqCorrente;
    const liquidezOperacionalReal = dfcInf?.metrics?.fiduciary?.liquidezOperacionalReal;

    // Helper counts
    let lineageBreaksCount = 0;
    let fallbackViolationsCount = 0;
    let renderMismatchesCount = 0;
    let crossEngineInconsistenciesCount = 0;

    const renderingSource = renderingPayload || context.input.rawFinancialData?.renderingPayload;

    const checkMetric = (
      metricId: string,
      name: string,
      source: string,
      sourceVal: number | null | undefined,
      consumedVal: number | null | undefined,
      trace?: string
    ) => {
      // 1. Fallback Detection by Evidence (Rule 2 + User Adjustments)
      const isSourceAbsent = sourceVal === null || sourceVal === undefined;
      const isConsumedZero = consumedVal === 0;
      let status: LineageMetric['status'] = 'COMPLIANT';
      let violationMessage: string | undefined = undefined;

      const isCriticalFallbackMetric = ['lucroLiquido', 'ebitda', 'receitaLiquida', 'fcoOperacional', 'caixaFinal', 'NET_INCOME_EQE'].includes(metricId);

      const isSilentFallback = !trace && isCriticalFallbackMetric && (
        (isSourceAbsent && isConsumedZero) ||
        (sourceVal !== null && sourceVal !== undefined && sourceVal !== 0 && consumedVal === 0)
      );

      if (isSilentFallback) {
        fallbackViolationsCount++;
        status = 'VIOLATION';
        violationMessage = `Silent fallback detected: metric ${name} is absent or non-zero in source but defaulted to 0 in engine.`;
        violations.push({
          rule: 'SILENT_FALLBACK_DETECTED',
          severity: 'HIGH',
          message: `Detecção de fallback silencioso: métrica ${name} ausente ou diferente de zero na fonte e com valor zerado consumido.`,
          sourceEngine: 'FinancialLineageIntegrityAdapter',
          blocked: false
        });
      }
      // 2. Lineage Break
      else if (sourceVal !== null && sourceVal !== undefined && consumedVal !== null && consumedVal !== undefined) {
        if (!trace && sourceVal !== consumedVal) {
          lineageBreaksCount++;
          status = 'VIOLATION';
          violationMessage = `Lineage break detected: consumed value (${consumedVal}) differs from source value (${sourceVal}).`;
          violations.push({
            rule: metricId === 'NET_INCOME_EQE' ? 'EQS_NET_INCOME_LINEAGE_BREAK' : 'LINEAGE_BREAK',
            severity: metricId === 'NET_INCOME_EQE' ? 'CRITICAL' : 'HIGH',
            message: metricId === 'NET_INCOME_EQE' 
              ? `Quebra de linhagem crítica detectada: o Lucro Líquido no EQE (${consumedVal}) diverge do Lucro Líquido soberano da DRE (${sourceVal}).`
              : `Quebra de linhagem detectada para a métrica ${name}: valor consumido difere da fonte contábil.`,
            sourceEngine: 'FinancialLineageIntegrityAdapter',
            blocked: false
          });
        }
      }

      // 3. UI Render Mismatch (Rule 1 + User Adjustments)
      let renderedVal: number | null = null;
      let hasRenderedPayload = false;
      if (renderingSource && renderingSource[metricId] !== undefined && renderingSource[metricId] !== null) {
        renderedVal = renderingSource[metricId];
        hasRenderedPayload = true;
        if (consumedVal !== null && consumedVal !== undefined && renderedVal !== consumedVal) {
          renderMismatchesCount++;
          status = 'VIOLATION';
          violationMessage = (violationMessage ? violationMessage + '\n' : '') + `UI Render Mismatch: rendered value (${renderedVal}) differs from engine consumed value (${consumedVal}).`;
          violations.push({
            rule: 'UI_RENDER_MISMATCH',
            severity: 'HIGH',
            message: `Divergência de renderização para a métrica ${name}: valor exibido difere do calculado.`,
            sourceEngine: 'FinancialLineageIntegrityAdapter',
            blocked: false
          });
        }
      }

      if (!hasRenderedPayload) {
        if (status === 'COMPLIANT') {
          status = 'NOT_OBSERVABLE';
        }
      }

      const hashInput = `${metricId}_${sourceVal ?? 'null'}_${consumedVal ?? 'null'}_${renderedVal ?? 'null'}`;
      const hash = generateHash(hashInput);

      auditedMetrics.push({
        metricId,
        name,
        source,
        sourceValue: sourceVal !== undefined ? sourceVal : null,
        consumedValue: consumedVal !== undefined ? consumedVal : null,
        renderedValue: renderedVal,
        confidence: context.globalConfidence,
        lineageHash: hash,
        transformationTrace: trace,
        status,
        violationMessage
      });
    };

    // Audit the 12 mandatory metrics + NET_INCOME_EQE
    checkMetric('caixaInicial', 'Caixa Inicial', 'BP', bpCaixaInicial, dfcCaixaInicial ?? bpCaixaInicial);
    checkMetric('caixaFinal', 'Caixa Final', 'BP', bpCaixaFinal, bpCaixaFinal);
    checkMetric('variacaoCaixa', 'Variação de Caixa', 'BP', bpVariacao, bpVariacao);
    checkMetric('receitaLiquida', 'Receita Líquida', 'DRE', dreRevenue, dfcRevenue ?? dreRevenue);
    checkMetric('lucroLiquido', 'Lucro Líquido', 'DRE', dreNetIncome, dfcNetIncome);
    checkMetric('ebitda', 'EBITDA', 'DRE', dreEbitda, dfcEbitda);
    checkMetric('fcoOficial', 'FCO Oficial', 'DFC', fcoOficial, fcoOficial);
    
    // FCO Operacional Real has allowed transformation trace
    checkMetric(
      'fcoOperacional',
      'FCO Operacional Real',
      'Fiduciary',
      fcoOficial,
      fcoOperacionalReal,
      'FCO Oficial → Remoção Fluxos Societários → FCO Operacional Real'
    );
    
    checkMetric('capitalSocial', 'Capital Social', 'BP', capitalSocial, capitalSocial);
    
    // CC Sócios has allowed transformation trace
    checkMetric(
      'contaCorrenteSocios',
      'Conta Corrente Sócios',
      'BP',
      ccSociosBP,
      ccSociosFlow,
      'Saldo Patrimonial CC Sócios → Variação Patrimonial → Fluxo Partes Relacionadas'
    );
    
    checkMetric('liquidezCorrente', 'Liquidez Corrente', 'BP', liqCorrente, liqCorrente);
    checkMetric('liquidezOperacionalReal', 'Liquidez Operacional Real', 'BP', liquidezOperacionalReal, liquidezOperacionalReal);

    // Extract EQE net income
    const eqeNetIncome = dfcInf?.metrics?.fiduciary?.earningsQuality?.netIncome !== undefined && dfcInf?.metrics?.fiduciary?.earningsQuality?.netIncome !== null
      ? dfcInf.metrics.fiduciary.earningsQuality.netIncome
      : (dfcInf?.metrics?.earningsQuality?.netIncome !== undefined && dfcInf?.metrics?.earningsQuality?.netIncome !== null
          ? dfcInf.metrics.earningsQuality.netIncome
          : null);

    checkMetric('NET_INCOME_EQE', 'Lucro Líquido EQE', 'DRE', dreNetIncome, eqeNetIncome);

    // 4. Cross-Engine Inconsistency Checking
    if (eneInf) {
      const eneEbitda = eneInf.metrics?.ebitda?.contabil;
      if (eneEbitda !== undefined && dreEbitda !== undefined && eneEbitda !== null && dreEbitda !== null && eneEbitda !== dreEbitda) {
        crossEngineInconsistenciesCount++;
        violations.push({
          rule: 'CROSS_ENGINE_INCONSISTENCY',
          severity: 'HIGH',
          message: `Inconsistência entre engines detectada: EBITDA da DRE (${dreEbitda}) difere do EBITDA no ENE (${eneEbitda}).`,
          sourceEngine: 'FinancialLineageIntegrityAdapter',
          blocked: false
        });
      }

      const eneRevenue = eneInf.metrics?.receitaLiquida;
      if (eneRevenue !== undefined && dreRevenue !== undefined && eneRevenue !== null && dreRevenue !== null && eneRevenue !== dreRevenue) {
        crossEngineInconsistenciesCount++;
        violations.push({
          rule: 'CROSS_ENGINE_INCONSISTENCY',
          severity: 'HIGH',
          message: `Inconsistência entre engines detectada: Receita Líquida da DRE (${dreRevenue}) difere do valor no ENE (${eneRevenue}).`,
          sourceEngine: 'FinancialLineageIntegrityAdapter',
          blocked: false
        });
      }
    }

    // Calculate EDRS using severity weights (Rule 4)
    let edrs = 100;
    violations.forEach(v => {
      if (v.severity === 'CRITICAL') edrs -= 20;
      else if (v.severity === 'HIGH') edrs -= 10;
      else if (v.severity === 'MEDIUM') edrs -= 5;
      else if (v.severity === 'LOW') edrs -= 2;
    });
    edrs = Math.max(0, Math.min(100, edrs));

    let reliabilityClassification = 'Alta Confiabilidade';
    if (edrs >= 90) reliabilityClassification = 'Alta Confiabilidade';
    else if (edrs >= 70) reliabilityClassification = 'Confiabilidade Moderada';
    else if (edrs >= 50) reliabilityClassification = 'Baixa Confiabilidade';
    else reliabilityClassification = 'Integridade Comprometida';

    return {
      auditedMetrics,
      edrs,
      reliabilityClassification,
      lineageBreaksCount,
      fallbackViolationsCount,
      renderMismatchesCount,
      crossEngineInconsistenciesCount,
      violations
    };
  },

  execute: async (context: InstitutionalContext): Promise<EngineExecutionResult> => {
    try {
      const auditResult = FinancialLineageIntegrityAdapter.audit(context);

      const inference: InferenceBlock = {
        domain: 'Financial Lineage',
        metrics: {
          auditedMetrics: auditResult.auditedMetrics,
          edrs: auditResult.edrs,
          reliabilityClassification: auditResult.reliabilityClassification,
          totalMetricsAudited: auditResult.auditedMetrics.length,
          lineageBreaksCount: auditResult.lineageBreaksCount,
          fallbackViolationsCount: auditResult.fallbackViolationsCount,
          renderMismatchesCount: auditResult.renderMismatchesCount,
          crossEngineInconsistenciesCount: auditResult.crossEngineInconsistenciesCount
        },
        causality: [],
        narrative: {
          diagnostic: `Linha de integridade validada. EDRS score: ${auditResult.edrs}/100. Classificação: ${auditResult.reliabilityClassification}.`,
          cause: 'Verificação contínua das fontes BP, DRE e DFC.',
          consequence: auditResult.violations.length > 0 ? 'Exposição a riscos de linhagem ou fallbacks' : 'Consistência garantida dos dados.',
          sensitivity: 'Sensibilidade de accrual controlada.',
          risk: auditResult.edrs < 70 ? 'Alto Risco de Mutação' : 'Estável',
          priority: 'Assegurar que todas as representações do dashboard reflitam a fonte original.',
          strategicMovement: 'Auditoria cruzada e eliminação de fallbacks contábeis.'
        },
        confidence: context.globalConfidence,
        evidenceLevel: 'Auditado Cruzado BP x DRE x DFC',
        score: auditResult.edrs
      };

      return {
        engineName: 'FinancialLineageIntegrityAdapter',
        success: true,
        confidence: context.globalConfidence,
        inference,
        violations: auditResult.violations.length > 0 ? auditResult.violations : undefined
      };
    } catch (e: any) {
      return {
        engineName: 'FinancialLineageIntegrityAdapter',
        success: false,
        confidence: 'LOW',
        violations: [{
          rule: 'flif_engine_error',
          severity: 'CRITICAL',
          message: `Erro ao processar Financial Lineage Integrity Framework: ${e.message}`,
          blocked: true
        }]
      };
    }
  }
};
