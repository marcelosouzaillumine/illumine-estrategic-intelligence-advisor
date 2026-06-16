# Illumine Governance™ — Visual Constitution & Design Principles

## Executive Typography Registry
Todos os componentes de caráter executivo devem utilizar estritamente a hierarquia tipográfica canônica definida em `executive-typography.tsx`. 
- É proibida a invenção de hierarquia tipográfica local.
- É estritamente proibido o uso de classes genéricas como `text-muted`, `text-secondary`, `opacity-*`, `text-gray-*`, ou `text-slate-*`.
- Utilize exclusivamente: `text-executive-primary`, `text-executive-secondary`, `text-executive-muted`.

## Executive Section Header Constitution
Toda seção executiva principal deve ser ancorada obrigatoriamente por um `ExecutiveSectionHeader` (ou internamente em seu Hero). 
- O título da seção nunca deve desaparecer.
- Subtítulos devem ser legíveis, com contraste premium, sem uso de laranja/aviso a menos que seja intencional para status crítico.

## Executive Decision Workspace Contract & Presentation Data Validity
A UI deve apenas renderizar. A tradução determinística (ex: de `MONITORING` para `MONITORAMENTO`) e sanitização de placeholders devem ocorrer unicamente no Adapter/Runtime, protegendo os componentes React de carregarem lógicas de negócio ou strings cruas/incompletas.

---

## Objective

Completely rewrite `docs/visual-constitution.md` to become the single normative authority governing the visual identity of the Illumine Governance™ platform. This document supersedes all previous fragmented visual rules from earlier sprints. After this phase, no other document may define colors, typography, spacing, or visual semantics independently.

---

## Architectural Principle

The visual architecture follows an immutable hierarchy:

```
Visual Constitution
    ↓
Design Tokens (index.css)
    ↓
Canonical Components
    ↓
Templates
    ↓
Pages
```

- **Pages never define design.** They compose canonical components.
- **Canonical Components** consume design tokens.
- **Design Tokens** implement the Constitution.

---

## 1. Philosophy

The Illumine visual philosophy embodies:

- **Executive Operating System** – a unified, enterprise‑grade UI.
- **Quiet Luxury** – restrained elegance, premium feel.
- **Institutional Authority** – confidence through consistency.
- **Clarity over Decoration** – functional aesthetics dominate.
- **Trust through Restraint** – minimal visual noise.
- **Typography over Color** – hierarchy expressed primarily via type.
- **Composition over Ornamentation** – layout and spacing drive meaning.

---

## 2. Governance Model

- This document is the **supreme visual authority**.
- `design.md` is a **subordinate implementation guide** and component catalogue.
- `index.css` implements **Design Tokens** as prescribed herein.
- **Canonical Components** enforce presentation rules.
- **Pages** must never define visual identity.

> **Conflict Resolution:** In any conflict, *visual‑constitution.md* prevails.

---

## 3. Color Constitution

### Neutral Surfaces
| Role | Token | Hex |
|------|-------|-----|
| Background | `--color-background` | `#FAFBFC` |
| Surface | `--color-surface` | `#F8FAFC` |
| Card | `--color-card` | `#FFFFFF` |
| Border | `--color-border` | `#E2E8F0` |

  - **Target distribution:** ~90% neutral surfaces, ~8% structural surfaces, ~2% semantic colors.
  
  ### Institutional Colors
  - **Primary:** `#0E1C2C` (`var(--color-primary)`)
  - **Accent (Orange):** `#FF8552` (`var(--color-accent)`)
  
  **Orange Usage Rules** (must be **ERROR** if violated):
  - Allowed only for **branding**, **strategic CTAs**, **small institutional accents**, and **optional sidebar group headings**.
  - **Prohibited** as default navigation color, KPI coloring, page titles, icons, or narrative text.

  ### Semantic State Colors
  Must be used via their dedicated `state-*` namespace to avoid conflicts with institutional and executive colors:
  - **Excellent:** `var(--color-state-excellent)`
  - **Healthy:** `var(--color-state-healthy)`
  - **Warning:** `var(--color-state-warning)`
  - **Critical:** `var(--color-state-critical)`
  - **Neutral:** `var(--color-state-neutral)`
  - **Insufficient:** `var(--color-state-insufficient)`

---

## 4. Typography Constitution

### Semantic Mapping

A hierarquia visual executiva deve seguir obrigatoriamente a sequência semântica abaixo. Qualquer implementação fora desta sequência será considerada arquitetonicamente não conforme, mesmo que renderize corretamente.

- **`text-primary` / `text-executive-primary`**: Títulos (H1/H2/H3), KPIs, scores, valores críticos, títulos de cards e active navigation items.
- **`text-executive-secondary`**: Subtítulos executivos, resumos institucionais, descrições, narrativas, paragraphs analíticos e conclusões (opacidade integral exigida).
- **`text-executive-muted` / `text-muted` / `text-muted-foreground`**: Metadados auxiliares, timestamps, placeholders, dicas de UI, breadcrumbs, captions e rodapés de baixa prioridade.

> **ATENÇÃO:** O token `text-secondary` representa **cor secundária de marca (accent/laranja)** e NÃO DEVE SER UTILIZADO para textos narrativos, descrições institucionais ou subtítulos.

---

### 4.1 Executive Subtitle Constitution (Sovereignty Amendment v1.0)

Os subtítulos executivos representam o segundo nível de comunicação institucional da plataforma e têm como função contextualizar uma página, seção ou bloco analítico antes da apresentação de indicadores, narrativas ou recomendações.

#### Definição
São considerados subtítulos executivos textos como:
* Introduções de páginas;
* Descrições logo abaixo de H1, H2 ou H3;
* Contextualizações de módulos;
* Sínteses institucionais de uma seção;
* Explicações curtas posicionadas antes de KPIs ou análises.
* Exemplo: *“Análise da posição financeira, estrutura patrimonial e capacidade de sustentação operacional da organização.”*

#### Regras Obrigatórias (Cor)
Todos os subtítulos executivos, resumos e narrativas devem utilizar exclusivamente:
* `text-executive-secondary`

É expressamente **PROIBIDO** utilizar:
* `text-secondary` (Cor de marca/accent)
* `text-muted`
* `text-muted-foreground`
* `text-gray-*`
* `text-slate-*`
* `text-zinc-*`
* `opacity-*`
* `text-foreground/70`, `text-foreground/80`, ou qualquer redução artificial de contraste.

> **Princípio do Contraste Absoluto:** Subtítulos e narrativas devem permanecer com 100% de opacidade e atender aos critérios mínimos de acessibilidade WCAG AA em ambos os temas (light/dark).

#### Hierarquia Tipográfica
Os subtítulos devem possuir menor destaque que o título principal, porém manter excelente legibilidade.
Referência recomendada:
* `text-base` ou `text-lg`
* `font-normal` ou `font-medium`
* `leading-relaxed`
*(Nunca utilizar font-light ou pesos excessivamente finos).*

#### Comprimento
Sempre que possível:
* Limitar entre 1 e 3 linhas;
* Evitar blocos longos de texto;
* Privilegiar frases claras e objetivas.

#### Aplicação Transversal
Esta regra aplica-se obrigatoriamente a todos os componentes canônicos e executivos, incluindo, mas não se limitando a: `PageHeader`, `ExecutivePageTemplate`, `PageSection`, `ExecutiveNarrative`, `ExecutiveHealthSummaryCard`, `ExecutiveMetricCard`, `ExecutiveSurface`, `SemanticCard`, `ExecutiveCallout`, `ExecutiveChart`, `ExecutiveTable`, `StatusBadge`, e todas as páginas de módulos operacionais (BP, DRE, DLPA, DFC, ESGIM™, Board Pack, Workspace Executivo).

Nenhum componente poderá definir localmente estilos divergentes para subtítulos.

---

### 4.2 Muted Text Constitution (STRICTLY LIMITED – **ERROR** if misused)

**Allowed contexts (Metadados):**
- Timestamps
- Placeholders
- Breadcrumbs
- Helper text
- Captions
- Metadata e metadados auxiliares
- Disabled information

**Forbidden contexts:**
- Page titles (H1‑H3) e subtítulos de página
- KPI values
- Executive narratives, conclusions, board recommendations, strategic insights

---

## 5. Sidebar Constitution

- **Group Headings:** compact, uppercase, subtle; may optionally use orange.
- **Navigation Items:**
  - Inactive – `text-secondary`
  - Hover – `text-primary`
  - Active – `text-primary` + `semibold` + subtle neutral background.
- **Orange navigation items are prohibited.**

---

## 6. Card Constitution

Cards communicate hierarchy via **spacing**, **typography**, **composition**, **subtle borders**, and **restrained shadows**. Avoid colorful backgrounds.

- **Default Card:** white background, soft border, minimal shadow.
- **Surface Usage:** `bg-card` for most panels; `bg-surface` only for structural groupings.

### 6.1 Executive Card Alignment Rule

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

---

## 7. KPI Constitution

Structure:
1. **Label** – `text-secondary`
2. **Primary Value** – `text-primary`, `semibold`, `tabular-nums`
3. **Optional Badge** – semantic color accent
4. **Description** – `text-secondary`

- **Muted KPI values are prohibited.**

---

## 8. Executive Narrative Constitution

Long‑form executive analysis must use the `ExecutiveNarrative` component with:
- Readable width
- Generous vertical spacing
- Primary headings (`text-primary`)
- Secondary body text (`text-secondary`)
- Editorial appearance

---

## 9. Charts Constitution

Universal Chart Palette (Canonical):
- **Positive** – verde (crescimento, lucro, geração de caixa): `var(--chart-positive)`
- **Negative** – vermelho (queda, perda, consumo de caixa, risco): `var(--chart-negative)`
- **Primary** – azul (série principal, ativo, receita, base comparativa): `var(--chart-primary)`
- **Secondary** – cor secundária: `var(--chart-secondary)`
- **Warning** – laranja/amarelo (atenção, alerta, variação relevante): `var(--chart-warning)`
- **Neutral** – cinza (neutro, histórico, benchmark, referência): `var(--chart-neutral)`
- **Benchmark** – referência externa: `var(--chart-benchmark)`

**Proibições para Gráficos:**
- Nenhum HEX hardcoded em `.tsx` ou estilos inline.
- Nenhuma cor inline solta.
- Nenhuma tentativa de forçar gráficos à paleta institucional Illumine se isso prejudicar a leitura analítica (utilizar apenas `--chart-*`).

---

## 10. Tables Constitution

- Consistent spacing and padding
- Typographic hierarchy matching design tokens
- Header styling with uppercase, tracking, and subtle background
- Numeric alignment using `tabular-nums`
- Full accessibility (ARIA labels, keyboard navigation)

---

## 11. Canonical Components

| Component | Responsibility |
|-----------|----------------|
| `ExecutivePageTemplate` | Top‑level page layout, spacing, responsive rhythm |
| `ExecutiveSurface` | Base surface: background, border, radius, shadow |
| `SemanticCard` | Grouped information blocks, semantic variants |
| `MetricTile` | KPI display, values, labels, badges |
| `ExecutiveScore` | Scored visualizations, rating displays |
| `ExecutiveStat` | Compact inline statistics |
| `ExecutiveNarrative` | Long‑form analytical prose |
| `ExecutiveTable` | Data tables with token‑driven styling |
| `ExecutiveChart` | Charts following the chart palette |
| `ExecutiveCallout` | Alerts, warnings, critical messages |
| `StatusBadge` | Semantic status indicators |
| `ActionToolbar` | Contextual actions, toolbars |
| `PageHeader` | Consistent page headers, breadcrumbs |
| `PageSection` | Structured vertical sections within pages |

Pages must **compose** these components and **must not** implement local visual structures.

---

## 12. Forbidden Patterns

- Hard‑coded HEX colors (e.g., `#B91C1C`) in TSX components, inline styles (e.g., `style={{ color: '#0E1C2C' }}`), or CSS files outside `index.css`.
- Dynamic colors in charts must strictly use CSS variables (e.g., `stroke="var(--color-state-critical)"`).
- Manual KPI cards or surfaces
- Local shadows, gradients, spacing, or typography overrides
- Direct use of `text-muted` in executive content
- Visual overrides that bypass canonical components

Violations are treated as **ERROR** by AntiGravity.

---

## 13. AntiGravity Enforcement

AntiGravity functions as an architectural auditor, validating:
- Design Tokens conformity
- Canonical Component usage
- Typography hierarchy
- Color semantics and orange restrictions
- Navigation rules
- Card composition
- KPI implementation
- Executive narratives
- Chart and table standards

Any breach triggers an **ERROR**.

---

## 14. Compliance Principle

Any implementation that violates this Constitution is **architecturally non‑compliant**, even if it renders correctly. All CI/CD pipelines must enforce compliance before merge.

---

*Version:* **v8.0** – **Effective Date:** June 2026

*This document is the definitive source of visual truth for the Illumine Governance™ platform.*

## Executive Execution Plan Constitution

- O termo **"Roadmap"** deve ser substituído por **Plano de Execução Prioritário** apenas no contexto de recomendações executivas. Para projetos/cronogramas de produto genéricos, o termo pode ser usado.
- A taxonomia canônica passa a ser:
  - Título/Hero: **Plano Executivo Recomendado**.
  - Sequência de ações: **Plano de Execução Prioritário**.
- O espaço acima do plano deve comunicar decisão, contexto e racional estratégico.
- Grandes áreas vazias são proibidas. Cards com mais de 35% de área vazia não são permitidos.
- "Executive Scan Rule": O executivo deve compreender em menos de 5 segundos:
  1. Qual é a prioridade.
  2. O que precisa ser feito.
  3. Por que isso deve ser feito.
  4. Qual o grau de confiança.
  5. Como executar.
- **Regra de Conteúdo**: Toda etapa do Plano de Execução Prioritário deve representar uma ação executiva concreta, com horizonte temporal, área responsável e justificativa estratégica. São proibidas etapas genéricas ou decorativas que não agreguem suporte à decisão.
- Nenhuma página da plataforma poderá implementar manualmente layouts de planos executivos. O ExecutiveDecisionSummary e o ExecutiveExecutionPlan passam a ser os únicos componentes autorizados para representar estratégias, recomendações e roteiros de execução. Reutilização obrigatória nos módulos BP, DRE, DFC, DLPA, EFOS, ESGIM™, Advisory, Board Pack, e Executive Scenario Lab.
