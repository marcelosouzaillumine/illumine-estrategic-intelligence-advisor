export class AntiLeakageEngine {
  /**
   * Structural Leakage Detection™ (AR-GFC-COP-001)
   * Detecta JSON, Objetos literais, Payloads, IDs técnicos, Stack traces.
   */
  static hasStructuralLeakage(text: string): boolean {
    const structuralPatterns = [
      /\{.*"?[a-zA-Z0-9_]+"?\s*:/, // JSON object signature
      /\[AGENT_INTERNAL_START\]/,
      /\[AGENT_INTERNAL_END\]/,
      /RegistryPayload/,
      /BreadcrumbPath/,
      /SystemPrompt/,
      /\/sys\/nav/,
      /stack trace/i,
      /error ts\d+/i // Erros TypeScript
    ];
    
    return structuralPatterns.some(pattern => pattern.test(text));
  }

  /**
   * Semantic Leakage Detection™ (AR-GFC-COP-002)
   * Detecta frases técnicas amadoras como "Com base no contexto...", "O agente diz...".
   */
  static hasSemanticLeakage(text: string): boolean {
    const lowerText = text.toLowerCase();
    const forbiddenPhrases = [
      'o agente',
      'baseado no contexto',
      'com base no contexto',
      'o contexto atual',
      'o registry',
      'foi utilizado',
      'o pipeline',
      'meu sistema',
      'o sistema determinou',
      'arquitetura interna',
      'conhecimento bruto'
    ];
    
    return forbiddenPhrases.some(phrase => lowerText.includes(phrase));
  }

  /**
   * Aplica as validações e lança erro caso detecte vazamento.
   * O erro deve ser capturado pela camada de auto-regeneração.
   */
  static sanitize(text: string): string {
    if (this.hasStructuralLeakage(text)) {
      throw new Error('AR-GFC-COP-001: Structural Leakage Detected.');
    }
    
    if (this.hasSemanticLeakage(text)) {
      throw new Error('AR-GFC-COP-002: Semantic Leakage Detected.');
    }
    
    return text;
  }
}
