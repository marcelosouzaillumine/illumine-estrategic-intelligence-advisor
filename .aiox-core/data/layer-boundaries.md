# Illumine Layer Boundary Contract
# Versão: 1.0 — Setembro 2026
# Status: NORMATIVO — não alterar sem aprovação do @architect

---

## Modelo de 4 Camadas

A plataforma Illumine é organizada em 4 camadas hierárquicas. Camadas superiores
dependem das inferiores. O inverso é proibido.

```
┌────────────────────────────────────────────────┐
│  L4 · PRODUTO   Illumine Governance            │  muda por sprint
├────────────────────────────────────────────────┤
│  L3 · SHELL     White Label                    │  evolui por versão
├────────────────────────────────────────────────┤
│  L2 · CORE      Motor Cognitivo                │  congelado / versionado
├────────────────────────────────────────────────┤
│  L1 · OS        Illumine OS                    │  imutável / estável
└────────────────────────────────────────────────┘
```

**Regra fundamental:** L4 pode importar L1–L3. L3 pode importar L1–L2.
L2 pode importar L1. L1 não importa de nenhuma camada de produto.

---

## L1 — ILLUMINE OS

### Mandato
Infraestrutura horizontal de plataforma. Não tem conhecimento de domínio de negócio.
Pode ser reutilizado por qualquer produto vertical sem modificação.

### O que pertence aqui
- Multitenancy e isolamento de tenant
- Autenticação e autorização (tokens, sessões, RBAC primitivo)
- Segurança e auditoria de acesso
- Event bus / mensageria
- Observabilidade (logging, tracing, métricas)
- Runtime engine (binding, container IoC)
- Internacionalização e localização
- Roteamento (infra, não lógica de produto)
- Cache e performance
- Ferramental do desenvolvedor: CLI, linter, compiler, LSP, eslint-plugin
- Modelo comercial SaaS da Illumine: billing, subscription, entitlement, licensing
- Infraestrutura de dados: adapters Firebase, Supabase, connection pooling

### O que NÃO pertence aqui
- Qualquer entidade de negócio (DRE, BP, decisão, insight, recommendation)
- Lógica cognitiva ou de raciocínio
- Configuração de workspace ou experiência executiva
- Qualquer referência a vertical financeiro ou de governança

### Paths de destino (target)
```
packages/os/
  auth/
  tenant/
  security/
  events/
  observability/
  runtime/
  i18n/
  cache/
  cli/
  tooling/
  commercial/        ← billing, subscription, entitlement, licensing
  infrastructure/    ← firebase, supabase adapters

src/platform/        ← mirrors packages/os para o frontend app
  auth/
  security/
  tenant/
  observability/
  routing/
  i18n/
```

### Regras de import
- PODE importar: nada de camadas superiores
- BLOQUEADO: qualquer import de `packages/core`, `packages/shell`, `packages/product`
- BLOQUEADO: qualquer import de domínio financeiro ou cognitivo

---

## L2 — CORE (Motor Cognitivo)

### Mandato
Motor cognitivo agnóstico de vertical. Processa evidências, raciocina sobre domínio,
aprende com decisões — sem saber que domínio é esse.
A mesma engine serve DRE, supply chain, RH, ou qualquer outro vertical.

### O que pertence aqui
- Semantic Model: ontologia, taxonomia, vocabulário, dimensões
- Knowledge Graph: causal model, inference engine, ontology management
- Executive Contracts: contratos canônicos de DDD (interfaces agnósticas)
- Cognitive Pipeline: Fact → Evidence → Inference → Finding → Recommendation → Resolution → Action → Learning
- Decision Engine: deliberação, forensics, trust governance
- Learning Loop: observation, assessment, comparison, evolution
- Digital Twin (modelo abstrato)
- Agent Runtime: lifecycle de agentes cognitivos
- Semantic Execution Engine (SEE)
- Institutional Memory (modelo abstrato)
- Executive Domain primitivos: aggregates, projectors, value objects

### O que NÃO pertence aqui
- Qualquer lógica específica de DRE, BP, DFC, DLPA
- Configuração de workspace ou experiência visual
- Regras de negócio do produto Illumine Governance
- Integrações com Firebase/Supabase (isso é L1)

### Paths de destino (target)
```
packages/core/
  semantic-model/
  knowledge-graph/
  executive-contracts/
  executive-domain/
  cognitive-pipeline/
  decision-engine/
  learning-loop/
  digital-twin/
  agent-runtime/
  see/               ← Semantic Execution Engine
  institutional-memory/

src/engine/          ← mirrors packages/core para o frontend app
  intelligence/
  governance/
  knowledge/
  constitution/
  contracts/
  temporal/
```

### Regras de import
- PODE importar: `packages/os` / `src/platform`
- BLOQUEADO: qualquer import de `packages/shell`, `packages/product`
- BLOQUEADO: qualquer import de componente visual ou de workspace

---

## L3 — SHELL (White Label)

### Mandato
Shell de produto configurável. Define a experiência executiva, o visual, a distribuição
e a arquitetura de workspaces — sem encoding de nenhum domínio financeiro específico.
Um parceiro pode usar o shell com um produto completamente diferente.

### O que pertence aqui
- Executive Workspace: layout, surfaces, command palette, navigation
- Narrative Rendering: parser, components, templates
- Brand e theming: color, typography, logo, dark/light mode
- Partner Ecosystem: white-label config, distribution, partner onboarding
- Advisory Workflow Orchestration (agnostic): trigger engine, workflow engine
- Experience Composer: como compor experiências para diferentes perfis executivos
- Workspace Orchestrator: gerencia o workspace em runtime
- Architecture Governance Tooling: meta-tooling da arquitetura (pertence ao tooling, não ao produto)
- Platform Distribution: SaaS, multi-tenant, partner channels

### O que NÃO pertence aqui
- DRE, BP, DFC, DLPA engines
- Regras de negócio de governança financeira
- Qualquer entidade específica do produto Illumine

### Paths de destino (target)
```
packages/shell/
  workspace/
  narrative/
  brand/
  partner/
  advisory/
  experience/
  distribution/
  tooling/           ← architecture-governance-* vai aqui

src/workspace/       ← já existe, expandir
  capabilities/      ← ceo, cfo, coo, commercial, people, risk
  surfaces/
  patterns/
  actions/

src/components/executive-workspace/   ← já existe
```

### Regras de import
- PODE importar: `packages/os`, `packages/core` / `src/platform`, `src/engine`
- BLOQUEADO: qualquer import direto de `packages/product` ou `src/capabilities/financial`
- PODE receber capabilities de produto via interface/contrato de L2

---

## L4 — PRODUTO (Illumine Governance)

### Mandato
O produto vertical de governança financeira para PMEs e corporações brasileiras.
Implementa as capabilities específicas do Illumine: DRE, BP, DFC, DLPA, diagnóstico
causal, advisory financeiro, board pack, benchmarking, simulação de cenários, mentorship.

### O que pertence aqui
- Financial Runtimes: DRE, BP (Balanço Patrimonial), DFC, DLPA
- Causal Intelligence: análise causal financeira, sinais, evidências
- Executive Advisory Engine: advisory específico do Illumine
- Board Pack: geração de pacotes para conselho
- Benchmarking Intelligence: comparação com mercado
- Scenario Simulation: simulação de cenários financeiros
- Mentorship: programa de mentoria executiva
- Financial Scoring: score de saúde financeira
- Signal Intelligence: sinais de alerta e oportunidade
- Maturity Index: índice de maturidade empresarial
- Operational Intelligence: métricas operacionais do produto

### O que NÃO pertence aqui
- Infraestrutura de plataforma (auth, tenant, events)
- Motor cognitivo agnóstico (learning loop, decision engine)
- Shell de workspace (theme, brand, partner)

### Paths de destino (target)
```
packages/product/
  financial/
    dre/
    bp/
    dfc/
    dlpa/
    causal/
    scoring/
    signals/
  advisory/
  board/
  benchmarking/
  simulation/
  mentorship/
  maturity/

src/capabilities/    ← já existe, expandir e consolidar
  financial/
  mentorship/
  executive-advisory/
  assessment-monitoring/
```

### Regras de import
- PODE importar: todas as camadas inferiores (L1, L2, L3)
- BLOQUEADO: nada pode importar de volta para L4 (L1, L2, L3 não conhecem L4)

---

## Matriz de Dependências Permitidas

| Camada    | Pode importar de    | Não pode importar de  |
|-----------|--------------------|-----------------------|
| L1 OS     | (nenhuma)          | L2, L3, L4            |
| L2 Core   | L1                 | L3, L4                |
| L3 Shell  | L1, L2             | L4                    |
| L4 Produto| L1, L2, L3         | (nenhuma restrição)   |

---

## Casos Ambíguos Resolvidos

| Entidade | Decisão | Justificativa |
|----------|---------|---------------|
| billing / subscription / entitlement | L1 OS | São o modelo comercial da Illumine como empresa SaaS, não domínio do produto |
| architecture-governance-* (17 pkgs) | L1 OS → tooling/ | Meta-tooling da arquitetura, não features do produto |
| company-operating-system / customer-operating-system | L4 Produto | Features do produto nomeadas como "OS" por convenção interna |
| institutional-memory (canônico) | L2 Core | Modelo abstrato de memória organizacional |
| executive-advisory-engine | L4 Produto | Advisory específico do Illumine, não genérico |
| executive-workspace-orchestrator | L3 Shell | Orquestrador de workspace, não motor cognitivo |
| executive-cognitive-runtime | L2 Core | Primitivo de runtime cognitivo agnóstico |
| packages/application/revenue | L1 OS | Infraestrutura de receita SaaS (billing pipeline, sagas) |

---

## Enforcement

### ESLint (a implementar na Fase 3)
Uma regra custom `@illumine/no-cross-layer-import` deve bloquear em CI:
- imports de `@illumine/core/*` dentro de `@illumine/os/*`
- imports de `@illumine/shell/*` dentro de `@illumine/core/*`
- imports de `@illumine/product/*` dentro de qualquer camada inferior

### Validação manual (imediata)
Antes de mover qualquer arquivo, verificar o grafo de dependências com:
```bash
npx madge --circular src/
npx madge --image deps.svg src/core/
```

---

## Histórico

| Data | Versão | Autor | Descrição |
|------|--------|-------|-----------|
| 2026-09-12 | 1.0 | @architect | Criação inicial — engenharia reversa do codebase |
