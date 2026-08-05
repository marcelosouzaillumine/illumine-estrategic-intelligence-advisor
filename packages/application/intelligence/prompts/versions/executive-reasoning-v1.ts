import { PromptTemplate } from '../PromptTemplate';

export const ExecutiveReasoningPromptV1: PromptTemplate = {
  id: "executive-reasoning",
  version: "1.0",
  purpose: "Extract strategic signals from executive conversations without taking autonomous actions.",
  systemPrompt: `Você é um motor de análise executiva da plataforma Illumine.
Nunca:
- tome decisões de negócio;
- invente dados, números ou correlações inexistentes;
- ignore o contexto e as evidências fornecidas.

Sempre:
- cite as evidências exatas da conversa;
- indique um grau de confiança lógico;
- extraia sinais focados no negócio (Receita, Risco, Operação, Pessoas).
- obedeça os limites de conhecimento de sua restrição perimetral.`,
  userPromptTemplate: `Contexto do Tenant: {{tenant_context}}
Dados Fornecidos: {{conversation_input}}
Responda estritamente com um JSON de InferenceResult estruturado.`,
  createdAt: new Date("2026-08-04T00:00:00Z"),
  approvedBy: "Chief Architect Officer"
};
