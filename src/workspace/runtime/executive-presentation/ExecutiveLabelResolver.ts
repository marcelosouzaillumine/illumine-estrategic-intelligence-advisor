import { DRELabelSanitizationRegistry } from '../presentation-governance/DRELabelSanitizationRegistry';
import { PresentationLayer } from '../presentation-governance/ExecutiveAudienceProfile';

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
    'LIQUIDITY_FRAGILITY_OVERRIDE': 'Restrição por Fragilidade de Liquidez',
    'SHORT_TERM_LIABILITY_PRESSURE': 'ciclo imediato', // Abreviado para badges técnicos
    'CONCENTRAÇÃO NO ciclo imediato': 'ciclo imediato', // Abreviado para badges técnicos
    'TREASURY_STRESS_OVERRIDE': 'Restrição por Estresse de Tesouraria',
    'CAPITAL_DEPENDENCY_OVERRIDE': 'Restrição por Dependência de Capital',
    'EARNINGS_QUALITY_OVERRIDE': 'Restrição por Qualidade dos Resultados',
    'Liquidity Fragility Override': 'Restrição por Fragilidade de Liquidez',
    'Treasury Stress Override': 'Restrição por Estresse de Tesouraria',
    'Short-Term Debt Concentration Override': 'Restrição por Concentração de Dívida de ciclo imediato',
    'Capital Dependency Override': 'Restrição por Dependência de Capital',
    'Earnings Quality Override': 'Restrição por Qualidade dos Resultados',
    
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
    'NOT_AVAILABLE': 'Base Histórica Insuficiente',
    'HEALTHY': 'Saudável',
    'UNHEALTHY': 'Crítico',
    'POSITIVE_TREASURY': 'Tesouraria Positiva',
    'MINOR_WARNINGS': 'Pequenas Ressalvas',
    'MONITORING': 'Em Monitoramento',
    'EXCELLENT': 'Excelente',
    'N/A': '—',
    'NAN': '—',
    'NULL': '—',
    'UNDEFINED': '—',
    'DEBT-TO-EQUITY': 'Relação Dívida / Patrimônio Líquido',
    'WORKING CAPITAL': 'Capital de Giro',
    'CURRENT RATIO': 'Liquidez Corrente',
    'QUICK RATIO': 'Liquidez Seca',
    'CASH RATIO': 'Liquidez Imediata',
    
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
    'Velocidade de Erosão Patrimonial': 'Velocidade de Erosão de Capital',
    'Funding Capacity Ratio': 'Índice de Capacidade de Financiamento',
    'Debt Capacity Score': 'Score de Capacidade de Endividamento',
    'Equity Quality Index': 'Qualidade do Capital',
    'Financial Debt-to-Equity': 'Dívida Financeira sobre Patrimônio Líquido',
    'Working Capital Governance': 'Inteligência de Capital de Giro',
    'Patrimonial Governance': 'Inteligência Patrimonial',
    'Executive Financial Analytics': 'Inteligência Financeira Executiva',
    
    // Trends
    'IMPROVING': 'Em Evolução',
    'DETERIORATING': 'Em Deterioração',
    // User additions
    'Funding': 'Capitalização',
    'FUNDING': 'Capitalização',
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
    'HIGH': 'Alta',
    'LOW': 'Baixa',
    'MEDIUM': 'Moderada',
    'MODERATE': 'Moderada',
    'Reconciliation Gap': 'Diferença de Reconciliação',
    'RECONCILIATION GAP': 'Diferença de Reconciliação',
    'ACTIVE': 'Ativo',
    'STATUS': 'Status',
    'Short Term Pressure': 'Concentração no ciclo imediato',
    'Score': 'Pontuação',
    'Proxy Nível 2': 'Estimativa Indireta — Nível 2',
    
    // DRE Data Binding / Technical Leaks Sanitization
    'FINANCIAL.NETREVENUE': 'Receita Líquida',
    'FINANCIAL.EBITDA': 'EBITDA',
    'FINANCIAL.NETPROFIT': 'Lucro Líquido',
    'FINANCIAL.COGS': 'Custo dos Produtos Vendidos',
    'FINANCIAL.ADMINEXPENSES': 'Despesas Administrativas',
    'COMMON.DRE_DETAILS': 'Detalhamento da DRE',
    'COMMON.HORIZONTAL_VERTICAL_ANALYSIS': 'Análise Horizontal e Vertical',
    'COMMON.ACCOUNT': 'Conta Contábil',
    'COMMON.VALUE_BRL': 'Valor',

  };

  public static resolve(key: string, t?: (k: string) => string, density?: PresentationLayer): string {
    if (!key) return '';
    let cleanKey = key.trim();
    
    // Remove technical leakages like [[financial.*]] or [SOVEREIGN TREASURY NOTICE: ...]
    cleanKey = cleanKey.replace(/\[\[.*?\]\]/g, '').trim();
    cleanKey = cleanKey.replace(/\[SOVEREIGN TREASURY NOTICE:.*?\]\s*/g, '').trim();
    
    if (!cleanKey) return '';

    // Direct overrides for EIDF semantic normalization
    if (density !== 'TECHNICAL') {
      const upperClean = cleanKey.toUpperCase();
      if (upperClean === 'EQE' || upperClean === 'EQS') {
        return 'Qualidade da Geração Econômica';
      }
      if (upperClean === 'LOW') {
        return 'Baixa';
      }
      if (upperClean === 'HIGH') {
        return 'Alta';
      }
      if (upperClean === 'MEDIUM' || upperClean === 'MODERATE') {
        return 'Moderada';
      }
      if (upperClean === 'SCORE' && (density === 'BOARD' || density === 'EXECUTIVE')) {
        return 'Pontuação';
      }
      if (upperClean === 'FUNDING') {
        return 'Capitalização';
      }
      if (upperClean === 'RECONCILIATION GAP') {
        return 'Diferença de Reconciliação';
      }
    }

    let resolved = '';

    // Check if translator is provided and has translation
    if (t) {
      const translated = t(cleanKey);
      if (translated && translated !== cleanKey && !(translated.startsWith('[[') && translated.endsWith(']]'))) {
        resolved = translated;
      }
    }

    if (!resolved) {
      // Try DRE sanitization dictionary first
      const sanitized = DRELabelSanitizationRegistry.sanitize(cleanKey);
      if (sanitized !== cleanKey) {
        resolved = sanitized;
      }
    }

    if (!resolved) {
      // Check if the original key was purely a bracketed string
      if (key.trim().startsWith('[[') && key.trim().endsWith(']]')) {
        const inner = key.trim().slice(2, -2).trim();
        const resolvedInner = this.resolve(inner, t, density);
        if (resolvedInner && resolvedInner !== inner) {
          resolved = resolvedInner;
        } else {
          // If it resolved to itself, it's missing, so humanize it
          const humanized = inner
            .replace(/^.*\./, "")
            .replace(/_/g, " ")
            .replace(/([A-Z])/g, " $1")
            .trim();
          resolved = humanized
            .split(" ")
            .filter(word => word.length > 0)
            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join(" ");
        }
      }
    }

    if (!resolved) {
      const upperKey = cleanKey.toUpperCase();
      if (this.LABEL_MAP[upperKey]) {
        resolved = this.LABEL_MAP[upperKey];
      } else if (this.LABEL_MAP[cleanKey]) {
        resolved = this.LABEL_MAP[cleanKey];
      } else if (cleanKey.includes('_')) {
        const snakeToWords = cleanKey.toLowerCase().replace(/_/g, ' ').replace(/(?:^|\s)\S/g, l => l.toUpperCase());
        if (this.LABEL_MAP[snakeToWords]) resolved = this.LABEL_MAP[snakeToWords];
        else if (this.LABEL_MAP[snakeToWords.toUpperCase()]) resolved = this.LABEL_MAP[snakeToWords.toUpperCase()];
      }
    }

    if (!resolved && cleanKey.includes('.')) {
      const humanized = cleanKey
        .replace(/^.*\./, "")
        .replace(/_/g, " ")
        .replace(/([A-Z])/g, " $1")
        .trim();
      resolved = humanized
        .split(" ")
        .filter(word => word.length > 0)
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(" ");
    }

    if (!resolved) {
      const isTechnicalId = /^[a-zA-Z0-9]{20}$/.test(cleanKey) || /^[a-fA-F0-9]{24,32}$/.test(cleanKey);
      if (isTechnicalId) {
        resolved = 'Identificador Fiduciário';
      }
    }

    if (!resolved) {
      if (cleanKey === cleanKey.toUpperCase() || cleanKey.includes('_')) {
        const isReplacedTerm = ['EQE', 'EQS', 'LOW', 'HIGH', 'MEDIUM', 'MODERATE', 'FUNDING', 'RECONCILIATION GAP', 'RECONCILIATION_GAP'].includes(cleanKey.toUpperCase());
        if (!(density !== 'TECHNICAL' && isReplacedTerm)) {
          resolved = 'Avaliação Neutra';
        }
      }
    }

    if (!resolved) {
      resolved = cleanKey;
    }

    // Apply EIDF Semantic Normalization Layer replacements
    if (density !== 'TECHNICAL') {
      resolved = resolved
        .replace(/\bLOW\b/gi, 'Baixa')
        .replace(/\bHIGH\b/gi, 'Alta')
        .replace(/\bMEDIUM\b/gi, 'Moderada')
        .replace(/\bFunding\b/gi, 'Capitalização')
        .replace(/\bReconciliation Gap\b/gi, 'Diferença de Reconciliação')
        .replace(/\bF\.O\.\b/gi, 'Operações')
        .replace(/\bF\.I\.\b/gi, 'Investimentos')
        .replace(/\bF\.F\.\b/gi, 'Financiamentos')
        .replace(/\bF\.O\b/gi, 'Operações')
        .replace(/\bF\.I\b/gi, 'Investimentos')
        .replace(/\bF\.F\b/gi, 'Financiamentos')
        .replace(/\bEQE\b/g, 'Qualidade da Geração Econômica')
        .replace(/\bEQS\b/g, 'Qualidade da Geração Econômica');

      if (density === 'BOARD' || density === 'EXECUTIVE') {
        resolved = resolved.replace(/\bScore\b/gi, 'Pontuação');
      }
    }

    return resolved;
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
