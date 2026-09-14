// src/components/adapters/ThemeAdapter.ts
// Adapter visual para encapsular o tema do Core, evitando importações diretas
import { ExecutiveChartSemanticPalette as CorePalette, SemanticPaletteKey as CoreKey } from '../../../../../core/theme/ExecutiveChartSemanticPalette';

export const ExecutiveChartSemanticPalette = CorePalette;
export type SemanticPaletteKey = CoreKey;
