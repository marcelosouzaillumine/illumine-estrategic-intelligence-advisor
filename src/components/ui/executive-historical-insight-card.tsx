import React from 'react';
import { cn } from '@/lib/utils';
import { ExecutiveSurface } from './executive-surface';
import { HistoricalInsightDriver } from '@/core/runtime/executive-consolidation/HistoricalInsightEngine';
import { CheckCircle2, ChevronRight } from 'lucide-react';

export interface ExecutiveHistoricalInsightCardProps {
  narrative: string;
  drivers?: HistoricalInsightDriver[];
  className?: string;
}

/**
 * Phase 4: Executive Narrative Layer & Explainability
 */
export function ExecutiveHistoricalInsightCard({ narrative, drivers, className }: ExecutiveHistoricalInsightCardProps) {
  return (
    <ExecutiveSurface padding="md" radius="md" className={cn("flex flex-col gap-3 bg-surface-high/30 border border-border/50", className)}>
      <div className="flex gap-3">
        <div className="mt-0.5">
          <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
            <CheckCircle2 className="w-4 h-4 text-primary" />
          </div>
        </div>
        <div className="flex-1">
          <h4 className="text-sm font-semibold tracking-tight text-foreground mb-1">
            Síntese Executiva
          </h4>
          <p className="text-sm text-foreground/80 leading-relaxed">
            {narrative}
          </p>
        </div>
      </div>

      {drivers && drivers.length > 0 && (
        <div className="mt-2 pl-9">
          <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
            Fundamentos Analíticos
          </div>
          <ul className="flex flex-col gap-1.5">
            {drivers.map((driver, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <ChevronRight className="w-3.5 h-3.5 text-muted-foreground mt-0.5 shrink-0" />
                <span className="text-sm text-foreground/70">{driver.description}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </ExecutiveSurface>
  );
}
