export class ExecutiveBlockedAnalysisTranslator {
  /**
   * Substituir mensagens puramente técnicas de erro e logs por "Explicações Executivas".
   */
  public static translate(rawMessage: string): string {
    const message = rawMessage.toLowerCase();
    
    if (message.includes("divergência crítica") || message.includes("reconciliation") || message.includes("análise abortada")) {
      return "A análise de sustentabilidade não pôde ser concluída com confiabilidade devido a divergências relevantes entre as demonstrações financeiras. A reconciliação contábil deve preceder qualquer decisão executiva.";
    }

    if (message.includes("[[runtime.") || message.includes("missing_canonical_source")) {
      return "Dados insuficientes ou divergentes impediram a consolidação estrutural da tese executiva.";
    }

    if (message.includes("not found") || message.includes("undefined") || message.includes("null pointer")) {
      return "Inconsistência nos dados de origem impossibilitou a análise deste componente.";
    }

    // Default translation
    return "A operação não pôde ser concluída devido a limitações nos dados estruturais fornecidos.";
  }

  public static sanitize(text: string): string {
    return text.replace(/\[\[runtime\.[^\]]+\]\]/g, '').trim();
  }
}
