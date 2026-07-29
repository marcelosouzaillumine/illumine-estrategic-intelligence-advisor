# ARCHITECTURE_COMPLIANCE.md — Illumine Governance & Quality Gates (IERA v1.0)

> **Documento Normativo Supremo de Validação Automática e Conformidade**  
> *Horizonte Temporal de Estabilidade: 10+ Anos (2026 – 2036+)*  
> *Status: Homologado & Congelado*

---

## 1. Matriz Normativa de Dependências Permitidas

| Pacote do Monorepo | Pode Depender Exclusivamente De | Dependências Proibidas |
| :--- | :--- | :--- |
| **`packages/domain/core-primitives`** | **Ninguém (0 dependências de negócio)** | Todo o restante do monorepo |
| **`packages/domain/semantic-model`** | `core-primitives` | contracts, domain, capabilities, applications, runtime, intelligence |
| **`packages/domain/executive-contracts`** | `core-primitives` + `semantic-model` | domain, capabilities, applications, runtime, intelligence |
| **`packages/domain/executive-domain`** | `core-primitives` + `semantic-model` + `executive-contracts` | capabilities, applications, runtime, infraestrutura, intelligence |
| **`packages/capabilities`** | `executive-contracts` + `executive-domain` + `core-primitives` | Outras capabilities diretamente & applications |
| **`packages/intelligence/agent-runtime`** | `intelligence-kernel` + `core-primitives` + `semantic-model` + `executive-contracts` | Banco de dados direto |
| **`packages/intelligence/executive-decision-workspace`**| `agent-runtime` + `advisory-workflow-engine` + `core-primitives` | Lógica de negócio duplicada |
| **`packages/intelligence/executive-board`** | `executive-decision-workspace` + `agent-runtime` + `core-primitives` | BD direto |

---

## 2. Pipeline de Qualidade & Enforcement de Release CI/CD (12-Step Gate)

$$\text{Build} \rightarrow \text{Typecheck} \rightarrow \text{Dependency Validation} \rightarrow \text{Semantic Validation} \rightarrow \text{Contract Compatibility} \rightarrow \text{Capability Registry Validation} \rightarrow \text{Intelligence Artifact Validation} \rightarrow \text{Enterprise Graph Validation} \rightarrow \text{Human Approval Validation} \rightarrow \text{Advisory Governance Validation} \rightarrow \text{EDOS Validation} \rightarrow \text{Tests}$$

---

## 3. Exit Criteria Absolutos da Wave 16.5 (Checklist Automatizado)

- [ ] **Phase 0 Interaction Model**: `docs/architecture/product/EXECUTIVE_INTERACTION_MODEL.md` mantido.
- [ ] **Phase 1 Decision Workspace**: `@illumine/executive-decision-workspace` com `ExecutiveDecision` (Decision Trace ID).
- [ ] **Phase 2 Executive Narrative**: `@illumine/executive-narrative-engine` com 9 briefs padronizados.
- [ ] **Phase 3 Multi-Agent Debate**: `@illumine/agent-debate-engine` com `AgentDebateEngine`.
- [ ] **Phase 4 Explainability**: `@illumine/executive-explainability` com `ExecutiveExplainabilityCenter`.
- [ ] **Phase 5 Executive Memory**: `@illumine/organizational-memory` com `ExecutiveDecisionTimeline`.
- [ ] **Phase 6 Executive Board**: `@illumine/executive-board` com `ExecutiveBoardExperience`.
- [ ] **Phase 7 Product UX Standard**: `docs/architecture/product/EXECUTIVE_PRODUCT_CONSTITUTION.md` com Cognitive Load Standard.
- [ ] **Phase 8 Product Value**: `@illumine/product-value-engine` com `ProductValueEngine`.
- [ ] **Phase 9 Product Certification & Registry**: `product-capability-registry.json`, `PRODUCT_READINESS_REPORT.md` (EPS 98.2/100) e `WAVE17_READINESS_REPORT.md`.
- [ ] **Phase 10 Governance ADRs**: `ADR-041` a `ADR-048` publicadas.
- [ ] **Compliance Gate**: `npm run typecheck` PASS com 0 erros e 100% de testes passando.
