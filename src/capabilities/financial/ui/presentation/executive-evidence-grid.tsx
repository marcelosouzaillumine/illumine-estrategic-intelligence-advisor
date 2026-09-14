import React from 'react';
import { cn } from '../../../../lib/utils';
import { ExecutiveText } from '../../../../components/ui/executive-typography';

export interface EvidenceMetric {
  name: string;
  value: string | number;
  healthyRange?: string;
  interpretation?: string;
  trend?: 'stable' | 'improving' | 'worsening' | 'neutral';
  confidence?: string;
  unit?: string;
}

export interface ExecutiveEvidenceGridProps {
  metrics: EvidenceMetric[];
  className?: string;
}

export function ExecutiveEvidenceGrid({ metrics, className }: ExecutiveEvidenceGridProps) {
  if (!metrics || metrics.length === 0) return null;
  const displayedMetrics = metrics.slice(0, 4);

  return (
    <div className={cn("w-full grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mt-8", className)}>
      {displayedMetrics.map((metric, idx) => (
        <div 
          key={idx} 
          className="flex flex-col p-4 bg-surface-container/20 border border-border rounded-xl shadow-sm hover:shadow-md transition-shadow"
        >
          <ExecutiveText variant="submoduleTitle" className="mb-2">
            {metric.name}
          </ExecutiveText>
          
          <div className="flex items-baseline gap-1 mb-4">
            <span className="text-2xl font-bold text-executive-primary">{metric.value}</span>
            {metric.unit && <span className="text-sm font-medium text-executive-secondary">{metric.unit}</span>}
          </div>

          <div className="flex flex-col gap-2 mt-auto pt-4 border-t border-border">
            {metric.healthyRange && (
              <div className="flex justify-between items-center text-sm">
                <span className="text-executive-muted">Faixa saudável:</span>
                <span className="font-medium text-executive-primary text-right max-w-[60%]">{metric.healthyRange}</span>
              </div>
            )}
            
            {metric.interpretation && !['monitoramento contínuo', 'padrão', 'normal', 'adequado', 'standard'].includes(metric.interpretation.toLowerCase()) && (
              <div className="flex justify-between items-center text-sm">
                <span className="text-executive-muted">Interpretação:</span>
                <span className="font-medium text-executive-primary text-right max-w-[60%] truncate" title={metric.interpretation}>
                  {metric.interpretation}
                </span>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
