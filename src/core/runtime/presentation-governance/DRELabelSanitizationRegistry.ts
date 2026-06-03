/**
 * DRELabelSanitizationRegistry
 * 
 * DEGFF v1.0 — Mandatory immutable dictionary for translating executive technical terms.
 * Prevents original language leakage and development jargon.
 */

export class DRELabelSanitizationRegistry {
  private static readonly DICTIONARY: Record<string, string> = {
    'Net Revenue': 'Receita Líquida',
    'Gross Revenue': 'Receita Bruta',
    'Net Profit': 'Resultado Líquido',
    'Gross Profit': 'Resultado Bruto',
    'EBITDA': 'EBITDA',
    'COGS': 'Custo dos Produtos Vendidos',
    'Admin Expenses': 'Despesas Administrativas',
    'Financial Result': 'Resultado Financeiro',
    'Operating Profit': 'Resultado Operacional',
    'Income Tax': 'Imposto de Renda',
    'Account': 'Conta',
    'Value Brl': 'Valor (R$)',
    'Scale Efficiency Intelligence': 'Inteligência de Escala',
    'Growth Revenue': 'Crescimento de Receita',
    'Growth EBITDA': 'Crescimento de EBITDA',
    'NOT_AVAILABLE': 'Histórico Insuficiente',
  };

  public static sanitize(label: string): string {
    return this.DICTIONARY[label] || label;
  }
}
