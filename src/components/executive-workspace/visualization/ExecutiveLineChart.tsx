import React from 'react';
import { VisualizationComponentProps } from '../../../workspace/types';
import { LineChart, AlertCircle } from 'lucide-react';

export function ExecutiveLineChart({
  title,
  subtitle,
  series,
  emptyState = 'No data available',
  loadingState = 'Loading chart...',
  errorState = 'Error loading chart',
}: VisualizationComponentProps) {
  
  // Real implementation will map series to a charting library.
  // For Wave 17B, this is a placeholder/wrapper.
  
  if (!series || series.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center w-full h-48 border border-dashed border-border rounded-lg bg-card/50 text-muted-foreground">
        <LineChart className="w-8 h-8 mb-2 opacity-50" />
        <span className="text-sm font-medium">{emptyState}</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full h-full p-4">
      {title && <h4 className="text-sm font-semibold text-foreground">{title}</h4>}
      {subtitle && <span className="text-xs text-muted-foreground">{subtitle}</span>}
      
      <div className="flex-1 mt-4 relative bg-card border border-border rounded-md flex items-center justify-center overflow-hidden min-h-[160px]">
        {/* SVG Placeholder */}
        <svg className="w-full h-full opacity-20" viewBox="0 0 100 50" preserveAspectRatio="none">
          <path d="M0,40 Q10,30 20,40 T40,20 T60,30 T80,10 T100,20 L100,50 L0,50 Z" fill="currentColor" className="text-primary" />
          <path d="M0,40 Q10,30 20,40 T40,20 T60,30 T80,10 T100,20" fill="none" stroke="currentColor" strokeWidth="1" className="text-primary" />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xs font-semibold uppercase tracking-widest text-primary bg-background/80 px-2 py-1 rounded">Line Chart Placeholder</span>
        </div>
      </div>
    </div>
  );
}
