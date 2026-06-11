import React from 'react';
import { cn } from '@/lib/utils';
import { ExecutiveSurface } from './executive-surface';

export interface ExecutiveAnalyticalHighlightItemProps {
  label: string;
  value: React.ReactNode;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  className?: string;
}

export function ExecutiveAnalyticalHighlightItem({ label, value, trend, trendValue, className }: ExecutiveAnalyticalHighlightItemProps) {
  return (
    <div className={cn("flex flex-col gap-1 p-3 rounded-lg bg-surface-high/50 border border-border/40", className)}>
      <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{label}</span>
      <div className="flex items-end gap-2">
        <span className="text-lg font-display font-semibold text-foreground tracking-tight">{value}</span>
        {trendValue && (
          <span className={cn(
            "text-xs font-medium mb-1",
            trend === 'up' ? "text-success" : trend === 'down' ? "text-critical" : "text-muted-foreground"
          )}>
            {trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→'} {trendValue}
          </span>
        )}
      </div>
    </div>
  );
}

export interface ExecutiveAnalyticalHighlightsCardProps {
  title?: string;
  items: React.ReactElement<ExecutiveAnalyticalHighlightItemProps>[];
  className?: string;
}

/**
 * Phase 5 & 7: Standardized Analytical Highlights
 * Dynamically adjusts grid columns based on the number of insights.
 */
export function ExecutiveAnalyticalHighlightsCard({ title = "Destaques Analíticos", items, className }: ExecutiveAnalyticalHighlightsCardProps) {
  if (!items || items.length === 0) return null;

  // Adaptive height/grid based on insight density
  const gridCols = items.length === 1 ? 'grid-cols-1' :
                   items.length === 2 ? 'grid-cols-2' :
                   items.length === 3 ? 'grid-cols-3' :
                   'grid-cols-2 md:grid-cols-4';

  return (
    <ExecutiveSurface padding="md" radius="md" className={cn("flex flex-col gap-3", className)}>
      <h4 className="text-sm font-semibold tracking-tight text-foreground">{title}</h4>
      <div className={cn("grid gap-3", gridCols)}>
        {items}
      </div>
    </ExecutiveSurface>
  );
}

export function ExecutiveExecutiveInsightPanel({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("flex flex-col gap-4", className)}>
      {children}
    </div>
  );
}
