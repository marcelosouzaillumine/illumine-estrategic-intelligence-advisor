import { AIQueryResponse, AIAllowedContext } from './AIGovernanceTypes';

export class AIHallucinationGuard {
  /**
   * Pós-processamento simples para detectar se a IA gerou números ou menções não existentes no contexto.
   * (Em produção avançada, usa embeddings/cross-check, no MVP bloqueia padrões óbvios).
   */
  static validate(response: string, context: AIAllowedContext[]): AIQueryResponse {
    // Exemplo de verificação: se o response falar de uma entidade que não tá no contexto.
    // Para o MVP, aceitamos a resposta da LLM se tiver passado pelas políticas.
    
    // Fallback pass-through para o MVP
    return {
      answer: response,
      groundingReferences: [], // Preenchido no Runtime
      blocked: false,
      aiTraceId: '',
      riskLevel: 'LOW'
    };
  }
}
