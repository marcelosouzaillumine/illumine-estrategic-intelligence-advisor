/**
 * ExecutiveLanguageRegistry
 * 
 * Central registry mapping technical terms, acronyms, and codes to their institutional
 * Brazilian Portuguese equivalents. Decouples presentation text from the engine and UI layers.
 */
export class ExecutiveLanguageRegistry {
  private static readonly MAP: Record<string, string> = {
    // Audience Profiles
    'BOARD': 'Conselho',
    'EXECUTIVE': 'Diretoria',
    'TECHNICAL': 'Análise Técnica',
    'Conselho (BOARD)': 'Conselho',
    'Diretoria (EXECUTIVE)': 'Diretoria',
    'Técnico (TECHNICAL)': 'Análise Técnica',

    // Financial Metrics & Documents
    'Runway': 'Horizonte de Caixa',
    'Runway Fiduciário': 'Capacidade de Sustentação Financeira',
    'Runway Crítico': 'Horizonte Financeiro Crítico',
    'FCO': 'Fluxo Operacional de Caixa',
    'EQE': 'Avaliação de Sustentabilidade dos Resultados',
    'EFSI': 'Sustentabilidade da Tesouraria',
    'CDIL': 'Inteligência Causal de Caixa',
    'DFC': 'Fluxo de Caixa',
    'DRE': 'Demonstração de Resultados',
    'BP': 'Balanço Patrimonial',
    'DLPA': 'Movimentação do Patrimônio Líquido',

    // Severities and Statuses
    'CRITICAL': 'Crítico',
    'WARNING': 'Atenção',
    'WATCH': 'Monitoramento',
    'ALERT': 'Alerta',
    'NORMAL': 'Saudável',

    // Specific DFC Visual Phrases
    'FCO negativo': 'Fluxo Operacional de Caixa Negativo',
    'Sem reversão do FCO negativo': 'Sem reversão da geração operacional negativa de caixa',
    'Explicabilidade & Rastreabilidade do Lucro (EQE)': 'Explicabilidade e Rastreabilidade dos Resultados',
    'Valor usado pelo EQE': 'Valor utilizado na avaliação dos resultados',
    'Qualidade dos Resultados — Camada Técnica': 'Avaliação Técnica dos Resultados',
    'Qualidade do Lucro — Camada Técnica EQE': 'Avaliação Técnica dos Resultados'
  };

  /**
   * Retrieves the institutional translation for a given registry key.
   * If a direct translation is not defined, returns the original key.
   */
  public static getLabel(key: string): string {
    if (!key) return key;
    return this.MAP[key] ?? key;
  }

  /**
   * Translates a string by direct match or case-insensitive lookup.
   */
  public static translate(keyOrText: string): string {
    if (!keyOrText) return keyOrText;
    
    // Direct match
    if (this.MAP[keyOrText]) {
      return this.MAP[keyOrText];
    }

    // Case-insensitive match
    const foundKey = Object.keys(this.MAP).find(k => k.toLowerCase() === keyOrText.toLowerCase());
    if (foundKey) {
      return this.MAP[foundKey];
    }

    // Only allow substring replacements for Level 3 translational tokens to avoid dangerous free-text replacements
    const level3Tokens = ['CRITICAL', 'WARNING', 'WATCH', 'ALERT', 'NORMAL'];
    let result = keyOrText;
    for (const token of level3Tokens) {
      const escapedToken = token.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
      const regex = new RegExp(`\\b${escapedToken}\\b`, 'gi');
      if (regex.test(result)) {
        result = result.replace(regex, this.MAP[token]);
      }
    }
    return result;
  }

  /**
   * Checks if a key or exact text is defined in the registry.
   */
  public static hasTranslation(keyOrText: string): boolean {
    if (!keyOrText) return true;
    if (this.MAP[keyOrText]) return true;
    const foundKey = Object.keys(this.MAP).find(k => k.toLowerCase() === keyOrText.toLowerCase());
    return !!foundKey;
  }
}
