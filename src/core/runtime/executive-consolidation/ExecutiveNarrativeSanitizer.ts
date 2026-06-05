export class ExecutiveNarrativeSanitizer {
  /**
   * Remove vazamentos técnicos e tags LLM das narrativas executivas.
   */
  public static sanitize(text: string): string {
    if (!text) return text;
    
    let sanitized = text;
    
    // Transforma "[GROWTH] Maximizar..." em "Maximizar..."
    sanitized = sanitized.replace(/\[GROWTH\]/gi, '');
    sanitized = sanitized.replace(/\[OPTIMIZATION\]/gi, '');
    sanitized = sanitized.replace(/\[RISK\]/gi, '');
    sanitized = sanitized.replace(/\[GOVERNANCE\]/gi, '');
    sanitized = sanitized.replace(/\[CAPITAL\]/gi, '');
    
    // Remove parâmetros omitidos
    sanitized = sanitized.replace(/Parâmetros de divulgação omitidos:?/gi, '');
    sanitized = sanitized.replace(/A simulação.*?cenários/gi, 'Executar revisão dos cenários');
    
    // Remove ".:" ou sujeiras de formatação em qualquer lugar
    sanitized = sanitized.replace(/\s*\.:\s*/g, ' ');
    sanitized = sanitized.replace(/^\s*:\s*/, '');
    
    // Remove metadados internos de engine, se existirem
    sanitized = sanitized.replace(/runtime\.[a-zA-Z0-9_.]+/gi, '');
    sanitized = sanitized.replace(/\[\[.*?\]\]/g, ''); // tags como [[DFC_METRIC]]

    sanitized = sanitized.replace(/\s+/g, ' ').trim();

    return sanitized;
  }

  public static hasValidExecutiveVerb(text: string): boolean {
    if (!text) return false;
    // Lista de verbos válidos
    const validVerbs = [
      'implementar', 'revisar', 'reduzir', 'reestruturar', 
      'renegociar', 'recuperar', 'fortalecer', 'instituir', 
      'preservar', 'executar', 'estabelecer', 'otimizar',
      'mitigar', 'alinhar', 'garantir', 'avaliar'
    ];
    
    const firstWord = text.split(' ')[0].toLowerCase();
    
    // Verifica se a primeira palavra é um dos verbos ou se o texto contém algum deles 
    // no caso de sujeira de pontuação no início
    return validVerbs.some(verb => text.toLowerCase().includes(verb));
  }
}
