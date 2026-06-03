import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { normalizeKey, matchFinancialKey } from '../src/utils/financialKeyNormalizer';

describe('Financial Key Normalizer Utility Tests', () => {

  it('should normalize accents, symbols, leading numbering and spaces correctly', () => {
    assert.strictEqual(normalizeKey('(=) Receita Operacional Líquida'), 'receita operacional liquida');
    assert.strictEqual(normalizeKey('(-) Prejuízo Líquido do Exercício'), 'prejuizo liquido do exercicio');
    assert.strictEqual(normalizeKey('1.1 - Caixa e Equivalentes'), 'caixa e equivalentes');
    assert.strictEqual(normalizeKey('DEPÓSITOS BANCÁRIOS À VISTA'), 'depositos bancarios a vista');
    assert.strictEqual(normalizeKey('Lucro/Prejuízo do Exercício'), 'lucro/prejuizo do exercicio');
  });

  it('should match keys using containment and similarity checks', () => {
    // 1. (=) Receita Operacional Líquida matches standard alias
    assert.ok(
      matchFinancialKey('(=) Receita Operacional Líquida', ['Receita Operacional Líquida', 'Receita Líquida'])
    );

    // 2. Lucro/Prejuízo do Exercício matches standard alias
    assert.ok(
      matchFinancialKey('Lucro/Prejuízo do Exercício', ['Lucro/Prejuízo do Exercício', 'Lucro Líquido'])
    );

    // 3. (-) Prejuízo Líquido do Exercício matches standard alias
    assert.ok(
      matchFinancialKey('(-) Prejuízo Líquido do Exercício', ['Prejuízo Líquido do Exercício', 'Lucro Líquido'])
    );

    // 4. DEPÓSITOS BANCÁRIOS À VISTA matches standard alias
    assert.ok(
      matchFinancialKey('DEPÓSITOS BANCÁRIOS À VISTA', ['Depósitos Bancários', 'Caixa e Equivalentes'])
    );

    // 5. 1.1 - Caixa e Equivalentes matches standard alias
    assert.ok(
      matchFinancialKey('1.1 - Caixa e Equivalentes', ['Caixa e Equivalentes', 'Disponibilidades'])
    );
  });

  it('should respect generic terms safeguard and NOT match liabilities/credit accounts for caixa/banco', () => {
    // Generic name "banco" should match "bancos" exactly
    assert.ok(matchFinancialKey('Bancos', ['banco']));
    assert.ok(matchFinancialKey('Banco', ['bancos']));

    // But generic name "banco" should NOT match "passivo bancario" or "emprestimo bancario"
    assert.strictEqual(matchFinancialKey('Passivo Bancário', ['banco']), false);
    assert.strictEqual(matchFinancialKey('Empréstimo Bancário', ['bancos']), false);
    assert.strictEqual(matchFinancialKey('Contas a Pagar Bancos', ['caixa', 'banco']), false);

    // Generic name "caixa" should NOT match "caixa de passivo" or "creditos com socios de caixa"
    assert.strictEqual(matchFinancialKey('Mútuo de Caixa de Sócios', ['caixa']), false);
  });

});
