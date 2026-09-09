# EXECUTIVE_DECISION_GOVERNANCE_CANONICAL_ARCHITECTURE.md — Arquitetura Canônica da Camada de Decisão Executiva

> **Documentação de Arquitetura de Inteligência Sem Superfície Visual de Agente (Wave 17.12)**  
> *Norma Subordinada à IERA v1.0 e ADR-066*

---

## 1. Princípio Arquitetural da Camada de Decisão (ADR-066)

> *"Executive Agents are not page components. They are governance engines that power the executive decision experience. Agents provide governance; the executive experience provides decisions."*

---

## 2. Fluxo Cognitivo Puro (Zero UI de Agente)

```
[Financial Data Model] 
        ↓
[Semantic Layer] 
        ↓
[Governance Kernel] 
        ↓
[Agent Runtime (Financial, Risk, Simulation, Advisory Engines)] 
        ↓
[Executive Decision Governance Engine] 
        ↓
[Executive Page Decision Layer (Signal, Narrative, Recommendation, Actions)]
```

---

## 3. Hierarquia Canônica de Página Executiva

1. **`ExecutivePageHeader`**: Identificação do módulo e contexto.
2. **`ExecutiveDecisionLayer`**: Sinal primário, narrativa fiduciária, recomendação de impacto e ações de decisão.
3. **`ExecutiveMetrics`**: Indicadores primários e cartões semânticos.
4. **`ExecutiveCharts & Tables`**: Detalhamento e rastreabilidade contábil.
