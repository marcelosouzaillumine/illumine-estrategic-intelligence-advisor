/**
 * Executive Historical Visualization Canonical Framework v1.0
 * 
 * Semantic Color Registry
 * 
 * Centralized governance of colors used in all historical and temporal charts across the platform.
 * Modules MUST NOT define custom colors or override these values.
 * Colors are strictly mapped to their fiduciary meanings.
 */

export const ExecutiveChartSemanticPalette = {
  // Balance Sheet
  asset: "var(--chart-asset)",         // Azul institucional
  liability: "var(--chart-liability)", // Cinza executivo
  equity: "var(--chart-equity)",       // Laranja institucional

  // Income Statement (DRE)
  revenue: "var(--chart-revenue)",     // Azul
  profit: "var(--chart-profit)",       // Verde institucional
  expense: "var(--chart-expense)",     // Vermelho/Laranja (opcional dependendo da variação)

  // Cash Flow (DFC)
  cash: "var(--chart-cash)",                     // Azul petróleo
  negativeCash: "var(--chart-negative-flow)",    // Vermelho institucional
  cashBurn: "var(--chart-negative-flow)",        // Vermelho institucional
  operatingCashFlow: "var(--chart-profit)",      // Verde institucional

  // Common Elements
  projection: "var(--chart-projection)", // Tracejado ou tom mais claro
  benchmark: "var(--chart-benchmark)",   // Cinza neutro

  // Ratios & Rates
  margin: "var(--chart-margin)",
  rate: "var(--chart-rate)",

  // Default Palette (Fallbacks)
  primary: "var(--chart-primary)",
  secondary: "var(--chart-secondary)",
  tertiary: "var(--chart-tertiary)",
} as const;

export type SemanticPaletteKey = keyof typeof ExecutiveChartSemanticPalette;
