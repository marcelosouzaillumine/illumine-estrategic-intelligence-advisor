export class ExecutiveLabelResolver {
  private static readonly LABEL_MAP: Record<string, string> = {
    // Structures
    'FRAGILE_STRUCTURE': 'Estrutura Frágil',
    'VULNERABLE_STRUCTURE': 'Estrutura Vulnerável',
    'STABLE_STRUCTURE': 'Estrutura Estável',
    'RESILIENT_STRUCTURE': 'Estrutura Resiliente',
    'FRAGILE': 'Frágil',
    'VULNERABLE': 'Vulnerável',
    'STABLE': 'Estável',
    'RESILIENT': 'Resiliente',
    
    // Warnings & Overrides
    'MATERIAL_WARNINGS': 'Alertas Patrimoniais Relevantes',
    'CLASSIFICATION_OVERRIDE_APPLIED': 'Ajuste Conservador de Classificação Aplicado',
    'FORCED_CAUTION_DISCLOSURE': 'Divulgação Prudencial Obrigatória',
    'LIQUIDITY_FRAGILITY_OVERRIDE': 'Fragilidade Estrutural de Liquidez',
    'SHORT_TERM_LIABILITY_PRESSURE': 'Pressão de Endividamento de Curto Prazo',
    'TREASURY_STRESS_OVERRIDE': 'Estresse Severo de Tesouraria',
    'CAPITAL_DEPENDENCY_OVERRIDE': 'Dependência Estrutural de Capital',
    'EARNINGS_QUALITY_OVERRIDE': 'Risco na Qualidade dos Lucros',
    'Liquidity Fragility Override': 'Fragilidade Estrutural de Liquidez',
    'Treasury Stress Override': 'Estresse Severo de Tesouraria',
    'Short-Term Debt Concentration Override': 'Concentração de Dívida de Curto Prazo',
    'Capital Dependency Override': 'Dependência Estrutural de Capital',
    'Earnings Quality Override': 'Risco na Qualidade dos Lucros',
    
    // Action Matrix & Treasury
    'CASH_PRESERVATION': 'Fortalecimento da posição de caixa',
    'LIABILITY_PROTECTION': 'Renegociação e alongamento das obrigações financeiras',
    'TREASURY_STABILIZATION': 'Estabilização da tesouraria',
    'PROFITABILITY_RECOVERY': 'Recuperação de rentabilidade operacional',
    'GROWTH_ACCELERATION': 'Aceleração de crescimento sustentável',
    'DEBT_RESTRUCTURING': 'Reestruturação profunda do passivo',
    
    // Status
    'CONSISTENT': 'Consistente',
    'FAIL_CLOSED': 'Restrição Fiduciária',
    'WARNING': 'Atenção',
    'CRITICAL': 'Crítico',
    'ATTENTION': 'Atenção',
    'INSUFFICIENT_DATA': 'Dados Insuficientes',
    'HEALTHY': 'Saudável',
    'POSITIVE_TREASURY': 'Tesouraria Positiva',
    
    // Structures
    'RESILIENT STRUCTURE': 'Estrutura Resiliente',
    'STABLE STRUCTURE': 'Estrutura Estável',
    'VULNERABLE STRUCTURE': 'Estrutura Vulnerável',
    'FRAGILE STRUCTURE': 'Estrutura Frágil',
    'CRITICAL STRUCTURE': 'Estrutura Crítica',
    
    // Metrics
    'Loss Absorption Capacity': 'Capacidade de Absorção de Perdas',
    'Equity Buffer': 'Margem de Segurança Patrimonial',
    'Survival Index': 'Índice de Sobrevivência',
    'Capital Erosion Velocity (CEV)': 'Velocidade de Erosão de Capital',
    'Funding Capacity Ratio': 'Capacidade de Sustentar Crescimento',
    'Debt Capacity Score': 'Capacidade de Endividamento',
    'Equity Quality Index': 'Capital Consumido',
    'Financial Debt-to-Equity': 'Endividamento Financeiro sobre PL',
    'Working Capital Intelligence': 'Inteligência de Capital de Giro',
    'Patrimonial Intelligence': 'Inteligência Patrimonial',
    'Executive Financial Analytics': 'Análise Financeira Executiva',
    
    // Trends
    'IMPROVING': 'Em Evolução',
    'DETERIORATING': 'Em Deterioração',
    // User additions
    'Funding': 'Financiamento',
    'Funding Capacity': 'Capacidade de Sustentar Crescimento',
    'Debt Capacity': 'Capacidade de Endividamento',
    'Asset Concentration Risk': 'Risco de Concentração de Ativos',
    'Proxy Estimated': 'Estimativa Indireta',
    'AV': 'Análise Vertical',
    'AH': 'Análise Horizontal',
    'Confidence': 'Confiança',
    'Funding Restriction': 'Restrição de Financiamento',
    'Funding Pressure': 'Pressão de Financiamento',
    'NEUTRAL': 'Neutro',
    'HIGH': 'Alto',
    'LOW': 'Baixo',
    'ACTIVE': 'Ativo',
    'STATUS': 'Status',
    'Short Term Pressure': 'Concentração no Curto Prazo',
    'Score': 'Indicador de Síntese',
    'Proxy Nível 2': 'Estimativa Indireta — Nível 2',

  };

  public static resolve(key: string): string {
    if (!key) return '';
    const cleanKey = key.trim().toUpperCase();
    if (this.LABEL_MAP[cleanKey]) {
      return this.LABEL_MAP[cleanKey];
    }
    if (this.LABEL_MAP[key.trim()]) {
      return this.LABEL_MAP[key.trim()];
    }
    
    // If not found, check if it's a snake_case key
    if (key.includes('_')) {
      const snakeToWords = key.toLowerCase().replace(/_/g, ' ').replace(/(?:^|\s)\S/g, l => l.toUpperCase());
      if (this.LABEL_MAP[snakeToWords]) return this.LABEL_MAP[snakeToWords];
      if (this.LABEL_MAP[snakeToWords.toUpperCase()]) return this.LABEL_MAP[snakeToWords.toUpperCase()];
    }
    
    // Fallback: se for um código interno (ALL CAPS ou snake_case) não mapeado, blindamos a UI retornando neutro
    if (key === key.toUpperCase() || key.includes('_')) {
      return 'Avaliação Neutra';
    }
    
    // Retorna a própria string caso seja um nome de métrica normal em português (ex: "Liquidez Corrente")    
    return key;
  }

  public static resolveImpact(metricName: string): string {
    const map: Record<string, string> = {
      'Liquidez Real': 'Risco imediato de liquidez',
      'Liquidez Seca': 'Risco imediato de liquidez',
      'Liquidez Imediata': 'Ausência de caixa livre para choques',
      'Loss Absorption Capacity': 'Baixa capacidade de absorver perdas',
      'Equity Quality Index': 'Redução da proteção patrimonial',
      'Risco de Concentração de Ativos': 'Aprisionamento de capital em ativos de baixa fluidez',
      'Ativo - Estoques %': 'Aprisionamento de capital',
      'Capital Consumido': 'Redução da proteção patrimonial',
      'Funding Capacity Ratio': 'Estrangulamento do potencial de financiamento',
      'Dependência de Capital de Terceiros': 'Elevada exposição ao custo de dívida externa',
      'Velocidade de Erosão de Capital': 'Diminuição progressiva da resiliência patrimonial',
      'Liquidez Instantânea Real': 'Incapacidade de resposta a choques'
    };
    return map[metricName] || 'Gera pressão estrutural sobre a organização';
  }
}
