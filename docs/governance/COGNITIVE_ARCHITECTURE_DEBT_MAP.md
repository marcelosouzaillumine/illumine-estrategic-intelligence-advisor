# Cognitive Architecture Debt Map™

**Status:** Active
**Date:** 2026-07-31
**Phase:** 5

A finalidade deste documento é catalogar dívidas arquiteturais que quebram as regras de governança e consolidação cognitiva da Illumine. Os itens listados aqui são alvos prioritários de refatoração para garantir a prontidão (*readiness*) da Wave 16 (Multi-Agent).

## 1. Motores Duplicados (Duplicated Engines)
- **Múltiplos Copilots na UI:** `BoardCopilotPanel`, `InstitutionalCopilotPage`, `ExecutiveCopilotPanel` possuem lógicas repetidas de orquestração de chat, injeção de contexto e formatação. A inteligência deve residir no *Cognitive Runtime* e a UI deve ser apenas uma casca (renderer).
- **Múltiplos Context Resolvers:** Existem sobreposições conceptuais na estrutura de pacotes: `executive-context-engine` vs `executive-identity-context` vs `executive-conversation-context`.

## 2. Serviços e Contratos Conflitantes
- **Conflicting Responsibilities no Workspace:** O `ExecutiveWorkspaceOrchestrator` deveria ser o único detentor do `ExecutiveWorkspaceSnapshot`. Entretanto, componentes da UI mantém *stores* independentes (`Zustand` ou estado local) para dados que influenciam a inteligência.
- **Legacy Copilot Flows:** Os fluxos mais antigos não assinam digitalmente o contrato `ExecutiveDecisionForensicsPackage`, enviando a resposta crua do LLM diretamente para a tela. Isto quebra a certificação de Forensics da Wave 15.1.

## 3. Sistemas de Memória Paralelos
- RAG não-canônico: Scripts avulsos ou pipelines antigos de ingestão que ainda recuperam dados sem encapsulamento no `TenantIsolationContext` devem ser eliminados em favor de um `ExecutiveMemoryService` soberano.

## Plano de Eliminação (Deprecation Plan)
1. Centralizar as lógicas de prompt de todos os painéis Copilot em um único adapter de saída do *Cognitive Runtime*.
2. Remover lógicas de RAG direto dos componentes React.
3. Consolidar os pacotes de contexto em um único `ExecutiveIdentityContext`.

Nenhuma eliminação física de código acontecerá sem que este plano de migração esteja completo e aprovado.
