import { describe, it } from 'node:test';
import assert from 'node:assert';
import { LegacyDFCAdapter } from '../../runtime/adapters/LegacyDFCAdapter';

describe('DFC Indirect Inference Contract', () => {
  it('Deve inferir FCO a partir de variações do BP e Lucro Líquido, e declarar INFERRED_CASHFLOW_ONLY', async () => {
    const context: any = {
      input: {
        rawFinancialData: {
          filterYear: 2025,
          allHistoryData: [
            // No Official DFC Entries
            
            // DRE
            { year: 2025, docType: 'dre', conta: 'Lucro Líquido', val: 150000 },
            { year: 2025, docType: 'dre', conta: 'Depreciação', val: 20000 },
            
            // BP 2025
            { year: 2025, docType: 'bp', entryType: 'ativo', category: 'Caixa e Equivalentes', val: 200000 },
            { year: 2025, docType: 'bp', entryType: 'ativo', category: 'Clientes', val: 50000 },
            { year: 2025, docType: 'bp', entryType: 'ativo', category: 'Estoque', val: 30000 },
            { year: 2025, docType: 'bp', entryType: 'passivo', category: 'Fornecedores', val: 60000 },
            { year: 2025, docType: 'bp', entryType: 'passivo', category: 'Emprestimos', val: 100000 },
            
            // BP 2024
            { year: 2024, docType: 'bp', entryType: 'ativo', category: 'Caixa e Equivalentes', val: 100000 },
            { year: 2024, docType: 'bp', entryType: 'ativo', category: 'Clientes', val: 80000 },
            { year: 2024, docType: 'bp', entryType: 'ativo', category: 'Estoque', val: 20000 },
            { year: 2024, docType: 'bp', entryType: 'passivo', category: 'Fornecedores', val: 40000 },
            { year: 2024, docType: 'bp', entryType: 'passivo', category: 'Emprestimos', val: 150000 }
          ]
        }
      }
    };

    const result = await LegacyDFCAdapter.execute(context);
    const violations = result.violations || [];
    
    const inferredViolation = violations.find(v => v.rule === 'INFERRED_CASHFLOW_ONLY');
    assert.ok(inferredViolation, 'Deve emitir violação INFERRED_CASHFLOW_ONLY informando o uso de método indireto');
    assert.strictEqual(result.confidence, 'LOW');
  });

  it('Deve bloquear a análise se não houver DFC oficial nem BP consecutivo para inferência', async () => {
    const context: any = {
      input: {
        rawFinancialData: {
          filterYear: 2025,
          allHistoryData: [
            // Only current year BP, missing previous year and missing DRE
            { year: 2025, docType: 'bp', entryType: 'ativo', category: 'Caixa e Equivalentes', val: 200000 }
          ]
        }
      }
    };

    const result = await LegacyDFCAdapter.execute(context);
    assert.strictEqual(result.success, false);
    
    const violations = result.violations || [];
    const missingViolation = violations.find(v => v.rule === 'MISSING_INDIRECT_PREREQUISITES');
    assert.ok(missingViolation, 'Deve bloquear por falta de dados para método indireto');
    assert.strictEqual(missingViolation.blocked, true);
  });
});
