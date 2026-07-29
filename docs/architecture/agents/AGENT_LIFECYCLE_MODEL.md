# AGENT_LIFECYCLE_MODEL.md — Modelo de Ciclo de Vida dos Agentes Executivos

> **Modelo de Estados do Ciclo de Vida (Wave 15B)**

---

## 1. Diagrama de Transição de Estados do Agente Executivo

```
       ┌──────────┐
       │   IDLE   │
       └────┬─────┘
            │ (Sinal Detectado)
            ▼
       ┌──────────┐
       │ OBSERVE  │
       └────┬─────┘
            │ (Coleta de Fatos & Evidências)
            ▼
       ┌──────────┐
       │ ANALYZE  │
       └────┬─────┘
            │ (Grafo Causal & Inferência)
            ▼
       ┌──────────┐
       │ REASON   │
       └────┬─────┘
            │ (Geração da Recomendação)
            ▼
       ┌──────────┐
       │RECOMMEND │
       └────┬─────┘
            │ (Requisito de Governança)
            ▼
┌───────────────────────┐
│ WAIT_HUMAN_APPROVAL  │
└───────────┬───────────┘
            │ (Decisão Registrada pelo Usuário)
            ▼
       ┌──────────┐
       │  LEARN   │
       └──────────┘
```

---

## 2. Descrição das Etapas

1. **`IDLE`**: O agente permanece em escuta passiva de sinais corporativos.
2. **`OBSERVE`**: Coleta dados e fatos do contexto corporativo (`EnterpriseContext`).
3. **`ANALYZE`**: Analisa dados primários através dos seus motores especializados (ex: `DREEngine`, `CostEngine`).
4. **`REASON`**: Constrói a trilha de raciocínio (`ReasoningTrace`) e avalia impactos no Grafo Causal.
5. **`RECOMMEND`**: Emite a estrutura imutável de `AgentRecommendation` acompanhada de `PredictionExplanation`.
6. **`WAIT_HUMAN_APPROVAL`**: Bloqueia a recomendação aguardando deliberação fiduciária humana (*Human-in-the-Loop*).
7. **`LEARN`**: Emite o `LearningSignal` e registra o `DecisionRecord` em `@illumine/organizational-memory`.
