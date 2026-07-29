# AGFP-0033 — Workflow Orchestrator (WO)

**RFC: Orquestrador Declarativo de Processos e Workflows Enterprise (v17.0)**

---

## 1. Contexto & Objetivo
O **Workflow Orchestrator (WO)** executa e orquestra processos declarativos na empresa suportando BPMN, State Machines, Sagas, Event-Driven, aprovações, escalonamentos e tarefas humanas com audit trail imutável.

---

## 2. Pipeline do Workflow Orchestrator

```text
  [Workflow Trigger (Event)] ➔ [State Machine Evaluation] ➔ [Policy Check (PE)] ➔ [Execute Actions / Escalation]
```
