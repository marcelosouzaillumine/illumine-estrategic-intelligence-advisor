export interface FinancialMetricDefinition {
  id: string;
  category: 'liquidity' | 'profitability' | 'leverage' | 'efficiency' | 'cash_generation';
  meaning: string;
  businessQuestion: string;
  relatedMetrics: string[];
}

export class FinancialMetricOntology {
  private dictionary: Map<string, FinancialMetricDefinition>;

  constructor() {
    this.dictionary = new Map();
    this.seed();
  }

  private seed() {
    this.dictionary.set('financial.liquidity.current_ratio', {
      id: 'financial.liquidity.current_ratio',
      category: 'liquidity',
      meaning: 'Capacidade operacional de honrar obrigações de curto prazo utilizando ativos circulantes',
      businessQuestion: 'A operação consegue sustentar suas obrigações correntes sem risco de liquidez imediato?',
      relatedMetrics: ['working_capital', 'quick_ratio', 'cash_burn_rate']
    });

    this.dictionary.set('financial.performance.revenue_growth', {
      id: 'financial.performance.revenue_growth',
      category: 'profitability', // could be 'growth'
      meaning: 'Capacidade da empresa de expandir geração econômica',
      businessQuestion: 'O crescimento atual gera valor ou apenas aumenta volume?',
      relatedMetrics: ['ebitda_margin', 'gross_margin']
    });

    this.dictionary.set('financial.profitability.ebitda_margin', {
      id: 'financial.profitability.ebitda_margin',
      category: 'profitability',
      meaning: 'Eficiência operacional antes dos efeitos financeiros e fiscais',
      businessQuestion: 'A operação gera valor suficiente e possui capacidade de sustentar crescimento e honrar dívidas?',
      relatedMetrics: ['revenue_growth', 'operating_expenses', 'cash_generation', 'gross_margin']
    });

    this.dictionary.set('financial.profitability.net_margin', {
      id: 'financial.profitability.net_margin',
      category: 'profitability',
      meaning: 'Resultado econômico final após todos os efeitos',
      businessQuestion: 'O modelo econômico é realmente rentável?',
      relatedMetrics: ['net_income', 'financial_expenses']
    });

    this.dictionary.set('financial.cashflow.operating_cash_flow', {
      id: 'financial.cashflow.operating_cash_flow',
      category: 'cash_generation',
      meaning: 'Geração de caixa originada exclusivamente das atividades operacionais',
      businessQuestion: 'A operação gera recursos suficientes para sustentar o negócio?',
      relatedMetrics: ['ebitda_margin', 'cash_conversion', 'net_income']
    });

    this.dictionary.set('financial.cashflow.cash_conversion', {
      id: 'financial.cashflow.cash_conversion',
      category: 'cash_generation',
      meaning: 'Proporção do lucro ou EBITDA que se transforma efetivamente em caixa',
      businessQuestion: 'O lucro contábil está se transformando em caixa?',
      relatedMetrics: ['operating_cash_flow', 'ebitda_margin', 'net_income']
    });

    this.dictionary.set('financial.cashflow.capex', {
      id: 'financial.cashflow.capex',
      category: 'cash_generation',
      meaning: 'Despesas de capital (investimentos em imobilizado e intangível)',
      businessQuestion: 'O investimento realizado aumenta capacidade futura?',
      relatedMetrics: ['free_cash_flow', 'revenue_growth']
    });

    this.dictionary.set('financial.cashflow.free_cash_flow', {
      id: 'financial.cashflow.free_cash_flow',
      category: 'cash_generation',
      meaning: 'Caixa disponível após investimentos necessários para manutenção e expansão',
      businessQuestion: 'Quanto caixa sobra após manter e expandir a operação?',
      relatedMetrics: ['operating_cash_flow', 'capex', 'dividend_yield']
    });

    this.dictionary.set('financial.leverage.debt_to_equity', {
      id: 'financial.leverage.debt_to_equity',
      category: 'leverage',
      meaning: 'Proporção de capital de terceiros em relação ao capital próprio',
      businessQuestion: 'Qual o grau de dependência externa e o risco de insolvência a longo prazo?',
      relatedMetrics: ['interest_coverage', 'total_debt', 'equity']
    });
  }

  public resolve(metricId: string): FinancialMetricDefinition | undefined {
    return this.dictionary.get(metricId);
  }

  public getRelatedMetrics(metricId: string): string[] {
    const definition = this.resolve(metricId);
    return definition ? definition.relatedMetrics : [];
  }
}
