/**
 * ExecutiveLabelGovernanceRegistry
 * 
 * Registry oficial de nomenclaturas executivas.
 * Toda renderização executiva deve passar obrigatoriamente por este registry.
 * Elimina vazamentos de termos técnicos para a camada de apresentação.
 */
export class ExecutiveLabelGovernanceRegistry {
  private static readonly LABEL_MAP: Record<string, string> = {
    // Termos técnicos → Nomenclatura executiva
    'NOT_AVAILABLE': 'Histórico Insuficiente',
    'INSUFFICIENT_DATA': 'Dados Insuficientes',
    'MISSING': 'Não Disponível',
    'undefined': 'Não Disponível',
    'null': 'Não Disponível',

    // Campos financeiros em inglês
    'Net Revenue': 'Receita Líquida',
    'net_revenue': 'Receita Líquida',
    'netRevenue': 'Receita Líquida',
    'Net Profit': 'Resultado Líquido',
    'net_profit': 'Resultado Líquido',
    'netProfit': 'Resultado Líquido',
    'Admin Expenses': 'Despesas Administrativas',
    'admin_expenses': 'Despesas Administrativas',
    'adminExpenses': 'Despesas Administrativas',
    'Growth': 'Crescimento',
    'growth': 'Crescimento',
    'Profitability': 'Rentabilidade',
    'profitability': 'Rentabilidade',
    'Account': 'Conta',
    'account': 'Conta',
    'Value Brl': 'Valor (R$)',
    'value_brl': 'Valor (R$)',
    'EBITDA': 'EBITDA',
    'Gross Profit': 'Lucro Bruto',
    'gross_profit': 'Lucro Bruto',
    'grossProfit': 'Lucro Bruto',
    'COGS': 'Custo dos Produtos Vendidos',
    'cogs': 'Custo dos Produtos Vendidos',
    'Break Even': 'Ponto de Equilíbrio',
    'breakEven': 'Ponto de Equilíbrio',
    'breakEvenRevenue': 'Ponto de Equilíbrio',
    'Burn Rate': 'Consumo Econômico',
    'burn_rate': 'Consumo Econômico',
    'Coverage': 'Cobertura Operacional',
    'coverage': 'Cobertura Operacional',
    'Gap': 'Lacuna para o Equilíbrio',
    'Margin': 'Margem',
    'margin': 'Margem',
    'Score': 'Pontuação',
    'Confidence': 'Confiança',
    'Lineage': 'Linhagem',
    'Runtime': 'Processamento',
    'Payload': 'Dados',
    'Binding': 'Vinculação',
    'Audit': 'Auditoria',

    // Estados e classificações técnicas
    'HEALTHY': 'Saudável',
    'STRESSED': 'Estressado',
    'CRITICAL': 'Crítico',
    'COLLAPSE': 'Colapso',
    'RESTRICTED': 'Restritivo',
    'PRESSURED': 'Pressionado',
    'SENSITIVE': 'Sensível',
    'FAIL_CLOSED': 'Acesso Restrito',
    'NOT_FOUND': 'Não Localizado',
    'CALCULATED': 'Calculado',
  };

  /**
   * Traduz um label técnico para sua versão executiva.
   * Se não encontrar correspondência, retorna o label original.
   */
  public static translate(label: string): string {
    if (!label) return label;
    return this.LABEL_MAP[label] ?? label;
  }

  /**
   * Verifica se um texto contém termos técnicos não permitidos na camada executiva.
   * Retorna lista de termos técnicos encontrados.
   */
  public static detectTechnicalLeaks(text: string): string[] {
    const technicalTerms = [
      'NOT_AVAILABLE', 'MISSING', 'undefined', 'null', 'NOT_FOUND',
      'Net Revenue', 'Net Profit', 'Admin Expenses', 'Growth', 'Profitability',
      'Account', 'Value Brl', 'FAIL_CLOSED', 'CALCULATED_FROM', 'payload',
      'binding', 'runtime', 'source:', 'INSUFFICIENT_HISTORY'
    ];
    return technicalTerms.filter(term => text.includes(term));
  }

  /**
   * Sanitiza um texto removendo e traduzindo termos técnicos.
   */
  public static sanitize(text: string): string {
    if (!text) return text;
    let sanitized = text;
    Object.entries(this.LABEL_MAP).forEach(([technical, executive]) => {
      sanitized = sanitized.split(technical).join(executive);
    });
    return sanitized;
  }
}
