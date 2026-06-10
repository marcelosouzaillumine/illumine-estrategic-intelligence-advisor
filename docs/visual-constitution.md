# Illumine Governance™ OS — Visual Constitution

## 1. Fundamental Principle
**Pages must not define visual identity. Pages are responsible only for composition.**

Visual identity must originate exclusively from:
1. Design Tokens (`index.css`)
2. Canonical Components
3. Executive Templates

No component or page may define fixed colors, typography, or spacing when a corresponding token exists. All components must inherit from these primitives.

## 2. Visual Authority Hierarchy
```
Design Tokens (index.css)
      │
      ▼
Canonical Components (ExecutiveSurface, MetricTile, SemanticCard)
      │
      ▼
Executive Templates (ExecutivePageTemplate)
      │
      ▼
Pages (DashboardPage, DFCPage, etc.)
```

## 3. Design Tokens

### 3.1 Official Palette
The platform uses a semantic palette defined in `index.css`.
- **Primary / Executive**: `--color-primary` (`#0E1C2C`)
- **Accent / Secondary**: `--color-accent` (`#FF8552`)
- **Insight / Tertiary**: `--color-insight` (`#BAB86C`)
- **Success**: `--color-success` (`#0C7A3A`)
- **Warning**: `--color-warning` (`#C8A94A`)
- **Critical**: `--color-critical` (`#D01D1C`)
- **Neutral / Muted**: `--color-muted-foreground` (`#6B7280`)

### 3.2 Typography Hierarchy
- **h1**: `clamp(32px, 5.5vw, 68px)`
- **h2**: `clamp(26px, 4vw, 44px)`
- **h3**: `clamp(20px, 3vw, 32px)`
- **h4**: `clamp(16px, 2.5vw, 24px)`
- **Body Large**: `clamp(16px, 1.5vw, 20px)`
- **Body Medium**: `clamp(14px, 1.2vw, 17px)`
- **Body Small**: `clamp(12px, 1vw, 15px)`

### 3.3 Spacing Rules
- `--spacing-xs`: `0.35em`
- `--spacing-sm`: `0.5rem`
- `--spacing-md`: `0.625em`
- `--spacing-lg`: `0.75em`
- `--spacing-xl`: `1em`

### 3.4 Border Radii
- `--radius-sm`: `12px`
- `--radius-md`: `24px`
- `--radius-lg`: `32px`
- `--radius-xl`: `48px`
- `--radius-button`: `12px`
- `--radius-card`: `32px`

### 3.5 Shadows & Visual Depth
Quiet Luxury shadows:
- `--shadow-xs`: `0 1px 2px rgba(14, 28, 44, 0.04)`
- `--shadow-sm`: `0 2px 8px rgba(14, 28, 44, 0.06)`
- `--shadow-md`: `0 8px 16px rgba(14, 28, 44, 0.08)`
- `--shadow-lg`: `0 12px 32px rgba(14, 28, 44, 0.10)`

## 4. Component Catalogue & Mandatory Rules
- **`ExecutiveSurface`**: The common base for all cards and panels.
- **`MetricTile`**: Must be used for ALL KPIs. Supports optional click navigation, trend indicators, tooltips, and loading/empty states.
- **`SemanticCard`**: Extends `ExecutiveSurface`. Used for semantic groupings (default, info, insight, success, warning, critical).
- **`ExecutiveChart`**: Controls all chart rendering. Controls palette, typography, tooltips, grids, and accessibility.
- **`ExecutiveNarrative`**: Must be used for all analytical prose.
- **`ExecutiveTable`**: Standardized data tables.
- **`ExecutiveStat`**: Inline statistics.
- **`ActionToolbar`**: Contextual executive actions.
- **`ExecutiveCallout`**: Compact layout for institutional notes, extends `ExecutiveSurface`.

## 5. Prohibited Patterns
- 🚫 **Manual KPIs**: Using `div` with custom classes instead of `MetricTile`.
- 🚫 **Manual Surfaces**: Using colored `div` blocks instead of `SemanticCard` or `ExecutiveSurface`.
- 🚫 **Manual Tables**: Using native `<table>` without `ExecutiveTable` wrapper.
- 🚫 **Manual Charts**: Rendering Recharts (`ResponsiveContainer`, etc) or Chart.js without using `ExecutiveChart`.
- 🚫 **Excessive Tailwind**: Using arbitrary Tailwind colors or spacing when a semantic canonical component exists.
- 🚫 **Overriding Canonical Components**: Passing `className` that overrides typography (`text-*`), backgrounds (`bg-*`), or borders (`border-*`) on Canonical Components.
- 🚫 **Page Styling**: Pages defining background colors, border radii, or typographic hierarchies.

## 6. Component Reusability Rule
**Any new reusable UI component MUST be born as a canonical component before being consumed by two or more pages.**
This explicitly forbids the creation of localized "wrapper components" duplicated across directories. If it's used in multiple places, it belongs in the Canonical Design System.

## 7. AntiGravity™ Enforcement Policies
The AntiGravity™ Architectural Enforcer actively scans and rejects code violating this constitution. It ensures strict compliance with canonical usage through AST analysis.

### Enforced AST Rules:
- Detects any `div` replicating visually `MetricTile` or `SemanticCard` (e.g., `div` with `className` containing `bg-card` + `border` + `shadow` or `p-*`).
- Identifies direct use of `ResponsiveContainer` or `recharts` chart configurations directly in pages instead of `ExecutiveChart`.
- Blocks `className` overriding typography (`text-*`), backgrounds (`bg-*`), or borders (`border-*`) on canonical components.
- Verifies that every top-level page uses `ExecutivePageTemplate` or `PageHeader`.
- Emits a compliance report by module.
