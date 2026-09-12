# Estrutura de Diretórios Alvo — Pós Reestruturação
# Referência: .aiox-core/data/layer-boundaries.md
# Status: PLANEJADO — não representa o estado atual do codebase

---

## packages/ (target)

```
packages/
│
├── os/                          ← L1: Illumine OS
│   ├── auth/
│   ├── tenant/
│   ├── security/
│   │   ├── tenant-isolation-kernel/
│   │   └── cognitive-trust-gate/
│   ├── events/
│   ├── observability/
│   ├── runtime/
│   │   ├── engine/
│   │   └── binding/
│   ├── i18n/
│   ├── cache/
│   ├── performance/
│   ├── commercial/              ← billing, subscription, entitlement, licensing
│   ├── infrastructure/          ← firebase, supabase adapters
│   │   ├── firebase/
│   │   └── supabase/
│   ├── metadata/
│   │   ├── registry/
│   │   ├── persistence/
│   │   └── schemas/
│   ├── certification/
│   └── tooling/                 ← developer tooling + architecture governance
│       ├── cli/
│       ├── compiler/
│       ├── lsp/
│       ├── eslint-plugin/
│       ├── architecture-linter/
│       ├── architecture-observatory/
│       └── architecture-governance/  ← 17 pkgs consolidados aqui
│           ├── advisory/
│           ├── audit/
│           ├── certification/
│           ├── decision/
│           ├── discovery/
│           ├── evaluation/
│           ├── intelligence/
│           ├── knowledge/
│           ├── maturity/
│           ├── memory/
│           ├── recommendation/
│           ├── registry/
│           ├── risk/
│           ├── rules/
│           ├── contracts/
│           ├── types/
│           └── ui/
│
├── core/                        ← L2: Motor Cognitivo
│   ├── semantic-model/
│   │   ├── ontology/
│   │   ├── taxonomy/
│   │   ├── vocabulary/
│   │   └── dimensions/
│   ├── knowledge-graph/
│   │   ├── causal-model/
│   │   ├── inference/
│   │   └── ontology/
│   ├── executive-contracts/
│   ├── executive-domain/
│   │   ├── aggregates/
│   │   ├── projectors/
│   │   ├── rules/
│   │   └── services/
│   ├── cognitive-pipeline/
│   │   └── stages/              ← Fact→Evidence→Inference→Finding→Recommendation→Resolution→Action→Learning
│   ├── decision-engine/
│   │   ├── deliberation/
│   │   ├── forensics/
│   │   └── trust-governance/
│   ├── learning-loop/
│   │   ├── observation/
│   │   ├── assessment/
│   │   ├── comparison/
│   │   └── evolution/
│   ├── digital-twin/
│   ├── agent-runtime/
│   │   └── lifecycle/
│   ├── see/                     ← Semantic Execution Engine
│   ├── institutional-memory/    ← canônico, único
│   ├── intelligence-kernel/
│   ├── enterprise-knowledge-fabric/
│   └── human-governance-gateway/
│
├── shell/                       ← L3: White Label Shell
│   ├── workspace/
│   │   ├── orchestrator/
│   │   ├── surfaces/
│   │   └── policies/
│   ├── narrative/
│   │   ├── renderer/
│   │   ├── parser/
│   │   └── engine/
│   ├── brand/
│   ├── partner/
│   │   └── ecosystem/
│   ├── advisory/                ← advisory orchestration agnóstico
│   │   ├── trigger-engine/
│   │   ├── workflow-engine/
│   │   └── governance/
│   ├── experience/
│   │   ├── composer/
│   │   └── rendering-engine/
│   ├── distribution/
│   │   ├── platform/
│   │   └── saas-foundation/
│   ├── intelligence-layer/      ← aggregation, API, context, orchestration, policy, presentation
│   └── companion/               ← executive companion, welcome, living
│
└── product/                     ← L4: Illumine Governance
    ├── financial/
    │   ├── dre/
    │   ├── bp/
    │   ├── dfc/
    │   ├── dlpa/
    │   ├── causal/
    │   ├── scoring/
    │   ├── signals/
    │   └── benchmarking/
    ├── advisory/
    │   ├── engine/
    │   └── intelligence/
    ├── board/
    │   ├── pack/
    │   ├── meeting/
    │   └── decision/
    ├── simulation/
    │   └── scenario/
    ├── mentorship/
    ├── maturity/
    ├── operational-os/          ← company-os, customer-os, etc. renomeados
    └── analytics/
```

---

## src/ (target)

```
src/
│
├── platform/                   ← L1: OS frontend
│   ├── auth/
│   ├── security/
│   ├── tenant/
│   ├── observability/
│   ├── routing/
│   ├── i18n/
│   └── errors/
│
├── engine/                     ← L2: Core frontend
│   ├── intelligence/
│   ├── governance/
│   ├── knowledge/
│   ├── knowledge-graph/
│   ├── constitution/
│   ├── contracts/
│   ├── temporal/
│   ├── data-fabric/
│   ├── digital-twin/
│   ├── memory/
│   └── evidence/
│
├── workspace/                  ← L3: Shell frontend (já existe, expandir)
│   ├── capabilities/           ← ceo, cfo, coo, commercial, people, risk, innovation
│   ├── surfaces/
│   ├── patterns/
│   ├── actions/
│   ├── context/
│   ├── migration/
│   └── preferences/
│
├── components/                 ← componentes UI organizados por camada
│   ├── executive-workspace/    ← L3: shell components (já existe)
│   ├── brand/                  ← L3
│   ├── pages/                  ← L4: páginas do produto (já existe)
│   │   ├── dre/
│   │   ├── balance-sheet/
│   │   ├── dfc/
│   │   ├── dlpa/
│   │   ├── diagnosis/
│   │   ├── governance/
│   │   ├── board/
│   │   ├── simulation/
│   │   └── ...
│   └── shared/                 ← agnóstico
│
├── capabilities/               ← L4: produto (já existe, consolidar)
│   ├── financial/
│   ├── mentorship/
│   ├── executive-advisory/
│   └── assessment-monitoring/
│
└── app/                        ← shell do app (routing, navigation, providers)
    ├── navigation.ts
    └── providers/
```

---

## Mapeamento de Migrations Necessárias

### src/core/ → destinos corretos

| Subdir atual em src/core/          | Destino target         | Camada |
|------------------------------------|------------------------|--------|
| auth                               | src/platform/auth      | L1     |
| security → audit, auth             | src/platform/security  | L1     |
| tenant                             | src/platform/tenant    | L1     |
| observability                      | src/platform/observability | L1  |
| routing                            | src/platform/routing   | L1     |
| errors                             | src/platform/errors    | L1     |
| internationalization               | src/platform/i18n      | L1     |
| localization                       | src/platform/i18n      | L1     |
| intelligence                       | src/engine/intelligence| L2     |
| governance                         | src/engine/governance  | L2     |
| knowledge                          | src/engine/knowledge   | L2     |
| knowledge-graph                    | src/engine/knowledge-graph | L2 |
| constitution                       | src/engine/constitution| L2     |
| contracts                          | src/engine/contracts   | L2     |
| temporal                           | src/engine/temporal    | L2     |
| data-fabric                        | src/engine/data-fabric | L2     |
| digital-twin                       | src/engine/digital-twin| L2     |
| memory                             | src/engine/memory      | L2     |
| evidence                           | src/engine/evidence    | L2     |
| explainability                     | src/engine/explainability | L2  |
| enforcement                        | src/engine/enforcement | L2     |
| orchestration                      | src/engine/orchestration | L2   |
| experience                         | src/workspace/         | L3     |
| brand                              | src/workspace/brand    | L3     |
| executive-workspace                | src/workspace/         | L3     |
| workspace                          | src/workspace/         | L3     |
| theme                              | src/workspace/theme    | L3     |
| presentation → contracts, mappers  | src/workspace/         | L3     |
| navigation (base hooks)            | src/platform/routing   | L1     |

### src/core/runtime/ → destinos corretos (131 subdirs, Fase 2)

Esta migration requer análise dir-a-dir — ver story arch-restruc-p2-runtime-surgery.

---

## Notas de Compatibilidade

- Manter re-exports temporários durante a migration para não quebrar builds
- Atualizar tsconfig.json paths aliases conforme os dirs são movidos
- ESLint rule de cross-layer deve ser adicionada como `warn` primeiro, depois `error`
- Cada fase termina com `npm run typecheck && npm run lint && npm run build` passando

---

## Histórico

| Data | Versão | Autor | Descrição |
|------|--------|-------|-----------|
| 2026-09-12 | 1.0 | @architect | Estrutura alvo inicial |
