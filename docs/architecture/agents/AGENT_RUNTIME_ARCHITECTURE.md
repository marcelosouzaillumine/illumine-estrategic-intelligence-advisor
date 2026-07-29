# AGENT_RUNTIME_ARCHITECTURE.md — Arquitetura de Execução do Agent Runtime

> **Documento de Arquitetura de Execução dos Agentes (Wave 15B)**  
> *Pacote: `@illumine/agent-runtime`*

---

## 1. Fluxo Canônico de Execução do Agent Runtime

```
Signal Entrante
     ↓
AgentExecutionContext (Contextualização com Enterprise Knowledge Fabric)
     ↓
AgentInvocation (Invocação Rastreável com ProvenanceReference e lineageHash)
     ↓
AgentReasoningTrace (Trilha de raciocínio passo-a-passo)
     ↓
AgentEvidenceBundle (Empacotamento de fatos, evidências e inferências)
     ↓
AgentRecommendation (Emissão da recomendação padronizada)
     ↓
HumanApprovalGateway (Gate de aprovação humana baseado na classificação de risco)
     ↓
DecisionRecord & ExperienceRecord (Registro imutável para aprendizado episódico)
```

---

## 2. Componentes Fundamentais

- **`AgentExecutionContext`**: Carrega o contexto corporativo (`EnterpriseContext`), unidade de negócio, intenção executiva e permissões.
- **`AgentInvocation`**: Registra o ID da invocação, o agente chamado, o sinal disparador e o carimbo de data/hora.
- **`AgentEvidenceBundle`**: Consolida os fatos e evidências do `@illumine/executive-contracts` que suportam a recomendação.
- **`AgentRecommendation`**: Estrutura imutável contendo o título, descrição estratégica, modelo preditivo, custos estimados e justificativa explicável (`PredictionExplanation`).
