import React from 'react';
import { Layers, CheckCircle2 } from 'lucide-react';
import { ExecutiveSurface } from '../../ui/executive-surface';
import { ExecutiveText } from '../../ui/executive-typography';
import { IndustryStatistics } from '@illumine/executive-contracts';

export interface IndustryComparisonCardProps {
  readonly stats: IndustryStatistics;
}

export const IndustryComparisonCard: React.FC<IndustryComparisonCardProps> = ({ stats }) => {
  return (
    <ExecutiveSurface className="p-4 mb-4 bg-card border border-border rounded-lg shadow-sm">
      <div className="flex items-center gap-2 mb-3 pb-2 border-b border-border/50">
        <Layers className="w-4 h-4 text-primary" />
        <ExecutiveText variant="sectionTitle" className="font-semibold text-primary">
          Distribuição Setorial de Indicadores ({stats.metricCode})
        </ExecutiveText>
      </div>

      <div className="grid grid-cols-5 gap-2 text-xs text-center">
        <div className="p-2 bg-surface-container/30 rounded border border-border/30">
          <span className="text-[10px] text-muted-foreground block font-bold">P10 (Inferior)</span>
          <span className="font-semibold text-foreground">{stats.p10}%</span>
        </div>
        <div className="p-2 bg-surface-container/30 rounded border border-border/30">
          <span className="text-[10px] text-muted-foreground block font-bold">P25</span>
          <span className="font-semibold text-foreground">{stats.p25}%</span>
        </div>
        <div className="p-2 bg-primary/10 border border-primary/30 rounded font-bold">
          <span className="text-[10px] text-primary block">P50 (Mediana)</span>
          <span className="text-primary text-sm">{stats.p50}%</span>
        </div>
        <div className="p-2 bg-surface-container/30 rounded border border-border/30">
          <span className="text-[10px] text-muted-foreground block font-bold">P75</span>
          <span className="font-semibold text-foreground">{stats.p75}%</span>
        </div>
        <div className="p-2 bg-surface-container/30 rounded border border-border/30">
          <span className="text-[10px] text-muted-foreground block font-bold">P90 (Superior)</span>
          <span className="font-semibold text-success">{stats.p90}%</span>
        </div>
      </div>
    </ExecutiveSurface>
  );
};
