export const SYSTEM_KPI_CATEGORIES = [
  { id: 'faturamento_bruto', label: 'Faturamento Bruto', cat: 'Performance' },
  { id: 'receita_liquida', label: 'Receita Líquida', cat: 'Performance' },
  { id: 'deducoes', label: 'Deduções e Impostos', cat: 'Performance' },
  { id: 'custos_variaveis', label: 'Custos Variáveis / CMV', cat: 'Performance' },
  { id: 'margem_contribuicao', label: 'Margem de Contribuição', cat: 'Lucratividade' },
  { id: 'despesas_pessoal', label: 'Despesas com Pessoal', cat: 'Operacional' },
  { id: 'despesas_operacionais', label: 'Despesas Operacionais (G&A)', cat: 'Operacional' },
  { id: 'marketing_vendas', label: 'Marketing e Vendas', cat: 'Operacional' },
  { id: 'ebitda', label: 'EBITDA', cat: 'Performance' },
  { id: 'depreciacao', label: 'Depreciação e Amortização', cat: 'Operacional' },
  { id: 'resultado_financeiro', label: 'Resultado Financeiro', cat: 'Financeiro' },
  { id: 'impostos_lucro', label: 'IRPJ / CSLL', cat: 'Performance' },
  { id: 'lucro_liquido', label: 'Lucro Líquido', cat: 'Performance' },
  { id: 'ativo_circulante', label: 'Ativo Circulante', cat: 'Liquidez' },
  { id: 'passivo_circulante', label: 'Passivo Circulante', cat: 'Liquidez' },
  { id: 'estoque', label: 'Estoque', cat: 'Atividade' },
  { id: 'contas_receber', label: 'Contas a Receber', cat: 'Atividade' },
  { id: 'contas_pagar', label: 'Contas a Pagar', cat: 'Atividade' },
  { id: 'disponibilidades', label: 'Caixa e Equivalentes', cat: 'Caixa' },
  { id: 'patrimonio_liquido', label: 'Patrimônio Líquido', cat: 'Patrimonial' },
  { id: 'roic', label: 'ROIC (Retorno s/ Cap. Investido)', cat: 'Estratégico' },
  { id: 'wacc', label: 'WACC (Custo de Capital)', cat: 'Estratégico' },
  { id: 'dscr', label: 'DSCR (Cobertura de Dívida)', cat: 'Risco' },
  { id: 'vwc_days', label: 'Ciclo Financeiro (Dias)', cat: 'Eficiência' },
  { id: 'cac_ltv', label: 'LTV / CAC', cat: 'Crescimento' },
  { id: 'burn_rate', label: 'Cash Burn Rate', cat: 'Venture' },
];

export const MONTH_LABELS: Record<number, string> = {
  1: 'Jan', 2: 'Fev', 3: 'Mar', 4: 'Abr', 5: 'Mai', 6: 'Jun',
  7: 'Jul', 8: 'Ago', 9: 'Set', 10: 'Out', 11: 'Nov', 12: 'Dez'
};

export const FULL_MONTH_LABELS: Record<number, string> = {
  1: 'Janeiro', 2: 'Fevereiro', 3: 'Março', 4: 'Abril', 5: 'Maio', 6: 'Junho',
  7: 'Julho', 8: 'Agosto', 9: 'Setembro', 10: 'Outubro', 11: 'Novembro', 12: 'Dezembro'
};

export const EIXOS_ORDEM = [
  'Governança',
  'Cultura',
  'Gestão',
  'Inovação',
  'Marketing',
  'Comercial',
  'Operação'
];
