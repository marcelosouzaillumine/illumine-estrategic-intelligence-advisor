# Illumine Governance Component Decomposition Protocol

## Princípio Fundamental (A Regra de Ouro)

> **"Toda complexidade deve caminhar em direção ao orquestrador ou aos adaptadores (mappers); os componentes de apresentação devem caminhar continuamente em direção à simplicidade."**

Esta regra sintetiza a essência da arquitetura de UI da plataforma. Ela cria uma fronteira clara entre domínio e interface, reduz acoplamento, facilita testes, torna as migrações visuais previsíveis e fornece um modelo escalável de evolução segura.

---

Este documento define a estratégia, as diretrizes e as restrições inegociáveis para a refatoração e migração dos grandes componentes executivos (ex: `BalanceSheetPage.tsx`, `DREPage.tsx`, `DFCPage.tsx`) da plataforma Illumine Governance™.

## Princípio de Ouro (Golden Rule)

> **Nunca combinar refatoração estrutural com refatoração visual na mesma alteração.**

Separar estritamente essas preocupações gera benefícios operacionais claros:
* A decomposição passa a ser mecanicamente mais simples e de risco altamente mitigado.
* A revisão de código (*code review*) e a rastreabilidade ficam muito mais objetivas.
* O impacto de uma eventual regressão é local e facilmente isolado.
* A migração para o *Design System* (Camada Canônica) atua sobre componentes focados e bem delimitados, impedindo falhas em cascata que ocorreriam em arquivos gigantescos.

## Ciclo de Modernização (As 4 Fases)

| Fase | Objetivo | Critério de Sucesso |
| :--- | :--- | :--- |
| **1. Decomposição Estrutural** | Reduzir arquivos monolíticos em componentes locais de responsabilidade única. | Zero mudança funcional ou visual; `typecheck` e `lint` completamente aprovados. |
| **2. Estabilização** | Consolidar interfaces, tipagem estrita e fronteiras entre os componentes recém-extraídos. | Componentes perfeitamente coesos, com `props` explícitas, livres do tipo `any` e sem dependências residuais. |
| **3. Canonicalização** | Migrar os blocos locais gradualmente para os componentes canônicos (`MetricTile`, `SemanticCard`, `ExecutiveChart`, `ExecutiveTable`, etc.). | Adoção madura do *Design System* sem regressões e com controle modular total. |
| **4. Simplificação e Orquestração Final** | Transformar a página principal em um orquestrador declarativo. | Arquivo original contendo mínima complexidade de JSX (poucas centenas de linhas), delegando 100% da responsabilidade de apresentação aos subcomponentes. |
| **5. Consolidação de Adaptadores de Apresentação** | Desacoplar definitivamente contratos de domínio da camada visual. | Nenhuma página acessa objetos complexos de engines diretamente. Toda conversão ocorre via funções puras (`mappers.ts`) gerando `ViewModels` estritos. Mudanças no domínio não quebram a UI. |

---

## Modelo de Responsabilidade em Camadas (Executive Pages)

Para sustentar o objetivo de orquestração declarativa, toda a refatoração deve obedecer à seguinte matriz de responsabilidades:

| Camada | Responsabilidade | O que pode conhecer e importar |
| :--- | :--- | :--- |
| **Página** (`*Page.tsx`) | Orquestrar, buscar dados, montar DTOs de exibição | Hooks, adapters, engines, serviços, contextos e mappers. |
| **Mappers** (`mappers.ts`) | Funções puras que convertem Domain DTOs em ViewModels | Tipos de domínio e `view-models.ts` (sem dependência de React). Onde `i18n` e formatações pesadas ocorrem. |
| **Seções** (`*Section.tsx`) | Organizar blocos visuais relacionados e gerenciar grid | Apenas `props` (ViewModels estritos) preparadas pelo pai/mapper. |
| **Componentes Folha** (`*Card`, `*Toolbar`) | Renderização pura, microinterações (UI) | Strings, números, callbacks simples e ViewModels. |
| **Tipos** (`types.ts`, `view-models.ts`) | Contratos estruturais e contratos de apresentação | Interfaces e *types* somente (sem implementações). |

---

## Regras Operacionais de Props

Durante as microextrações de apresentação, as seguintes regras são inegociáveis para evitar a propagação de dívida técnica:
- **Payloads Mínimos:** Nunca passar objetos gigantes ou relatórios completos se o componente utilizar apenas dois ou três campos específicos.
- **Tipagem Estrita:** É proibido o uso de `any`. Interfaces explícitas (`type` ou `interface`) devem ser declaradas descrevendo estritamente a forma dos dados esperados. Caso o conceito se repita, crie e importe tipos centralizados (ex: `types.ts`).
- **Pré-processamento no Orquestrador/Mapper:** Componentes de apresentação não devem realizar buscas (`find`, `filter`, `map` complexos) sobre estruturas pesadas de domínio quando isso puder ser pré-processado. O orquestrador deve invocar o `mappers.ts` para resolver os dados brutos e enviar objetos purificados (ex: `ViewModel`) diretamente para o filho.
- **Resolução Centralizada de i18n:** Todo texto dinâmico traduzido deve ser resolvido no componente orquestrador (`Page.tsx`) ou no `mappers.ts` e repassado aos filhos folha/seção como `string` pronta para exibição.
- **Lógica Isolada:** Não mover lógica de negócio, transformações complexas ou cálculos pesados para dentro do componente extraído. Ele recebe dados prontos e apenas renderiza, permitindo delegar interações via callbacks primitivos (`onClick`, `onChange`).

---

## Indicadores Objetivos de Sucesso (Métricas de Maturidade)

Uma microextração e consolidação só é considerada 100% finalizada quando cumprir os seguintes critérios na camada de apresentação (Folhas e Seções):
- **0 hooks** (`useLanguage`, `useMemo`, `useContext`, etc.) em componentes folha.
- **0 imports** de engines, serviços, ou adapters de domínio em componentes folha.
- **0 uso de `any`** em novos componentes (tudo tipado via `types.ts` ou `view-models.ts`).
- **100% das transformações de dados** concentradas em orquestradores ou `mappers.ts`.
- **1 responsabilidade por componente**, mantendo cada arquivo focado exclusivamente em uma única função visual.

---

## Protocolo Operacional Padrão (Fase 1)

Ao atuar no desmonte estrutural de qualquer página, todos os desenvolvedores e agentes autônomos devem operar sob o seguinte protocolo cirúrgico de *Loop* restrito:

1. **Escolher:** Identificar e eleger **apenas um bloco** autocontido (iniciar sempre pelos menores e mais simples componentes de apresentação).
2. **Extrair:** Criar o arquivo no diretório apropriado (ex: `src/components/pages/<feature>/`), utilizando estritamente a tipagem necessária. **Restrição máxima:** É expressamente proibido alterar a árvore do JSX nativo, classes de CSS e fluxo lógico originário.
3. **Validar Criação:** Executar rigorosamente `npm run typecheck` para atestar o acoplamento das novas interfaces tipadas.
4. **Integrar:** Substituir o bloco bruto isolado no arquivo monolítico original por uma instância do novo componente extraído.
5. **Validar Integração:** Executar uma nova rodada de `npm run typecheck`.
6. **Polimento:** Executar `npm run lint`.
7. **Homologação:** Validar visualmente/funcionalmente o resultado limpo.
8. **Checkpoint Seguro:** Efetivar a modificação via `git commit`, blindando a alteração iterativa.
9. **Reiniciar:** Apenas após a finalização bem-sucedida do commit, a equipe está autorizada a escolher a próxima extração.

> **Regra de Transição:** O avanço para a Fase 3 (Canonicalização) está bloqueado até que todas as extrações locais e isolamentos estruturais de uma página atinjam plena completude e estabilidade na Fase 2.

---

## Mandatory Rule — Native Architecture for New Executive Pages

### Objective

From this protocol version onward, all newly created Executive Pages must be implemented directly using the decomposed architecture, eliminating the need for future structural refactoring.

Structural decomposition is no longer considered a remediation activity; it is now a mandatory engineering requirement for any new page.

### Native Architecture Standard

Every new Executive Page must be organized using the following structure (or an equivalent modular organization):

```text
<Feature>Page.tsx          ← Declarative Orchestrator
types.ts                   ← Presentation DTOs
view-models.ts             ← UI ViewModels
mappers.ts                 ← Pure Domain → ViewModel transformations
<Feature>Header.tsx
<Feature>Filters.tsx
<Feature>ActionToolbar.tsx
<Feature>SectionA.tsx
<Feature>SectionB.tsx
<Feature>SectionC.tsx
...
```

The page itself must act only as an orchestration layer responsible for:

* retrieving data;
* invoking services or engines;
* resolving internationalization (i18n);
* preparing ViewModels;
* delegating rendering to presentation components.

### Mandatory Rendering Pipeline

Every Executive Page must follow this responsibility chain:

```text
Domain Engine / Service
        ↓
Business Objects / DTOs
        ↓
Page Orchestrator
        ↓
Pure Mapper Functions
        ↓
ViewModels
        ↓
Presentation Components
        ↓
Rendered UI
```

No presentation component may bypass this pipeline.

### Non-Negotiable Engineering Rules

#### 1. Components are Pure Renderers

Leaf presentation components must:
* receive only presentation-ready data;
* contain no business logic;
* contain no domain transformations;
* contain no side effects.

They exist solely to render UI.

#### 2. Internationalization Must Be Resolved Upstream

Hooks or translation services (such as `useLanguage()`, `t`, or `ExecutiveLabelResolver`) must execute only in the orchestrator or mapper layer.

Presentation components must receive already resolved strings.

Example:
```tsx
// Correct
<AssetQualitySection title="Qualidade do Ativo" />

// Avoid
const { t } = useLanguage();
```

#### 3. ViewModels Are the Public Contract of the UI

Presentation components must depend exclusively on ViewModels.
They must never receive raw domain entities or AI/runtime payloads directly.

#### 4. Mapper Functions Must Be Pure

`mappers.ts` functions:
* must be deterministic;
* must not mutate inputs;
* must not access React;
* must not depend on hooks or contexts;
* must transform only input → output.

#### 5. Shared Presentation Types

Reusable presentation contracts shall be centralized in `types.ts`.
Duplicated interfaces across sibling components should be promoted to shared types.

#### 6. No `any`

New code introduced under this protocol must not use `any`.
Interfaces and explicit types are mandatory.

#### 7. Single Responsibility

Each presentation component should represent one cohesive visual responsibility.
Large visual sections should be decomposed into smaller components whenever practical.

#### 8. No Domain Dependencies in Leaf Components

Presentation components must not import:
* services;
* engines;
* repositories;
* runtime contracts;
* business calculations;
* governance logic.

Only presentation types and ViewModels are permitted.

#### 9. Executive Card Alignment Rule

All executive cards, KPI cards, insight cards, advisory cards, and metric surfaces must align their internal content to the top.

**Rationale:**
Executive interfaces often display cards with different text lengths. Vertical centering creates visual instability, weakens scanability, and makes cards appear misaligned. Top alignment preserves hierarchy, readability, and board-level visual discipline.

**Mandatory rules:**
- Card content must use `items-start`, `justify-start`, or equivalent top-aligned structure.
- Avoid `items-center`, `justify-center`, `place-items-center`, or vertical centering inside content cards unless the component is purely iconic or intentionally empty-state.
- KPI cards must render in this order:
  1. Label/title
  2. Main value
  3. Supporting rationale/description
  4. Badge/status/metadata, if applicable
- Descriptions must begin at the same vertical rhythm across sibling cards.
- Cards in the same grid must not depend on vertical centering to appear balanced.
- Empty states may use centered alignment only when they are standalone empty-state components, not mixed with KPI/content cards.

**AntiGravity rule:**
Add a warning when card-like components contain `items-center`, `justify-center`, or `place-items-center` combined with KPI, narrative, or metric content.
Escalate to ERROR if vertical centering appears in canonical executive cards.

### Definition of Done for Every New Executive Page

A page is considered architecturally compliant only if:

* it acts as a declarative orchestrator;
* all rendering is delegated to specialized components;
* ViewModels are produced before rendering;
* translation is resolved before presentation;
* no presentation component imports business logic;
* no presentation component uses hooks solely to transform data;
* no `any` is introduced;
* shared contracts are centralized in `types.ts`;
* transformations are isolated in `mappers.ts`;
* `npm run typecheck` and `npm run lint` complete successfully.

### Institutional Principle

**Every new Executive Page must be born decomposed.**

The structural decomposition protocol validated on `BalanceSheetPage` is now the default construction model for future modules (including DRE, DFC, DLPA, ESGIM, and subsequent Executive Pages), ensuring long-term maintainability, auditability, predictable evolution, and safe adoption of future design-system upgrades.
