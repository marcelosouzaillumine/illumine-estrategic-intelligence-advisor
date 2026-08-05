import React from 'react';
import { VisualizationComponentProps } from '../../../workspace/types';
import { Clock } from 'lucide-react';

export function ExecutiveTimeline({
  title,
  subtitle,
  series,
  emptyState = 'No timeline events',
}: VisualizationComponentProps) {
  
  if (!series || series.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center w-full h-48 border border-dashed border-border rounded-lg bg-card/50 text-muted-foreground">
        <Clock className="w-8 h-8 mb-2 opacity-50" />
        <span className="text-sm font-medium">{emptyState}</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full h-full p-4">
      {title && <h4 className="text-sm font-semibold text-foreground">{title}</h4>}
      {subtitle && <span className="text-xs text-muted-foreground">{subtitle}</span>}
      
      <div className="flex-1 mt-4 relative bg-card border border-border rounded-md flex items-center justify-center overflow-hidden min-h-[160px] p-4">
        {/* CSS Placeholder Timeline */}
        <div className="absolute left-1/2 top-4 bottom-4 w-0.5 bg-border -translate-x-1/2" />
        
        <div className="flex flex-col gap-6 w-full max-w-sm z-10">
          <div className="flex justify-between items-center w-full">
            <div className="w-5/12 text-right pr-4 text-xs font-medium text-muted-foreground">Q1 2026</div>
            <div className="w-2 h-2 rounded-full bg-primary ring-4 ring-background" />
            <div className="w-5/12 pl-4 text-sm font-semibold">Launch Framework</div>
          </div>
          <div className="flex justify-between items-center w-full">
            <div className="w-5/12 text-right pr-4 text-sm font-semibold">CFO Office Live</div>
            <div className="w-2 h-2 rounded-full bg-blue-500 ring-4 ring-background" />
            <div className="w-5/12 pl-4 text-xs font-medium text-muted-foreground">Q2 2026</div>
          </div>
        </div>
        
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none bg-background/50">
          <span className="text-xs font-semibold uppercase tracking-widest text-primary bg-background/80 px-2 py-1 rounded">Timeline Placeholder</span>
        </div>
      </div>
    </div>
  );
}
