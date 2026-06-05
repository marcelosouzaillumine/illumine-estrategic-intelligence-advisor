import test from 'node:test';
import assert from 'node:assert';
import { RunwayClassificationEngine } from '../src/core/runtime/cash-intelligence/RunwayClassificationEngine';
import { DFCFiduciaryPriorityResolver } from '../src/core/runtime/cash-intelligence/DFCFiduciaryPriorityResolver';
import { CashQualityExplainabilityEngine } from '../src/core/runtime/cash-intelligence/CashQualityExplainabilityEngine';
import { CashExecutiveAdvisoryEngine } from '../src/core/runtime/cash-intelligence/CashExecutiveAdvisoryEngine';
import { DFCConsistencyAuditEngine } from '../src/core/runtime/cash-intelligence/DFCConsistencyAuditEngine';

test('DFC Executive Excellence Framework (DEEFF v1.0)', async (t) => {
  await t.test('RunwayClassificationEngine', async (t) => {
    await t.test('should classify 1.1 months as CRITICO', () => {
      assert.strictEqual(RunwayClassificationEngine.classify(1.1), 'CRITICO');
    });
    
    await t.test('should classify 0.8 months as EMERGENCIAL', () => {
      assert.strictEqual(RunwayClassificationEngine.classify(0.8), 'EMERGENCIAL');
    });
    
    await t.test('should classify >= 12 as CONFORTAVEL', () => {
      assert.strictEqual(RunwayClassificationEngine.classify(12), 'CONFORTAVEL');
      assert.strictEqual(RunwayClassificationEngine.classify(18), 'CONFORTAVEL');
    });
  });

  await t.test('DFCFiduciaryPriorityResolver', async (t) => {
    await t.test('should prohibit preventative liquidity in critical environment and enforce corrective action', () => {
      const priorities = DFCFiduciaryPriorityResolver.resolve({
        fco: -10000,
        runwayMonths: 1.1,
        cqs: 17,
        dependencyClassification: 'CRITICAL'
      });
      
      const hasPreventative = priorities.some(p => p.text.toLowerCase().includes('preventiva'));
      assert.strictEqual(hasPreventative, false);
      
      assert.strictEqual(priorities[0].text, 'Reduzir consumo operacional de caixa');
      assert.strictEqual(priorities[1].text, 'Aumentar conversão de receita em liquidez');
      assert.strictEqual(priorities[2].text, 'Reduzir dependência de capitalização societária');
    });
  });

  await t.test('CashQualityExplainabilityEngine', async (t) => {
    await t.test('should correctly decompose CQS score', () => {
      const mockCQS = {
        score: 17,
        level: 'CRITICAL',
        alerts: [],
        dimensions: {
          liquidity: { score: 0, severity: 'HIGH' },
          stress: { score: 0, severity: 'HIGH' },
          conversion: { score: 0, severity: 'HIGH' },
          dependency: { score: 3, severity: 'HIGH' },
          workingCapital: { score: 4, severity: 'HIGH' },
          sustainability: { score: 10, severity: 'MODERATE' }
        }
      } as any;
      
      const explained = CashQualityExplainabilityEngine.explain(mockCQS);
      assert.strictEqual(explained.totalScore, 17);
      
      const liq = explained.components.find(c => c.label === 'Liquidez');
      assert.strictEqual(liq?.score, 0);
      assert.strictEqual(liq?.maxScore, 20);
      
      const sus = explained.components.find(c => c.label === 'Sustentabilidade');
      assert.strictEqual(sus?.score, 10);
      assert.strictEqual(sus?.maxScore, 15);
      
      // Verification of total sum
      const totalMax = explained.components.reduce((sum, c) => sum + c.maxScore, 0);
      assert.strictEqual(totalMax, 100);
    });
  });

  await t.test('CashExecutiveAdvisoryEngine', async (t) => {
    await t.test('should compress advisory and respect 600 chars limit', () => {
      const advisory = CashExecutiveAdvisoryEngine.compress(true, true, 'ESTOQUES', true);
      assert.ok(advisory.fullTextLength <= 600);
      assert.strictEqual(advisory.situacaoAtual, 'A companhia dependeu da capitalização dos sócios para sustentar a liquidez.');
      assert.strictEqual(advisory.restricaoPrincipal, 'A operação consumiu caixa em ritmo superior à capacidade de geração operacional.');
      assert.strictEqual(advisory.prioridadeEstrategica, 'Restabelecer a autossuficiência financeira operacional.');
      assert.ok(advisory.outlook.includes('urgentemente'));
    });
  });

  await t.test('DFCConsistencyAuditEngine', async (t) => {
    await t.test('should catch inconsistency when preventative priority exists in critical runway', () => {
      const result = DFCConsistencyAuditEngine.audit(
        [
          { text: 'Manutenção preventiva de liquidez', type: 'BOARD', impact: 'Baixo' },
          { text: 'Outra coisa', type: 'BOARD', impact: 'Baixo' }
        ],
        'CRITICO',
        17,
        'A operação consumiu',
        -10000
      );
      assert.strictEqual(result.isConsistent, false);
      assert.ok(result.violations[0].includes('não pode ter prioridades preventivas'));
    });
    
    await t.test('should return consistent for valid critical scenario', () => {
      const priorities = DFCFiduciaryPriorityResolver.resolve({
        fco: -10000,
        runwayMonths: 1.1,
        cqs: 17,
        dependencyClassification: 'CRITICAL'
      });
      const advisory = CashExecutiveAdvisoryEngine.compress(true, true, 'ESTOQUES', true);
      
      const result = DFCConsistencyAuditEngine.audit(
        priorities,
        'CRITICO',
        17,
        advisory.restricaoPrincipal,
        -10000
      );
      assert.strictEqual(result.isConsistent, true);
      assert.strictEqual(result.violations.length, 0);
    });
  });
});
