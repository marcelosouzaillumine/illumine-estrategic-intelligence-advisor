import { LLMProvider } from './LLMProvider';

export class OpenAIProvider implements LLMProvider {
  async generateResponse(prompt: string, context: any[]): Promise<string> {
    // ⚠️ ALERTA DE SEGURANÇA ⚠️
    // Esta classe é apenas um contrato de proxy.
    // NUNCA instancie o SDK do OpenAI com OPENAI_API_KEY no Frontend/Vite/React.
    // Esta chamada deve disparar um 'fetch' para o backend seguro (/api/openai-proxy)
    
    throw new Error('OpenAIProvider requires a secure backend proxy to protect OPENAI_API_KEY. Use MockLLMProvider for MVP local development.');
  }
}
