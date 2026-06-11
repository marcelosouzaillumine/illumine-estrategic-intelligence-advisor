# Illumine Governance™ — Visual Constitution Rewrite v8.0

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
- **Primary:** `#0E1C2C`
- **Accent (Orange):** `#FF8552`

**Orange Usage Rules** (must be **ERROR** if violated):
- Allowed only for **branding**, **strategic CTAs**, **small institutional accents**, and **optional sidebar group headings**.
- **Prohibited** as default navigation color, KPI coloring, page titles, icons, or narrative text.

---

## 4. Typography Constitution

### text‑primary (allowed)
- H1, H2, H3
- Card titles
- KPI values, executive metrics
- Active navigation items

### text‑secondary (allowed)
- Executive narratives
- Analytical paragraphs
- Descriptions, recommendations, supporting text

### text‑muted (STRICTLY LIMITED – **ERROR** if misused)
**Allowed contexts:**
- Timestamps
- Placeholders
- Breadcrumbs
- Helper text
- Captions
- Metadata
- Disabled information

**Forbidden contexts:**
- Page titles (H1‑H3)
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

Standard palette:
- **Primary series** – institutional blue (`#0E1C2C`)
- **Secondary series** – neutral gray (`#6B7280`)
- **Success** – green (`#0C7A3A`)
- **Warning** – amber (`#B7791F`)
- **Critical** – red (`#B91C1C`)

- **Multicolor decorative palettes are prohibited.**

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

- Hard‑coded HEX colors
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
