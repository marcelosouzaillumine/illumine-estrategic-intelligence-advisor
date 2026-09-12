import { LLMProvider } from './LLMProvider';

export class MockLLMProvider implements LLMProvider {
  private delayMs: number;

  constructor(delayMs: number = 500) {
    this.delayMs = delayMs;
  }

  async generateResponse(prompt: string, context: any[]): Promise<string> {
    // Simula a latência de rede
    if (this.delayMs > 0) {
      await new Promise(resolve => setTimeout(resolve, this.delayMs));
    }

    return `[MOCK_LLM_RESPONSE] Baseado no contexto fornecido (${context.length} documentos), posso afirmar que a saúde institucional estável. O risco foi mapeado corretamente pelo Orquestrador.`;
  }
}
