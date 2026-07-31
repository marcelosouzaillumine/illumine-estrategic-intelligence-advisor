export class ExecutiveUXFormatter {
  /**
   * Padroniza como o conteúdo será apresentado na UI.
   * Não altera semântica, apenas aplica estilo visual
   * (ex: bullet points, espaçamentos, negritos estratégicos).
   */
  static format(composedText: string): string {
    let formatted = composedText;
    
    // Assegura que cabeçalhos tenham espaçamento correto
    formatted = formatted.replace(/(## [^\\n]+)\\n([^\\n])/g, '$1\\n\\n$2');
    
    // Adiciona uma assinatura de garantia institucional
    if (!formatted.includes('***')) {
      formatted += '\\n\\n***\\n*Resposta padronizada pela Executive Semantic Layer™*';
    }

    return formatted;
  }
}
