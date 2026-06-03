import test from 'node:test';
import assert from 'node:assert';
import { LegacyDFCAdapter } from '../src/runtime/adapters/LegacyDFCAdapter';
import { EarlyStageNarrativeEngine } from '../src/core/runtime/semantic/EarlyStageNarrativeEngine';
import { EarlyStageConsistencyValidator } from '../src/core/runtime/semantic/EarlyStageConsistencyValidator';
import { RunwayDisclosureEngine } from '../src/core/runtime/semantic/RunwayDisclosureEngine';

test('ESGF Semantic Propagation v1.1', async (t) => {

  await t.test('1. Granatum 2022 lifecycleStage === INITIAL_CAPITALIZATION & CQS / EQS Semantic Overrides', async () => {
    // Simulando adapter call para INITIAL_CAPITALIZATION
    const bpSummary = {
      ativoTotal: 100000,
      passivoTotal: 80000,
      patrimonioLiquido: 20000,
      caixaEquivalentes: 14037.70,
      ativoCirculante: 50000,
      passivoCirculante: 30000
    };
    const dre = { ebitda: -50000, lucroLiquido: -60000 };
    const context = {
      input: {
        rawFinancialData: {
          filterYear: '2022',
          allHistoryData: [
            { year: '2022', docType: 'BP', conta: 'Ativo Total', val: 100000 },
            { year: '2022', docType: 'BP', conta: 'Passivo Total', val: 980000 },
            { year: '2022', docType: 'BP', conta: 'Caixa', val: 1000.00 },
            { year: '2021', docType: 'BP', conta: 'Caixa', val: 10000 },
            { year: '2022', docType: 'BP', conta: 'Mútuos', val: 750000 },
            { year: '2021', docType: 'BP', conta: 'Mútuos', val: 0 },
            { year: '2022', docType: 'DRE', conta: 'Lucro Líquido', val: -600000 },
            { year: '2022', docType: 'DFC', conta: 'Caixa Operacional', val: -755330.16 },
            { year: '2022', docType: 'DFC', conta: 'Financiamentos', val: 755330.16 },
          ],
          bpSummary,
          ebitda: -500000,
          lucroLiquido: -600000,
          fcoOperacionalReal: -755330.16
        },
        financialRuntimeContext: {
          lifecycleProfile: {
            lifecycleStage: 'INITIAL_CAPITALIZATION',
            cashStatus: {
              semanticLabel: 'Estrutura de Caixa Dependente de Capitalização Inicial'
            },
            earningsStatus: {
              semanticLabel: 'Risco de Resultado em Fase Inicial de Capitalização'
            }
          }
        }
      }
    };
    
    // Test 2 & 3: CQS & EQS
    const result = await LegacyDFCAdapter.execute(context as any);
    
    assert.strictEqual(
      result.inference?.metrics?.fiduciary?.cashQuality?.rawRiskLevel, 
      'Critical Cash Integrity Risk',
      'CQS deve manter a severidade matemática Crítica'
    );
    assert.strictEqual(
      result.inference?.metrics?.fiduciary?.cashQuality?.semanticLabel, 
      'Estrutura de Caixa Dependente de Capitalização Inicial',
      'CQS deve substituir o label genérico na leitura semântica'
    );
    
    assert.strictEqual(
      result.inference?.metrics?.fiduciary?.earningsQuality?.rawRiskLevel, 
      'Critical Earnings Integrity Risk',
      'EQS deve manter a severidade matemática Crítica'
    );
    assert.strictEqual(
      result.inference?.metrics?.fiduciary?.earningsQuality?.semanticLabel, 
      'Risco de Resultado em Fase Inicial de Capitalização',
      'EQS deve substituir o label genérico na leitura semântica'
    );
  });

  await t.test('4. Narrativa startup aplicada', async () => {
    const narrative = EarlyStageNarrativeEngine.interpret(
      'INITIAL_CAPITALIZATION', 
      'Queima de caixa operacional.', 
      { hasPositiveEquity: true, analysisYear: '2022' }
    );
    assert.ok(narrative.includes('A companhia encontra-se em fase inicial de capitalização'));
    assert.ok(narrative.includes('2022'));
  });

  await t.test('5. Narrativa madura bloqueada', () => {
    assert.throws(
      () => EarlyStageConsistencyValidator.validate('INITIAL_CAPITALIZATION', 'A empresa apresenta deterioração histórica grave.'),
      /EARLY_STAGE_SEMANTIC_CONTRADICTION/
    );
    
    assert.throws(
      () => EarlyStageConsistencyValidator.validate('INITIAL_CAPITALIZATION', 'Há um colapso operacional consolidado.'),
      /EARLY_STAGE_SEMANTIC_CONTRADICTION/
    );
  });

  await t.test('6. Runway auditável', () => {
    const audit = RunwayDisclosureEngine.calculate(14037.70, -75533.16, '12 meses');
    assert.strictEqual(audit.cashAvailable, 14037.70);
    assert.strictEqual(audit.operationalCashBurn, -75533.16);
    assert.strictEqual(audit.periodBase, '12 meses');
    assert.ok(audit.monthlyBurn > 0);
    assert.ok(audit.runwayMonths > 0);
  });

});
