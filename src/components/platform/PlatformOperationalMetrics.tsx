import React from 'react';
import { BarChart3 } from 'lucide-react';
import { ExecutiveSurface } from '../ui/executive-surface';
import { ExecutiveText } from '../ui/executive-typography';

export interface OperationalMetricItem {
  readonly label: string;
  readonly value: string | number;
  readonly subtext?: string;
  readonly status?: 'DEFAULT' | 'SUCCESS' | 'WARNING' | 'CRITICAL';
}

export interface PlatformOperationalMetricsProps {
  readonly metrics: readonly OperationalMetricItem[];
}

export const PlatformOperationalMetrics: React.FC<PlatformOperationalMetricsProps> = ({ metrics }) => {
  return (
    <ExecutiveSurface className="p-4 mb-6 bg-card border border-border rounded-lg shadow-sm">
      <div className="flex items-center gap-2 mb-3 pb-2 border-b border-border/50">
        <BarChart3 className="w-4 h-4 text-primary" />
        <ExecutiveText variant="sectionTitle" className="font-semibold text-primary">
          Layer 3 — Métricas Operacionais Puras
        </ExecutiveText>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
        {metrics.map((metric, idx) => (
          <div key={idx} className="p-3 bg-surface-container/30 rounded border border-border/30">
            <span className="text-muted-foreground block text-[10px] uppercase font-semibold">{metric.label}</span>
            <span className="font-bold text-foreground text-base block mt-0.5">{metric.value}</span>
            {metric.subtext && (
              <span className="text-muted-foreground text-[10px] block mt-1">{metric.subtext}</span>
            )}
          </div>
        ))}
      </div>
    </ExecutiveSurface>
  );
};
