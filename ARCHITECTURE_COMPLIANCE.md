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
| **`packages/intelligence/advisory-governance`** | `agent-runtime` + `core-primitives` + `semantic-model` + `executive-contracts` | Alterações de código autônomas sem aprovação |
| **`packages/intelligence/advisory-workflow-engine`**| `advisory-governance` + `agent-runtime` + `core-primitives` + `executive-contracts` | Infraestrutura de UI ou BD |

---

## 2. Pipeline de Qualidade & Enforcement de Release CI/CD (11-Step Gate)

$$\text{Build} \rightarrow \text{Typecheck} \rightarrow \text{Dependency Validation} \rightarrow \text{Semantic Validation} \rightarrow \text{Contract Compatibility} \rightarrow \text{Capability Registry Validation} \rightarrow \text{Intelligence Artifact Validation} \rightarrow \text{Enterprise Graph Validation} \rightarrow \text{Human Approval Validation} \rightarrow \text{Advisory Governance Validation} \rightarrow \text{Tests}$$

---

## 3. Exit Criteria Absolutos da Wave 15D (Checklist Automatizado)

- [ ] **Phase 1 Advisory Operating Model**: `docs/architecture/advisory/ADVISORY_OPERATING_MODEL.md` mantido.
- [ ] **Phase 2 & 3 Advisory Governance**: `@illumine/advisory-governance` com `AdvisoryRecommendationContract` e `AdvisoryConfidenceEngine`.
- [ ] **Phase 4 & 5 Workflow & Value Engine**: `@illumine/advisory-workflow-engine` com `AdvisoryCase` e `AdvisoryValueRealizationEngine`.
- [ ] **Phase 6 Pilot Readiness**: `docs/architecture/advisory/ADVISORY_PILOT_READINESS_MATRIX.md` em Nível 4.
- [ ] **Phase 7 Real World Validation**: Formula do `AgentOperationalScore` validada.
- [ ] **Phase 8 ADRs & Report**: `ADR-033` a `ADR-036` e `WAVE15D_OPERATIONAL_READINESS_REPORT.md` com Veredito `GO`.
- [ ] **Compliance Gate**: `Architecture Compliance Index` $\ge 95\%$ e `npm run typecheck` PASS com 0 erros.
