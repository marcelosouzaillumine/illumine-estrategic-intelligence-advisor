import React from 'react';
import { cn } from '@/lib/utils';
import { ExecutiveText } from './executive-typography';
import { ExecutiveChartSeries } from './executive-chart';
import { getExecutiveSeriesDefinition } from './executive-chart-series-registry';

export interface ExecutiveChartLegendProps {
  series: ExecutiveChartSeries[];
  className?: string;
}

export function ExecutiveChartLegend({ series, className }: ExecutiveChartLegendProps) {
  if (!series || series.length === 0) return null;

  return (
    <div className={cn("flex flex-wrap items-center gap-x-6 gap-y-2", className)}>
      {series.map((s) => {
        const def = getExecutiveSeriesDefinition(s.variant);
        return (
          <div key={s.key} className="flex items-center gap-2">
            <span 
              className="w-3 h-3 rounded-full flex-shrink-0" 
              style={{ backgroundColor: def.color }}
            />
            <ExecutiveText as="span" variant="caption" className="font-medium text-foreground/80">
              {s.label}
            </ExecutiveText>
          </div>
        );
      })}
    </div>
  );
}
