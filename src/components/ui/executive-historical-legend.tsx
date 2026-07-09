import React from 'react';
import { cn } from '@/lib/utils';
import { SemanticPaletteKey, ExecutiveChartSemanticPalette } from '../../adapters/ui/ThemeAdapter';

export interface ExecutiveHistoricalLegendItem {
  label: string;
  colorKey: SemanticPaletteKey;
}

export interface ExecutiveHistoricalLegendProps {
  items: ExecutiveHistoricalLegendItem[];
  className?: string;
}

/**
 * Phase 1: Separated Legend System (Out of Recharts Canvas)
 * @deprecated Use `ExecutiveChartLegend` from ExecutiveChart V2.
 */
export function ExecutiveHistoricalLegend({ items, className }: ExecutiveHistoricalLegendProps) {
  return (
    <div className={cn("flex flex-wrap items-center gap-4 py-2", className)}>
      {items.map((item, index) => (
        <div key={index} className="flex items-center gap-2">
          <div 
            className="w-3 h-3 rounded-sm shrink-0" 
            style={{ backgroundColor: ExecutiveChartSemanticPalette[item.colorKey] }} 
          />
          <span className="text-xs font-medium text-foreground/80 tracking-wide">
            {item.label}
          </span>
        </div>
      ))}
    </div>
  );
}
