export interface LLMProvider {
  generateResponse(prompt: string, context: any[]): Promise<string>;
}
