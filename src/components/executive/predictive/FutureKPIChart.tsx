import React from 'react';
import { TrendingUp } from 'lucide-react';
import { ExecutiveSurface } from '../../ui/executive-surface';
import { ExecutiveText } from '../../ui/executive-typography';

export interface FutureKPIChartProps {
  readonly metricCode: string;
  readonly currentValue: number;
  readonly expectedValue: number;
}

export const FutureKPIChart: React.FC<FutureKPIChartProps> = ({ metricCode, currentValue, expectedValue }) => {
  return (
    <ExecutiveSurface className="p-3 bg-card border border-border rounded-lg shadow-sm">
      <div className="flex items-center justify-between gap-2 mb-1">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-3.5 h-3.5 text-primary" />
          <ExecutiveText variant="bodyStandard" className="font-semibold text-foreground">
            Trajetória Futura: {metricCode}
          </ExecutiveText>
        </div>
      </div>
      <div className="flex items-center justify-between text-xs text-muted-foreground mt-2">
        <span>Atual: <strong className="text-foreground">{currentValue}%</strong></span>
        <span>→</span>
        <span>Projetado: <strong className="text-primary">{expectedValue}%</strong></span>
      </div>
    </ExecutiveSurface>
  );
};
