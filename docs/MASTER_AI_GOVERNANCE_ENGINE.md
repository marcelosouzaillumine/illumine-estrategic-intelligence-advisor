# MASTER AI GOVERNANCE ENGINE

Este documento define as regras inegociáveis que operam a Inteligência Artificial dentro da plataforma Illumine. A arquitetura segue um princípio estrito e dogmático: **A IA não é a Fonte de Verdade; ela é apenas a Camada de Explicação (Explanation Layer)**. A Fonte da Verdade (*Truth Layer*) reside isolada e intocada no Runtime Consolidado.

## Princípios Institucionais Obrigatórios

1. **Pureza Matemática:** A LLM não pode calcular DRE, recalcular balanço, nem deduzir números financeiros. Se não foi calculado pelo Runtime, a IA não sabe responder.
2. **Confidence Control:** A LLM não pode decidir ou alterar a confiança de um alerta, risco ou cenário. Essa é uma atribuição algorítmica do Core Engine.
3. **Tenant Boundary (Isolamento Multi-Tenant):** Uma sessão de IA **jamais** mistura ou consulta relatórios de empresas de tenants diferentes. O vazamento contextual bloqueado fisicamente no nível do `AITenantBoundaryEnforcer`.
4. **Lineage e Grounding Fiduciário:** Toda resposta gerada deve apontar exatamente o *hash*, o ID da Execução e a versão do Relatório Institucional de onde obteve a conclusão. Respostas sem *Grounding* são automaticamente bloqueadas pelo sistema.
5. **Prevenção de Alucinações Sistêmicas:** O *Prompt Policy Engine* corta a conversa no *frontend* antes de invocar o LLM caso detecte palavras de "criação" numérica (ex: "estime", "chute", "recalcule").

## A Máquina de Estado do Copiloto Institucional

O ciclo de vida obrigatório de cada interação flui orquestradamente através das 8 camadas blindadas em `InstitutionalCopilotRuntime.ts`:

1. **AIQueryRequest:** Recebimento da intenção e metadados (`tenantId`, `role`).
2. **AIPromptPolicyEngine (Interceptor):** Barreiras Regulares anti-cálculo e anti-mutação.
3. **AIContextResolver & AITenantBoundaryEnforcer:** Obtenção estrita de contextos permitidos (Apenas do banco do Tenant/Workspace apropriados).
4. **AIPermissionResolver:** Validação de privilégios (`BOARD_MEMBER`, `AUDITOR`, `ADVISOR`).
5. **AIResponseGroundingEngine:** Extração fiduciária do contexto. Se os relatórios não bastarem, erro é ejetado (`INSUFFICIENT_GROUNDED_CONTEXT`).
6. **LLM Provider Generation:** Somente aqui o texto validado e governado alcança a API LLM. (Nunca executado diretamente via Componente React UI).
7. **AIHallucinationGuard:** Escudo de validação Pós-LLM.
8. **AITraceBinder & AIUsageAuditLogger:** Persistência inalterável da rastreabilidade (`AITRACE`) no histórico governamental.

## Providers e Proteção de Chaves (Zero-Trust UI)

No Frontend React, **nunca** importamos SDKs de LLM. Usamos a interface `LLMProvider`.
- **`MockLLMProvider`:** Usado no modo local/teste e para Auditorias Arquiteturais rápidas.
- **`OpenAIProvider`:** Apenas uma casca de Proxy que deverá chamar uma rota de Backend Node fechada para retransmitir ao ChatGPT. A `OPENAI_API_KEY` jamais transitará ou existirá no contexto do navegador.

## Efemeridade da Sessão de Copiloto

A fim de neutralizar definitivamente o risco de cruzamento de conversas (*cross-tenant session leak*):
- O Chat de IA é mantido puramente no estado em memória da página atual (React State).
- Mudanças de *Workspace* ou transições pesadas invalidam o chat, reiniciando-o vazio. Não se utiliza `IndexedDB` nem `localStorage` para retenção contínua da conversa.
- Persiste-se formalmente (via Logs) apenas a Causa, o Risco, e o Trace da Auditoria, sem serializar conversas sensíveis aleatórias do cliente na base de dados (exceto se opt-in explícito for requisitado na política final).
