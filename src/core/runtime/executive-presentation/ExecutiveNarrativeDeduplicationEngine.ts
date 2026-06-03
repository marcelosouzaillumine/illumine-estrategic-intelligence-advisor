export class ExecutiveNarrativeDeduplicationEngine {
  /**
   * Remove mensagens muito parecidas para não saturar a leitura do Board.
   */
  public static deduplicate(messages: string[]): string[] {
    if (!messages || messages.length === 0) return [];
    
    const uniqueMessages: string[] = [];
    const signatures: Set<string> = new Set();

    for (const msg of messages) {
      if (!msg) continue;
      
      // Cria uma assinatura baseada em palavras-chave para detectar semântica similar
      // Ex: "Dependência de Estoque" e "O estoque representa grande dependência" gerariam assinaturas parecidas
      const signature = this.generateSignature(msg);
      
      if (!signatures.has(signature)) {
        signatures.add(signature);
        uniqueMessages.push(msg);
      }
    }

    return uniqueMessages;
  }

  private static generateSignature(msg: string): string {
    const cleanMsg = msg.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    
    // Lista de stop words e termos muito genéricos a ignorar na assinatura
    const stopWords = ['a', 'o', 'e', 'de', 'do', 'da', 'que', 'em', 'um', 'uma', 'para', 'com', 'na', 'no', 'os', 'as'];
    
    const words = cleanMsg.split(/\s+/).filter(w => w.length > 3 && !stopWords.includes(w));
    
    // Agrupa palavras-chave principais
    // Se a mensagem contiver "estoque" e "dependencia", a assinatura é focada nisso
    const keywords = [];
    if (cleanMsg.includes('estoque')) keywords.push('estoque');
    if (cleanMsg.includes('liquidez')) keywords.push('liquidez');
    if (cleanMsg.includes('alavancagem') || cleanMsg.includes('divida') || cleanMsg.includes('endividamento')) keywords.push('endividamento');
    if (cleanMsg.includes('fco') || cleanMsg.includes('operacional de caixa')) keywords.push('caixa_operacional');
    if (cleanMsg.includes('horizonte') || cleanMsg.includes('runway') || cleanMsg.includes('preservacao')) keywords.push('runway');
    if (cleanMsg.includes('renegociacao') || cleanMsg.includes('obrigacoes')) keywords.push('liability_protection');
    
    if (keywords.length > 0) {
      return keywords.sort().join('_');
    }
    
    // Fallback: junta as primeiras 3 palavras significativas
    return words.slice(0, 3).sort().join('_');
  }
}
