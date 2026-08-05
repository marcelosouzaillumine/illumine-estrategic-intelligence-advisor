import { PromptTemplate } from './PromptTemplate';

export class PromptRegistry {
  private prompts = new Map<string, PromptTemplate>();

  register(prompt: PromptTemplate): void {
    this.prompts.set(`${prompt.id}_v${prompt.version}`, prompt);
  }

  getPrompt(id: string, version: string): PromptTemplate | undefined {
    return this.prompts.get(`${id}_v${version}`);
  }
}
