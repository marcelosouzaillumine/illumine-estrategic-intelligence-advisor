import React from 'react';
import { VisualizationComponentProps } from '../../../workspace/types';
import { BarChart3 } from 'lucide-react';

export function ExecutiveBarChart({
  title,
  subtitle,
  series,
  emptyState = 'No data available',
}: VisualizationComponentProps) {
  
  if (!series || series.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center w-full h-48 border border-dashed border-border rounded-lg bg-card/50 text-muted-foreground">
        <BarChart3 className="w-8 h-8 mb-2 opacity-50" />
        <span className="text-sm font-medium">{emptyState}</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full h-full p-4">
      {title && <h4 className="text-sm font-semibold text-foreground">{title}</h4>}
      {subtitle && <span className="text-xs text-muted-foreground">{subtitle}</span>}
      
      <div className="flex-1 mt-4 relative bg-card border border-border rounded-md flex items-end justify-center overflow-hidden min-h-[160px] p-2 gap-2">
        {/* SVG/CSS Placeholder */}
        <div className="w-8 bg-primary/40 h-1/3 rounded-t-sm" />
        <div className="w-8 bg-primary/60 h-2/3 rounded-t-sm" />
        <div className="w-8 bg-primary/80 h-1/2 rounded-t-sm" />
        <div className="w-8 bg-primary h-full rounded-t-sm" />
        
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <span className="text-xs font-semibold uppercase tracking-widest text-primary bg-background/80 px-2 py-1 rounded">Bar Chart Placeholder</span>
        </div>
      </div>
    </div>
  );
}
