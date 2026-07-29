# ADVISORY_OPERATING_MODEL.md — Modelo Operacional de Aconselhamento Executivo

> **Documento Normativo Supremo de Operação de Aconselhamento (Wave 15D)**  
> *Pacote: `@illumine/advisory-governance` & `@illumine/advisory-workflow-engine`*

---

## 1. Ciclo de Vida Canônico do Aconselhamento Executivo

```
DATA OBSERVATION
       │
       ▼
INTELLIGENCE ANALYSIS
       │
       ▼
MULTI-AGENT REASONING
       │
       ▼
EXECUTIVE RECOMMENDATION
       │
       ▼
HUMAN REVIEW
       │
       ▼
DECISION APPROVAL
       │
       ▼
IMPLEMENTATION TRACKING
       │
       ▼
OUTCOME MEASUREMENT
       │
       ▼
LEARNING LOOP
```

---

## 2. Divisão Estrita de Responsabilidades na Operação Real

### **1. Agentes Executivos (Agents)**
- **Responsabilidades**: Análise contínua de dados primários, diagnóstico preditivo de causa-raiz, geração de recomendações executivas rastreáveis, simulação de cenários e empacotamento de evidências (`AgentEvidenceBundle`).

### **2. Executivo Humano (Human Executive)**
- **Responsabilidades**: Deliberação final, julgamento estratégico contextual, aprovação fiduciária no `HumanApprovalGateway` e responsabilidade legal (*Accountability*).

### **3. Plataforma Illumine OS™ (Platform)**
- **Responsabilidades**: Orquestração multi-agente neutra (*Coordinator, Not Controller*), rastreabilidade de linhagem (`lineageHash`), enforcement de compliance e medição do ROI de valor.
