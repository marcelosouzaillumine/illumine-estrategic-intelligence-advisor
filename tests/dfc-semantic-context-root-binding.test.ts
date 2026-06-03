import test, { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { LegacyDFCAdapter } from '../src/runtime/adapters/LegacyDFCAdapter';
import { auditSemanticContextBinding } from '../src/runtime/auditors/DFCSemanticContextAudit';

describe('DFC Semantic Context Root Binding Audit', () => {
  const mockContextWithELSA = {
    input: {
      financialRuntimeContext: {
        lifecycleProfile: {
          lifecycleStage: 'INITIAL_CAPITALIZATION',
          lifecycleConfidence: 'HIGH',
          foundationYear: 2023,
          cashStatus: { semanticLabel: 'Estrutura de Caixa Dependente de Capitalização Inicial' },
          earningsStatus: { semanticLabel: 'Risco de Resultado em Fase Inicial de Capitalização' },
          treasuryStatus: { semanticLabel: 'Alta Sensibilidade de Tesouraria' },
          liquidityStatus: { semanticLabel: 'Liquidez Subsidiada' }
        },
        semanticContext: {
          semanticSource: 'ELSA',
          lifecycleStage: 'INITIAL_CAPITALIZATION'
        }
      },
      rawFinancialData: {
        filterYear: 2023,
        allHistoryData: [
          { year: 2023, docType: 'dfc', conta: 'Saldo Inicial de Caixa', valor: 1000 },
          { year: 2023, docType: 'dfc', conta: 'Saldo Final de Caixa', valor: 5000 },
          { year: 2023, docType: 'balanço patrimonial', type: 'ativo', category: 'caixa e equivalentes', valor: 5000 },
          { year: 2023, docType: 'dre', category: 'lucro liquido', valor: -2000 }
        ]
      }
    },
    inferences: {}
  };

  const mockContextWithLegacy = {
    input: {
      rawFinancialData: {
        filterYear: 2023,
        allHistoryData: [
          { year: 2023, docType: 'dfc', conta: 'Saldo Inicial de Caixa', valor: 1000 },
          { year: 2023, docType: 'dfc', conta: 'Saldo Final de Caixa', valor: 5000 },
          { year: 2023, docType: 'balanço patrimonial', type: 'ativo', category: 'caixa e equivalentes', valor: 5000 },
          { year: 2023, docType: 'dre', category: 'lucro liquido', valor: 1000 }
        ]
      }
    },
    inferences: {}
  };

  it('Test 1: Verify Advisory consumes ELSA', async () => {
    const result = await LegacyDFCAdapter.execute(mockContextWithELSA as any);
    const inference = result.inference as any;
    assert.strictEqual(inference.semanticSource, 'ELSA');
    assert.strictEqual(inference.lifecycleProfile.lifecycleStage, 'INITIAL_CAPITALIZATION');
  });

  it('Test 2: Verify CQS consumes ELSA', async () => {
    const result = await LegacyDFCAdapter.execute(mockContextWithELSA as any);
    const inference = result.inference as any;
    assert.strictEqual(inference.cqsSemantic, 'Estrutura de Caixa Dependente de Capitalização Inicial');
  });

  it('Test 3: Verify EQS consumes ELSA', async () => {
    const result = await LegacyDFCAdapter.execute(mockContextWithELSA as any);
    const inference = result.inference as any;
    assert.strictEqual(inference.eqsSemantic, 'Risco de Resultado em Fase Inicial de Capitalização');
  });

  it('Test 4: Verify Context Panel consumes same semantic source', async () => {
    const result = await LegacyDFCAdapter.execute(mockContextWithELSA as any);
    const dfcInference = result.inference as any;
    
    // Simulate DFCPage logic
    const semanticContext =
      dfcInference?.semanticContext
      ?? dfcInference?.lifecycleProfile
      ?? dfcInference?.metrics?.fiduciary?.lifecycleProfile
      ?? null;

    const semanticSource =
      semanticContext?.semanticSource
      ?? dfcInference?.semanticSource
      ?? 'LEGACY';

    assert.strictEqual(semanticSource, 'ELSA');
  });

  it('Test 5: Verify Fonte: ELSA rendered logic via audit fn', async () => {
    const result = await LegacyDFCAdapter.execute(mockContextWithELSA as any);
    const dfcInference = result.inference as any;
    
    const semanticContext =
      dfcInference?.semanticContext
      ?? dfcInference?.lifecycleProfile
      ?? dfcInference?.metrics?.fiduciary?.lifecycleProfile
      ?? null;

    const semanticSource =
      semanticContext?.semanticSource
      ?? dfcInference?.semanticSource
      ?? 'LEGACY';

    const audit = auditSemanticContextBinding(dfcInference, semanticContext, semanticSource);
    assert.strictEqual(audit.panelUsingELSA, true);
    assert.strictEqual(audit.advisoryUsingELSA, true);
  });

  it('Test 6: Verify lifecycle label rendered logic', async () => {
    const result = await LegacyDFCAdapter.execute(mockContextWithELSA as any);
    const dfcInference = result.inference as any;
    
    const semanticContext =
      dfcInference?.semanticContext
      ?? dfcInference?.lifecycleProfile
      ?? dfcInference?.metrics?.fiduciary?.lifecycleProfile
      ?? null;

    const lifecycleStage = semanticContext?.lifecycleStage ?? 'ESTABLISHED_ANALYSIS';
    assert.strictEqual(lifecycleStage, 'INITIAL_CAPITALIZATION');
  });

  it('Test 7: Verify DFC_CONTEXT_PANEL_BINDING_FAILURE emitted on mismatch', () => {
    const dfcInference = {
      semanticSource: 'ELSA',
      lifecycleProfile: { lifecycleStage: 'INITIAL_CAPITALIZATION' }
    };
    
    // Simulate faulty panel reading
    const semanticSource = 'LEGACY';

    const originalConsoleError = console.error;
    let errorLog = '';
    console.error = (msg: string) => { errorLog = msg; };

    const audit = auditSemanticContextBinding(dfcInference, null, semanticSource);
    
    assert.strictEqual(audit.bindingMismatch, true);
    assert.strictEqual(errorLog, 'CRITICAL: DFC_CONTEXT_PANEL_BINDING_FAILURE');
    
    console.error = originalConsoleError;
  });
});
