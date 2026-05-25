import React from 'react';
import { BenchmarkMetric } from '../../core/runtime/benchmarking/BenchmarkTypes';

export function BenchmarkComparisonChart({ metrics }: { metrics: BenchmarkMetric[] }) {
  if (!metrics || metrics.length === 0) return null;

  return (
    <div className="space-y-4">
      {metrics.map(metric => (
        <div key={metric.metricName} className="space-y-2">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span className="font-medium">{metric.metricName}</span>
            <span>Média da Rede: {metric.average}</span>
          </div>
          
          <div className="relative h-6 w-full bg-surface-container rounded overflow-hidden flex items-center">
            {/* Box plot representation */}
            <div 
              className="absolute h-full bg-primary/20 border-l border-r border-primary/50" 
              style={{ left: metric.p25 + '%', width: (metric.p75 - metric.p25) + '%' }}
            />
            {/* Median line */}
            <div 
              className="absolute h-full w-1 bg-primary z-10" 
              style={{ left: metric.p50 + '%' }}
            />
          </div>
          
          <div className="flex justify-between text-[10px] text-muted-foreground">
            <span>P25: {metric.p25}</span>
            <span>Mediana: {metric.p50}</span>
            <span>P75: {metric.p75}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
