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
│   └── architecture-registry/# Cartório Arquitetural (packages, dependency, contracts, capabilities, freeze registries)
├── domain/                   # Domínio Executivo Canônico
│   ├── core-primitives/      # Núcleo Atômico: Primitivas, Value Objects & Errors (0 dependências de negócio)
│   ├── semantic-model/       # Enterprise Semantic System (kernel, taxonomy, ontology, catalogs, vocabulary, dimensions, relationships)
│   ├── executive-contracts/  # Contratos Públicos Puros Imutáveis (capability, governance, decision, reasoning, versioning, events)
│   └── executive-domain/     # Lógica de Domínio Interna (aggregates, factories, services, rules, policies, lifecycle, projectors)
├── intelligence/             # Camada Estendida de Inteligência Executiva, Agent Runtime & EDOS (Waves 13 a 16.5)
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
│   ├── continuous-intelligence-monitor/# Monitoramento Contínuo de Sinais Empresariais (Wave 16 Phase 1)
│   ├── advisory-trigger-engine/# Motor de Gatilhos Proativos de Aconselhamento (Wave 16 Phase 2)
│   ├── executive-insight-engine/# Motor de Geração de Insights Executivos (Wave 16 Phase 4)
│   ├── executive-priority-engine/# Motor de Priorização Executiva (Wave 16 Phase 5)
│   ├── executive-decision-workspace/# Workspace Executivo Unificado de Decisões (Wave 16.5 Phase 1)
│   ├── executive-narrative-engine/# Motor de Narrativas e Pareceres Executivos (Wave 16.5 Phase 2)
│   ├── agent-debate-engine/  # Motor de Debate e Convergência Multi-Agente (Wave 16.5 Phase 3)
│   ├── executive-explainability/# Centro de Explicabilidade Executiva Total (Wave 16.5 Phase 4)
│   ├── executive-board/      # Experiência e Operação do Conselho de Administração (Wave 16.5 Phase 6)
│   └── product-value-engine/ # Medição Continuada de Valor e ROI do Produto (Wave 16.5 Phase 8)
├── runtime/                  # Kernel, Executive Bus, Scheduler, Queue, Projection Engine (@illumine/runtime)
├── capabilities/             # Capacidades cognitivas registradas (financial, governance, operational, strategic, risk, advisor)
├── applications/             # Visões do usuário (Board Report, Risk, Finance, ESG, Portfolio)
├── integrations/             # Inference Gateway (LLMs, Solvers, Monte Carlo, MCP) & Connectors (ERP, CRM)
├── extensions/               # Extensões e plugins de terceiros
└── tooling/                  # CLI, geradores de código, linters e utilitários
```

---

## 2. Architecture Decision Records (ADRs)

### `ADR-001` a `ADR-040`: Core Foundation, Intelligence, Runtime, Advisory & Continuous Intelligence
- ADRs normativas anteriores congeladas.

### `ADR-041`: Executive Decision Workspace Architecture (Wave 16.5)
- **Decisão**: Estabelecer o workspace unificado de decisão executiva em `@illumine/executive-decision-workspace`.

### `ADR-042`: Executive Narrative Architecture (Wave 16.5)
- **Decisão**: Padronizar o pipeline automatizado KPIs $\rightarrow$ Insights $\rightarrow$ Narrativa $\rightarrow$ Parecer em `@illumine/executive-narrative-engine`.

### `ADR-043`: Multi-Agent Debate Standard (Wave 16.5)
- **Decisão**: Instituir o motor de debate e resolução de divergências entre agentes em `@illumine/agent-debate-engine`.

### `ADR-044`: Executive Explainability Framework (Wave 16.5)
- **Decisão**: Definir o centro de explicabilidade estrita em `@illumine/executive-explainability`.

### `ADR-045`: Institutional Decision Memory (Wave 16.5)
- **Decisão**: Expandir `@illumine/organizational-memory` com a `ExecutiveDecisionTimeline` para pareamento de contextos e decisões passadas.

### `ADR-046`: Executive Board Operating Model (Wave 16.5)
- **Decisão**: Criar o ambiente operacional do Conselho de Administração em `@illumine/executive-board`.

### `ADR-047`: Executive Product Experience Standard (Wave 16.5)
- **Decisão**: Formalizar o padrão visual e de UX em `EXECUTIVE_PRODUCT_CONSTITUTION.md`.

### `ADR-048`: Enterprise Decision Operating System (Wave 16.5)
- **Decisão**: Declarar a homologação final da plataforma como um Enterprise Decision Operating System (EDOS).

---

## 3. Roteiro de Transição Arquitetural

- **Wave 16**: Concluída (Controlled Autonomous Advisory).
- **Wave 16.5**: Em Execução (Executive Product Hardening & Decision Experience).
