import { describe, it } from 'node:test';
import * as assert from 'node:assert';
import { orchestrateExecutiveConsolidation } from '../src/core/orchestration/executiveOrchestrationEngine';
import { MetricCanonicalizationEngine } from '../src/core/runtime/executive-consolidation/MetricCanonicalizationEngine';
import { CanonicalDivergenceAuditEngine } from '../src/core/runtime/executive-consolidation/CanonicalDivergenceAuditEngine';
import { CompositeScoreGovernanceEngine } from '../src/core/runtime/executive-consolidation/CompositeScoreGovernanceEngine';
import { ExecutiveRecommendation } from '../src/core/runtime/executive-consolidation/ExecutiveRecommendationDeduplicationEngine';

describe('EFOS Executive Consolidation Layer (EECF v1.1)', () => {

  describe('MetricCanonicalizationEngine', () => {
    it('should generate matching metrics when inputs are equal', () => {
      const canonical = MetricCanonicalizationEngine.canonicalize({
        ebitdaDre: 300, ebitdaEfos: 300,
        lucroLiquidoDre: 100, lucroLiquidoEfos: 100,
        fcoDfc: 150, fcoEfos: 150,
        caixaFinalDfc: 50, caixaFinalEfos: 50,
        patrimonioLiquidoBp: 500, patrimonioLiquidoEfos: 500,
        capitalConsumidoDlpa: 20, capitalConsumidoEfos: 20
      });

      assert.strictEqual(canonical.EBITDA.status, 'MATCH');
      assert.strictEqual(canonical.LucroLiquido.status, 'MATCH');
      assert.strictEqual(canonical.EBITDA.divergence, 0);
    });

    it('should generate divergent metrics when inputs are different', () => {
      const canonical = MetricCanonicalizationEngine.canonicalize({
        ebitdaDre: 300, ebitdaEfos: 350,
        lucroLiquidoDre: 100, lucroLiquidoEfos: 100,
        fcoDfc: 150, fcoEfos: 150,
        caixaFinalDfc: 50, caixaFinalEfos: 50,
        patrimonioLiquidoBp: 500, patrimonioLiquidoEfos: 500,
        capitalConsumidoDlpa: 20, capitalConsumidoEfos: 20
      });

      assert.strictEqual(canonical.EBITDA.status, 'DIVERGENT');
      assert.strictEqual(canonical.EBITDA.divergence, 50);
      assert.strictEqual(canonical.LucroLiquido.status, 'MATCH');
    });
  });

  describe('CanonicalDivergenceAuditEngine', () => {
    it('should block optimistic thesis when critical metrics are divergent', () => {
      const canonical = MetricCanonicalizationEngine.canonicalize({
        ebitdaDre: 300, ebitdaEfos: 800, // Severe divergence in critical metric
        lucroLiquidoDre: 100, lucroLiquidoEfos: 100,
        fcoDfc: 150, fcoEfos: 150,
        caixaFinalDfc: 50, caixaFinalEfos: 50,
        patrimonioLiquidoBp: 500, patrimonioLiquidoEfos: 500,
        capitalConsumidoDlpa: 20, capitalConsumidoEfos: 20
      });

      const audit = CanonicalDivergenceAuditEngine.audit(canonical);

      assert.strictEqual(audit.status, 'BLOCKED_FOR_OPTIMISTIC_THESIS');
      assert.ok(audit.issues.some(i => i.severity === 'CRITICAL'));
      assert.ok(audit.executiveMessage?.includes('divergência'));
    });

    it('should allow neutral/negative thesis without blocking when perfectly matched', () => {
      const canonical = MetricCanonicalizationEngine.canonicalize({
        ebitdaDre: 300, ebitdaEfos: 300,
        lucroLiquidoDre: 100, lucroLiquidoEfos: 100,
        fcoDfc: 150, fcoEfos: 150,
        caixaFinalDfc: 50, caixaFinalEfos: 50,
        patrimonioLiquidoBp: 500, patrimonioLiquidoEfos: 500,
        capitalConsumidoDlpa: 20, capitalConsumidoEfos: 20
      });

      const audit = CanonicalDivergenceAuditEngine.audit(canonical);

      assert.strictEqual(audit.status, 'PASS');
      assert.strictEqual(audit.issues.length, 0);
    });
  });

  describe('CompositeScoreGovernanceEngine', () => {
    it('should apply floor 20 if equity is positive despite low calculated score', () => {
      const score = CompositeScoreGovernanceEngine.govern({
        calculatedScore: 5,
        hasRevenue: true,
        equityPositive: true,
        operationalContinuity: false
      });

      assert.strictEqual(score.originalScore, 5);
      assert.strictEqual(score.fiduciaryAdjustedScore, 20);
      assert.strictEqual(score.isAdjusted, true);
      assert.ok(score.adjustmentReason?.includes('20') || score.adjustmentReason?.includes('PL positivo') || score.adjustmentReason?.includes('patrimônio líquido positivo'));
    });

    it('should apply floor 10 if operating continuity exists but no equity', () => {
      const score = CompositeScoreGovernanceEngine.govern({
        calculatedScore: 5,
        hasRevenue: true,
        equityPositive: false,
        operationalContinuity: true
      });

      assert.strictEqual(score.fiduciaryAdjustedScore, 10);
      assert.ok(score.adjustmentReason?.includes('10') || score.adjustmentReason?.includes('receita'));
    });

    it('should allow 0 if no revenue, no equity and no operation', () => {
      const score = CompositeScoreGovernanceEngine.govern({
        calculatedScore: 0,
        hasRevenue: false,
        equityPositive: false,
        operationalContinuity: false
      });

      assert.strictEqual(score.fiduciaryAdjustedScore, 0);
      assert.strictEqual(score.isAdjusted, false);
    });
  });

  describe('Orchestrator: orchestrateExecutiveConsolidation', () => {
    it('should run full pipeline and enforce cross statement tension', () => {
      const recs: ExecutiveRecommendation[] = [
        { text: 'Recuperar Caixa', type: 'BOARD', impact: 'Muito Alto' },
        { text: 'Recuperar Caixa', type: 'EXECUTIVE', impact: 'Alto' }
      ];

      const result = orchestrateExecutiveConsolidation(
        {
          ebitdaDre: -50, ebitdaEfos: -50,
          lucroLiquidoDre: -100, lucroLiquidoEfos: -100,
          fcoDfc: -20, fcoEfos: -20,
          caixaFinalDfc: -50, caixaFinalEfos: -50,
          patrimonioLiquidoBp: -10, patrimonioLiquidoEfos: -10,
          capitalConsumidoDlpa: 50, capitalConsumidoEfos: 50
        },
        {
          calculatedScore: 25,
          equityPositive: false,
          hasRevenue: true,
          operationalContinuity: false
        },
        {
          isSurviving: false,
          survivalContext: 'Sem tesouraria.',
          isValueCreated: false,
          valueCreationContext: 'DRE negativo.',
          isCapitalProtected: false,
          capitalContext: 'PL negativo.',
          dominantRisk: 'Risco de liquidez',
          priorityDecision: 'Injeção de capital'
        },
        {
          lucroLiquido: -100,
          ebitda: -50,
          fco: -20,
          liquidezReal: 0.5,
          runway: 1,
          capitalConsumido: 50
        },
        recs
      );

      // Tensions validation: DRE negative + DFC negative
      assert.ok(result.crossStatementTensions !== undefined);
      assert.strictEqual(result.crossStatementTensions.length > 0, true);
      assert.ok(result.crossStatementTensions[0].narrative.toLowerCase().includes('prejuízo') || result.crossStatementTensions[0].narrative.toLowerCase().includes('resultado'));

      // Deduplication validation
      // boardTop3 is now derived from fullReport via BoardTop3DecisionEngine directly.
      // Since no fullReport was provided here, it should be 0.
      assert.strictEqual(result.boardTop3.length, 0);
      assert.strictEqual(result.executiveTop5.length, 1); // The BOARD recommendation is mapped or bypassed, but executive takes the first "Recuperar Caixa"

      // Audit validation
      assert.strictEqual(result.divergenceAudit.status, 'PASS'); // Match, so PASS
    });
  });
});
