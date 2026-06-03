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
    'MATERIAL_WARNINGS': 'Alertas Relevantes',
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
    
    // Trends
    'IMPROVING': 'Em Evolução',
    'DETERIORATING': 'Em Deterioração'
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
    
    // If not found, and it's a single word or snake_case key, attempt a clean title case
    if (!key.includes(' ')) {
      return key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    }
    
    // Otherwise return as is, since it's likely a regular sentence
    return key;
  }
}
