import { describe, it } from 'node:test';
import assert from 'node:assert';
import { DFCIndirectMethodEngine } from '../../capabilities/financial/runtime/cash-intelligence/DFCIndirectMethodEngine';
import { DreCashEvidence, BalanceSheetCashEvidence } from '../../capabilities/financial/runtime/cash-intelligence/CashEvidenceContracts';

describe('DFC Indirect Method Engine Purity Contract', () => {
  it('Deve ser uma função pura, não mutando as evidências de entrada', () => {
    const dreEvidence: DreCashEvidence = {
      netIncome: 100000,
      netIncomeSourceAccount: 'DRE (Mock)',
      depreciationAndAmortization: 20000,
      netRevenue: 500000,
      ebitda: 150000,
      financialExpenses: 10000,
      taxes: 20000
    };

    const bpEvidence: BalanceSheetCashEvidence = {
      ativoTotal: 1000000,
      ativoCirculante: 500000,
      passivoCirculante: 300000,
      patrimonioLiquido: 400000,
      caixaEEquivalentesAnterior: 50000,
      caixaEEquivalentesAtual: 100000,
      varClientes: -10000, // Clientes aumentaram, consumiu caixa
      varEstoque: -5000,
      varFornecedores: 15000, // Fornecedores aumentaram, gerou caixa
      varImobilizadoIntangivel: -30000,
      varDividasBancarias: -20000, // Pagou dívida
      varCapitalSocial: 0,
      dividendosPagos: 0,
      creditosSociosCirculantes: 0,
      creditosSociosTotais: 0,
      varPassivosSocios: 0,
      varCreditosSocios: 0
    };

    // Clona os objetos para verificação
    const originalDre = JSON.parse(JSON.stringify(dreEvidence));
    const originalBp = JSON.parse(JSON.stringify(bpEvidence));

    const result = DFCIndirectMethodEngine.evaluate(dreEvidence, bpEvidence);

    // Asserção de Pureza
    assert.deepStrictEqual(dreEvidence, originalDre, 'DreCashEvidence foi mutado pela engine indireta.');
    assert.deepStrictEqual(bpEvidence, originalBp, 'BalanceSheetCashEvidence foi mutado pela engine indireta.');

    // Asserção de Lógica Matemática
    // FCO = LL + Deprec + VarClientes + VarEstoque + VarFornecedores
    // FCO = 100000 + 20000 - 10000 - 5000 + 15000 = 120000
    assert.strictEqual(result.fco, 120000);

    // FCI = VarImobInt - Deprec (wait, varImob is negative if investment increased)
    // Actually, in the formula it's usually varImob - deprec. We will test based on the engine's implementation.
  });
});
