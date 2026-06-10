# Illumine Governance™ — Implementation Guide v8.0 (design.md)

## Governing Rule

> **This document is subordinate to `docs/visual-constitution.md`.**
>
> In case of conflict, `docs/visual-constitution.md` always prevails.
>
> This document does **not** define visual rules; it explains **how** to implement them.

---

## 1. Relationship to the Visual Constitution

- **`visual-constitution.md`** – the supreme normative source that defines colors, typography, spacing, shadows, and all visual semantics.
- **`design.md`** – an operational handbook that interprets the Constitution for developers, provides a component catalogue, and offers concrete usage examples.
- **`index.css`** – holds the Design Tokens that implement the Constitution.
- **Canonical Components** – consume the tokens and embody the visual decisions.
- **Pages** – must only compose canonical components; they never define visual styling themselves.

---

## 2. Implementation Architecture

```
visual-constitution.md
    ↓
index.css (Design Tokens)
    ↓
Canonical Components
    ↓
Executive Templates
    ↓
Pages
```

Every layer downstream **inherits** the rules from the layer above. Changing a token in `index.css` automatically propagates through all components and pages.

---

## 3. Canonical Component Catalogue

Below each component you will find:
- **Purpose** – why the component exists.
- **When to use** – appropriate contexts.
- **When not to use** – situations that require a different component.
- **Required props / variants** – minimal API surface.
- **Correct usage example** – JSX that complies with the Constitution.
- **Prohibited usage example** – shows a pattern that must be avoided.

### `ExecutivePageTemplate`
- **Purpose:** Provides the top‑level layout, global spacing, and responsive rhythm for all executive pages.
- **When to use:** Every full‑screen page (dashboard, reports, analysis pages).
- **When not to use:** Modal dialogs, pop‑overs, or isolated widgets.
- **Required props:** `children` (content), optional `title`.
- **Do:**
```tsx
<ExecutivePageTemplate title="Dashboard">
  {/* page composition */}
</ExecutivePageTemplate>
```
- **Don’t:**
```tsx
<div className="p-8 bg-white">…</div>
```

### `PageHeader`
- **Purpose:** Consistent header with optional breadcrumbs and action toolbar.
- **When to use:** At the top of any page using `ExecutivePageTemplate`.
- **Do:**
```tsx
<PageHeader title="Balance Sheet" breadcrumb={["Home", "Finance"]} />
```
- **Don’t:**
```tsx
<h1 className="text-primary">Balance Sheet</h1>
```

### `PageSection`
- **Purpose:** Vertical section divider that enforces spacing and optional background.
- **When to use:** To group related components within a page.
- **Do:**
```tsx
<PageSection>
  <MetricTile title="Liquidity" value="1.37x" />
</PageSection>
```
- **Don’t:**
```tsx
<div className="mt-12">…</div>
```

### `ExecutiveSurface`
- **Purpose:** Base surface providing background, border, radius, and shadow.
- **When to use:** As the root of any visual block when no higher‑level component fits.
- **Do:**
```tsx
<ExecutiveSurface className="p-6">
  {/* content */}
</ExecutiveSurface>
```
- **Don’t:**
```tsx
<div className="bg-white rounded-xl shadow-md p-6">…</div>
```

### `SemanticCard`
- **Purpose:** Grouped information block with semantic variants (`default`, `info`, `success`, `warning`, `critical`).
- **When to use:** Alerts, policy notes, or any block that needs a colored accent.
- **Do:**
```tsx
<SemanticCard variant="warning" title="Atenção Fiduciária">
  Revisar exposição de curto prazo.
</SemanticCard>
```
- **Don’t:**
```tsx
<div className="bg-orange-100 text-orange-700 rounded-xl">…</div>
```

### `MetricTile`
- **Purpose:** Standard KPI display.
- **When to use:** Any numeric metric that requires a label, value, optional badge, and description.
- **Do:**
```tsx
<MetricTile title="Liquidez Corrente" value="1.37x" />
```
- **Don’t:**
```tsx
<div className="bg-white rounded-xl p-6">
  <p className="text-muted-foreground">Liquidez Corrente</p>
  <strong>1.37x</strong>
</div>
```

### `ExecutiveScore`
- **Purpose:** Visual representation of a scored rating (e.g., 1‑5 stars).
- **When to use:** Risk scores, compliance grades.
- **Do:**
```tsx
<ExecutiveScore value={4} max={5} />
```
- **Don’t:**
```tsx
<div className="flex">{"★★★★☆"}</div>
```

### `ExecutiveStat`
- **Purpose:** Compact inline statistic (label + value) for dashboards.
- **Do:**
```tsx
<ExecutiveStat label="Invested Capital" value="$12.4M" />
```
- **Don’t:**
```tsx
<span className="text-sm">Invested Capital: $12.4M</span>
```

### `ExecutiveNarrative`
- **Purpose:** Long‑form analytical prose with controlled width and spacing.
- **Do:**
```tsx
<ExecutiveNarrative title="Parecer Executivo">
  A estrutura patrimonial revela...
</ExecutiveNarrative>
```
- **Don’t:**
```tsx
<p className="text-muted-foreground">A estrutura patrimonial revela...</p>
```

### `ExecutiveCallout`
- **Purpose:** Alerts, warnings, or critical messages.
- **Do:**
```tsx
<ExecutiveCallout variant="critical" title="Risco Elevado">
  Revisar alavancagem.
</ExecutiveCallout>
```
- **Don’t:**
```tsx
<div className="bg-red-100 text-red-700 p-4">Risco Elevado</div>
```

### `ExecutiveTable`
- **Purpose:** Data tables that inherit token‑driven typography, spacing, and accessibility.
- **Do:**
```tsx
<ExecutiveTable columns={cols} data={rows} />
```
- **Don’t:**
```tsx
<table className="bg-white"><tr><td>…</td></tr></table>
```

### `ExecutiveChart`
- **Purpose:** Charts that automatically apply the **Charts Constitution** palette.
- **Do:**
```tsx
<ExecutiveChart data={chartData} type="line" />
```
- **Don’t:**
```tsx
<LineChart data={chartData} />
```

### `StatusBadge`
- **Purpose:** Small semantic indicators (success, warning, critical, insight).
- **Do:**
```tsx
<StatusBadge variant="success" label="Approved" />
```
- **Don’t:**
```tsx
<span className="bg-green-100 text-green-800 px-2 py-1">Approved</span>
```

### `ActionToolbar`
- **Purpose:** Contextual action area (buttons, dropdowns) placed consistently across pages.
- **Do:**
```tsx
<ActionToolbar>
  <Button variant="primary">Export</Button>
  <Button variant="ghost">Refresh</Button>
</ActionToolbar>
```
- **Don’t:**
```tsx
<div className="flex space-x-2">
  <button>Export</button>
  <button>Refresh</button>
</div>
```

---

## 4. Common Composition Patterns

### Executive Dashboard
```tsx
<ExecutivePageTemplate title="Dashboard">
  <PageHeader title="Dashboard" />
  <PageSection>
    <MetricTile title="Liquidity" value="1.37x" />
    <MetricTile title="ROE" value="12%" />
  </PageSection>
  <PageSection>
    <ExecutiveChart data={dashboardChart} />
  </PageSection>
</ExecutivePageTemplate>
```

### Financial Analysis Page
```tsx
<ExecutivePageTemplate title="Balance Sheet">
  <PageHeader title="Balance Sheet" />
  <PageSection>
    <ExecutiveTable columns={bsCols} data={bsRows} />
  </PageSection>
</ExecutivePageTemplate>
```

### Governance Assessment Page
```tsx
<ExecutivePageTemplate title="Governance Assessment">
  <PageHeader title="Governance Assessment" />
  <PageSection>
    <SemanticCard variant="info" title="Compliance Check">
      All policies are up‑to‑date.
    </SemanticCard>
  </PageSection>
  <PageSection>
    <ExecutiveNarrative title="Executive Summary">
      The institution shows strong risk mitigation…
    </ExecutiveNarrative>
  </PageSection>
</ExecutivePageTemplate>
```

### Narrative‑heavy Page
```tsx
<ExecutivePageTemplate title="Strategic Outlook">
  <PageHeader title="Strategic Outlook" />
  <PageSection>
    <ExecutiveNarrative title="Market Trends">
      …
    </ExecutiveNarrative>
  </PageSection>
</ExecutivePageTemplate>
```

### Chart‑heavy Page
```tsx
<ExecutivePageTemplate title="Performance Charts">
  <PageHeader title="Performance Charts" />
  <PageSection>
    <ExecutiveChart data={perfData} type="bar" />
    <ExecutiveChart data={growthData} type="line" />
  </PageSection>
</ExecutivePageTemplate>
```

### Table‑heavy Page
```tsx
<ExecutivePageTemplate title="Data Explorer">
  <PageHeader title="Data Explorer" />
  <PageSection>
    <ExecutiveTable columns={cols} data={rows} />
  </PageSection>
</ExecutivePageTemplate>
```

### Empty State Page
```tsx
<ExecutivePageTemplate title="No Data">
  <PageHeader title="No Data" />
  <PageSection>
    <SemanticCard variant="info" title="Empty State">
      No records available for the selected period.
    </SemanticCard>
  </PageSection>
</ExecutivePageTemplate>
```

---

## 5. Do / Don’t Examples (selected)

### KPI
**Do:**
```tsx
<MetricTile title="Liquidez Corrente" value="1.37x" />
```
**Don’t:**
```tsx
<div className="bg-white rounded-xl p-6">
  <p className="text-muted-foreground">Liquidez Corrente</p>
  <strong>1.37x</strong>
</div>
```

### Narrative
**Do:**
```tsx
<ExecutiveNarrative title="Parecer Executivo">
  A estrutura patrimonial revela…
</ExecutiveNarrative>
```
**Don’t:**
```tsx
<p className="text-muted-foreground">A estrutura patrimonial revela…</p>
```

### Semantic Surface
**Do:**
```tsx
<SemanticCard variant="warning" title="Atenção Fiduciária">
  Revisar exposição de curto prazo.
</SemanticCard>
```
**Don’t:**
```tsx
<div className="bg-orange-100 text-orange-700 rounded-xl">
  Revisar exposição de curto prazo.
</div>
```

---

## 6. Developer Rules

- **Never** recreate canonical components with raw `<div>` structures.
- **Never** hard‑code colors; always use design tokens defined in `visual-constitution.md`.
- **Never** apply `text-muted` to primary content (headings, KPI values, narratives, etc.).
- **Never** build manual KPI cards, badges, or alerts; use `MetricTile`, `StatusBadge`, `ExecutiveCallout` respectively.
- **Never** import chart libraries directly; always wrap data with `ExecutiveChart`.
- **Never** write native `<table>` markup; use `ExecutiveTable`.
- **Never** introduce page‑level visual systems (e.g., custom grid, spacing utilities) that bypass the token hierarchy.

---

## 7. AntiGravity Guidance

AntiGravity will automatically enforce the following during CI/CD and local linting:
- **Canonical component usage** – any deviation triggers **ERROR**.
- **Forbidden local styling** – custom `background`, `border`, `shadow`, or `spacing` classes cause **ERROR**.
- **Hard‑coded HEX colors** – flagged as **ERROR**.
- **Misuse of `text-muted`** – any usage outside the allowed contexts is **ERROR**.
- **Orange overuse** – orange outside the approved contexts results in **ERROR**.
- **Manual KPI / Card / Badge / Table / Chart** – detected and reported as **ERROR**.
- **Component bypass** – rendering visual elements without the canonical component wrapper is **ERROR**.

Developers should run `npm run lint` and `antigravity:audit` locally to catch issues before pushing.

---

## 8. Onboarding Checklist (for new contributors)

1. Read `visual-constitution.md` – understand the visual authority.
2. Review this implementation guide to see *how* to apply the rules.
3. Run `npm run dev` and inspect existing pages to see canonical components in action.
4. Use the component catalogue below as the single source for UI building blocks.
5. Before committing, run `npm run lint && antigravity:audit` to ensure compliance.

---

*Version:* **v8.0** – **Effective Date:** June 2026

*This `design.md` file serves exclusively as the operational manual for the Illumine Governance™ Visual Constitution.*