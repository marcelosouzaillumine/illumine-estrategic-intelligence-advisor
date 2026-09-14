import { logger } from "../../../../services/logging/InstitutionalLogger";
import { EngineDefinition, InstitutionalContext, EngineExecutionResult, InferenceBlock, CausalityChain, AdvisoryNarrative } from '../../../../runtime/types';
import { buildBPHierarchy } from '../../../../lib/bpEngine';
import { calculateFinancialMetrics } from '../../../../lib/financial-engine';
import { calculateScores } from '../../../../lib/score-engine';
import { generateAdvisory } from '../../../../lib/advisory-engine';
import { inferBusinessIdentity } from '../../../../lib/business-identity-engine';
import { evaluateMasterCausality } from '../../../../lib/master-causal-engine';

export const LegacyFinancialAdapter: EngineDefinition = {
  name: 'LegacyFinancialAdapter',
  priority: 10,
  dependencies: [],
  requiredData: ['rawFinancialData'],
  inferenceScope: 'Métricas financeiras, score patrimonial e advisory inicial',
  minimumEvidenceLevel: 'Balanço Patrimonial básico',
  execute: async (context: InstitutionalContext): Promise<EngineExecutionResult> => {
    try {
      const input = context.input.rawFinancialData;
      
      // Extract needed inputs
      const {
        bpSummary,
        ebitda,
        lucroLiquido,
        industry,
        prevPl,
        prevEbitda,
        prevCaixa,
        dreDataLength,
        historicalCyclesCount
      } = input;

      
      if (!bpSummary) {
        return {
          engineName: 'LegacyFinancialAdapter',
          success: false,
          confidence: 'LOW',
          violations: [{
            rule: 'INVALID_BP_SUMMARY',
            severity: 'CRITICAL',
            message: 'Falha ao consolidar hierarquia de Balanço Patrimonial.',
            blocked: true
          }]
        };
      }

      // 2. Trend Calculation
      const calcTrend = (curr: number, prev: number) => prev === 0 ? 0 : ((curr - prev) / Math.abs(prev)) * 100;
      
      const trend = {
        hasData: prevEbitda !== 0 || prevPl !== 0,
        ebitdaTrend: calcTrend(ebitda, prevEbitda),
        plTrend: calcTrend(bpSummary.patrimonioLiquido, prevPl),
        liquidityTrend: calcTrend(bpSummary.ativoCirculante, prevCaixa),
        historicalCycles: historicalCyclesCount
      };

      // 3. Business Identity Inference
      const businessIdentity = inferBusinessIdentity(industry, historicalCyclesCount);

      // 4. Calculate Financial Metrics
      const baseMetrics = calculateFinancialMetrics(bpSummary, ebitda, lucroLiquido, industry);

      const masterCausality = evaluateMasterCausality(bpSummary, baseMetrics, businessIdentity);

      // 5. Calculate Scores
      const scoreMetrics = calculateScores(bpSummary, baseMetrics, dreDataLength, prevPl, businessIdentity, masterCausality);

      // 6. Generate Advisory
      const advisory = generateAdvisory(baseMetrics, bpSummary, scoreMetrics, businessIdentity, trend as any);

      // Map to InferenceBlock structure
      const causality: CausalityChain[] = []; // Currently empty, advisory isn't strictly mapping to this yet
      
      // We will map advisory directly into the narrative block or extend it later
      const mappedNarrative: AdvisoryNarrative = {
        diagnostic: advisory.diagnostico || '',
        cause: '',
        consequence: '',
        sensitivity: '',
        risk: '',
        priority: advisory.prioridadesEstrategicas?.[0]?.nome || '',
        strategicMovement: advisory.strategicActionMatrix?.[0]?.acao || ''
      };

      const inference: InferenceBlock = {
        domain: 'Financial Governance',
        metrics: {
          baseMetrics,
          scoreMetrics,
          bpSummary,
          businessIdentity,
          causalInsights: advisory
        },
        causality,
        narrative: mappedNarrative,
        confidence: 'HIGH', // Will be downgraded by Propagator if cycles < 3
        evidenceLevel: 'Consolidado Patrimonial e DRE',
        score: scoreMetrics.resilienciaGlobal
      };

      return {
        engineName: 'LegacyFinancialAdapter',
        success: true,
        confidence: 'HIGH',
        inference
      };

    } catch (error: any) {
      logger.error('LEGACY FINANCIAL ADAPTER ERROR STACK', error);
      return {
        engineName: 'LegacyFinancialAdapter',
        success: false,
        confidence: 'LOW',
        violations: [{
          rule: 'ADAPTER_CRASH',
          severity: 'CRITICAL',
          message: error.message || 'Erro desconhecido no adaptador legado',
          blocked: true
        }]
      };
    }
  }
};
