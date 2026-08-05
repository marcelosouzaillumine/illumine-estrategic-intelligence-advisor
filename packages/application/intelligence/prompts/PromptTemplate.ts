export interface PromptTemplate {
  id: string;
  version: string;
  purpose: string;
  systemPrompt: string;
  userPromptTemplate: string; // Template string with placeholders like {{context}} and {{input}}
  createdAt: Date;
  approvedBy: string;
}
