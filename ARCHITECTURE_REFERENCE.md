# ARCHITECTURE_REFERENCE.md — Illumine Executive Reference Implementation Guide (IERA v1.0)

> **Manual de Referência Física e Implementação Monorepo**  
> *Documento Complementar à [`ARCHITECTURE_CONSTITUTION.md`](file:///Users/marcelosouza/Documents/illumine-strategic-intelligence-advisor/ARCHITECTURE_CONSTITUTION.md)*  
> *Status: Homologado*

---

## 1. Estrutura Física Monorepo (Alinhada aos Grandes Domínios)

```
packages/
├── foundation/               # Tenant, Security, Storage, Telemetry e Observabilidade
├── platform/
│   ├── architecture-registry/# Cartório Arquitetural (packages, dependency, contracts, capabilities, freeze registries)
│   └── executive-intelligence-runtime/# Orquestrador de Tempo de Execução Visual por Página (Wave 17.7 Phase 1)
├── domain/                   # Domínio Executivo Canônico
│   ├── core-primitives/      # Núcleo Atômico: Primitivas, Value Objects & Errors (0 dependências de negócio)
│   ├── semantic-model/       # Enterprise Semantic System (kernel, taxonomy, ontology, catalogs, vocabulary, dimensions, relationships)
│   ├── executive-contracts/  # Contratos Públicos Puros Imutáveis (capability, governance, decision, reasoning, versioning, events, data-fabric)
│   └── executive-domain/     # Lógica de Domínio Interna (aggregates, factories, services, rules, policies, lifecycle, projectors)
├── intelligence/             # Camada Estendida de Inteligência Executiva, EDOS & Copilot (Waves 13 a 18.4)
│   ├── intelligence-kernel/  # Núcleo Compartilhado de Cognição (IntelligenceIdentity, ProvenanceReference, Context, Trace, Signal)
│   ├── organizational-memory/# Memória Imutável de Experiências Executivas & ExecutiveDecisionTimeline (Wave 16.5 Phase 5)
│   ├── knowledge-graph/      # Grafo de Conhecimento Causal (Ontology vs Causal Model)
│   ├── executive-orchestrator/# Orquestrador Multi-Agente & ExecutiveAdvisoryCouncil (Wave 16 Phase 3)
│   ├── predictive-engine/    # Motor Preditivo Explainable-First (PredictionExplanation & PredictionCalibration)
│   ├── decision-learning/    # Loop de Aprendizado Decisório por Feedback de Resultado (ModelImprovementRequest)
│   ├── intelligence-certification/# Certificação do EIS Framework (IntelligenceMaturityLevel & IntelligenceTrajectory)
│   ├── enterprise-knowledge-fabric/# Tecido de Conhecimento Empresarial Unificado (Wave 14 Phase 1)
│   ├── organizational-intelligence-graph/# Grafo Organizacional de Estratégia, Capacidades, Processos e Decisões (Wave 14 Phase 2)
│   ├── cross-domain-intelligence/# Motor de Inteligência Transversal entre Domínios Corporativos (Wave 14 Phase 3)
│   ├── benchmark-intelligence/# Camada de Inteligência Comparativa e Baselines (Wave 14 Phase 4)
│   ├── executive-network/    # Rede Executiva Integrada de Conselho, CEO e Consultores Cognitivos (Wave 14 Phase 5)
│   ├── enterprise-certification/# Certificação do Enterprise Intelligence Score - EnIS (Wave 14 Phase 6)
│   ├── agent-runtime/        # Foundation & Ciclo de Vida dos Agentes Executivos (Wave 15B Phase 1 & 2)
│   ├── human-governance-gateway/# Gateway de Aprovação Humana & ExecutiveDecisionGate (Wave 16 Phase 7)
│   ├── agent-impact-engine/  # Motor de Estimativa e Medição de Impacto Econômico (Wave 15B Phase 7)
│   ├── agent-observability/  # Centro de Observabilidade e Monitoramento de Agentes (Wave 15B Phase 8)
│   ├── executive-simulation-engine/# Motor de Simulação Executiva e Validação Pilot (Wave 15C Phase 1)
│   ├── advisory-governance/  # Governança de Recomendação de Aconselhamento (Wave 15D Phase 2 & 3)
│   ├── advisory-workflow-engine/# Motor de Ciclo de Vida e Casos de Aconselhamento (Wave 15D Phase 4 & 5)
│   ├── continuous-intelligence-monitor/# Motor de Monitoramento Contínuo (Wave 16 Phase 1)
│   ├── advisory-trigger-engine/# Motor de Gatilhos Proativos (Wave 16 Phase 2)
│   ├── executive-insight-engine/# Motor de Insights (Wave 16 Phase 4)
│   ├── executive-priority-engine/# Motor de Priorização (Wave 16 Phase 5)
│   ├── executive-decision-workspace/# Workspace de Decisões (Wave 16.5 Phase 1)
│   ├── executive-narrative-engine/# Motor de Narrativas (Wave 16.5 Phase 2)
│   ├── agent-debate-engine/  # Motor de Debate (Wave 16.5 Phase 3)
│   ├── executive-explainability/# Centro de Explicabilidade (Wave 16.5 Phase 4)
│   ├── executive-board/      # Experiência do Conselho (Wave 16.5 Phase 6)
│   ├── product-value-engine/ # Medição de ROI do Produto (Wave 16.5 Phase 8)
│   ├── executive-home/       # Visão Inicial do Executivo (Wave 17 Phase 1)
│   ├── executive-copilot/    # Copilot Conversacional Contextual & ExecutiveCopilotRouter (Wave 17.9 Phase 6)
│   ├── executive-context-engine/# Motor Unificado de Resolver de Contexto Executivo (Wave 18.1 Phase 1 & 2)
│   ├── executive-question-engine/# Gerador Proativo de Perguntas Inteligentes C-Level (Wave 17 Phase 5)
│   ├── executive-insights-layer/# Camada Superior de Apresentação de Insights (Wave 17.5 Phase 1)
│   ├── executive-intelligence-drawer/# Painel Lateral Persistente de Inteligência (Wave 17.5 Phase 2)
│   ├── executive-question-interface/# Menu e Lançador Contextual de Perguntas (Wave 17.5 Phase 3)
│   ├── contextual-kpi-intelligence/# Motor Contextual de Explicação de KPIs (Wave 17.5 Phase 4)
│   ├── executive-page-intelligence/# Real Mount Verification & Experience Mount Gate (Wave 17.10.1 Phase 7)
│   ├── executive-experience-composer/# Composição Canônica da Experiência Executiva (Wave 17.11 Phase 3)
│   └── executive-decision-intelligence/# Motor de Decisão Executiva sem Agent Surface Visual (Wave 17.12 Phase 2)
├── runtime/                  # Kernel, Executive Bus, Scheduler, Queue, Projection Engine (@illumine/runtime)
├── capabilities/             # Capacidades cognitivas registradas (financial, governance, operational, strategic, risk, advisor)
├── applications/             # Visões do usuário (Board Report, Risk, Finance, ESG, Portfolio)
├── integrations/             # Inference Gateway (LLMs, Solvers, Monte Carlo, MCP) & Connectors (ERP, CRM, Banking)
├── extensions/               # Extensões e plugins de terceiros
└── tooling/                  # CLI, geradores de código, linters e utilitários
```

---

## 2. Architecture Decision Records (ADRs)

### `ADR-001` a `ADR-077`: Core Foundation, Intelligence, EDOS, Context-Aware Engine, Executive & Platform Workspaces
- ADRs normativas anteriores congeladas.

### `ADR-078`: Enterprise Data Fabric Architecture (Wave 18.4)
- **Decisão**: Instituir a arquitetura do Enterprise Data Fabric integrando conectores de ERP, CRM, Bancos e Planilhas à camada semântica e ao Executive Digital Twin.

### `ADR-079`: Data Lineage Governance Standard (Wave 18.4)
- **Decisão**: Instituir a obrigatoriedade de rastreabilidade completa (Data Lineage Trace) desde a fonte de dados bruta até o insight e recomendação executiva.

### `ADR-080`: Real-Time Intelligence Event-Driven Runtime Standard (Wave 18.4)
- **Decisão**: Instituir o modelo orientado a eventos de negócios para recalcular a inteligência executiva em tempo real com a chegada de novos eventos operacionais.

---

## 3. Roteiro de Transição Arquitetural

- **Wave 18.1**: Concluída (Executive Context-Aware Intelligence Engine).
- **Wave 18.2**: Concluída (Executive Experience Realization — EER v1.0).
- **Wave 18.3**: Concluída (Platform Workspace Realization & Governance Experience — PWGE v1.0).
- **Wave 18.4**: Em Execução (Enterprise Intelligence Data Fabric — EIDF v1.0 Foundation).
- **Wave 18.5**: Próximo marco (Intelligence Experience & Knowledge Graph Enrichment).
