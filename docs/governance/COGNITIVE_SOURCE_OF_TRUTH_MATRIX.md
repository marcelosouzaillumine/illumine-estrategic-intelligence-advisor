# Cognitive Source of Truth Matrix™

**Status:** Active
**Date:** 2026-07-31
**Phase:** 2

O objetivo desta matriz é resolver a ambiguidade arquitetural estabelecendo de forma inquestionável: **“Quem é soberano sobre cada decisão ou contexto?”**

Para evitar duplicidades em fluxos paralelos e múltiplos donos para o mesmo conceito (ex: contexto, memória, confiança), definimos a tabela de Soberania (Source of Truth) abaixo. Qualquer componente ou serviço que não seja o dono soberano, deve atuar obrigatoriamente como *Consumidor* (Proxy/Reader).

## Matriz de Soberania (Source of Truth)

| Conceito Arquitetural | Entidade/Pacote Soberano (Owner) | Componentes Depreciados/Consumidores (Não-Soberanos) |
| :--- | :--- | :--- |
| **Isolamento de Dados (Tenant)** | `TenantIsolationKernel` | Múltiplos interceptors de DB espalhados, checagens manuais na UI. |
| **Contexto Executivo (Identidade)** | `ExecutiveIdentityContext` | `WorkspaceContext` isolados, stores locais da UI. |
| **Memória Institucional (RAG)** | `ExecutiveMemoryService` | Scripts avulsos de RAG, vetores locais, cache não-governado. |
| **Raciocínio & Decisão** | `ExecutiveCognitiveRuntime` | Raciocínio (prompts) executados diretamente na UI (ex: Copilot chamando LLM). |
| **Auditoria de Decisão** | `DecisionForensics` | Logs de aplicação genéricos, `console.log`. |
| **Confiança & Liberação (Gate)** | `CognitiveTrustGate` | Validação local por feature, Governance Engine paralelo. |
| **Estado da UI / Snapshot** | `WorkspaceOrchestrator` | Redux/Zustand stores locais sem sync com o Snapshot do Orchestrator. |

## Regra de Ouro da Arquitetura
**Nenhum componente pode bypassar o Dono Soberano.**
Se a UI (ex: `ExecutiveCopilotPanel`) precisa acessar a memória, ela o faz via `ExecutiveCognitiveRuntime`, que por sua vez solicita ao `ExecutiveMemoryService` respeitando o `TenantIsolationKernel`.

Qualquer fluxo que quebre esta matriz deve ser apontado no *Cognitive Runtime Boundary Audit*.
