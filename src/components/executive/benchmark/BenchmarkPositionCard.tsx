import React from 'react';
import { BarChart2, TrendingUp, Users } from 'lucide-react';
import { ExecutiveSurface } from '../../ui/executive-surface';
import { ExecutiveBadge } from '../../ui/executive-badge';
import { ExecutiveText } from '../../ui/executive-typography';
import { PercentileCalculation } from '@illumine/executive-contracts';

export interface BenchmarkPositionCardProps {
  readonly calculation: PercentileCalculation;
}

export const BenchmarkPositionCard: React.FC<BenchmarkPositionCardProps> = ({ calculation }) => {
  const isPositive = calculation.gapPoints >= 0;

  return (
    <ExecutiveSurface className="p-4 mb-4 bg-card border border-border rounded-lg shadow-sm">
      <div className="flex items-center justify-between gap-4 mb-2 pb-2 border-b border-border/50">
        <div className="flex items-center gap-2">
          <BarChart2 className="w-4 h-4 text-primary" />
          <ExecutiveText variant="sectionTitle" className="font-semibold text-primary">
            Posição Relativa de Benchmark Setorial
          </ExecutiveText>
        </div>
        <ExecutiveBadge variant={calculation.percentile >= 50 ? 'success' : 'warning'}>
          Percentil P{calculation.percentile}
        </ExecutiveBadge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs mt-2">
        <div className="p-3 bg-surface-container/30 rounded border border-border/30">
          <span className="text-muted-foreground block text-[10px] uppercase font-semibold">Valor da Empresa</span>
          <span className="font-bold text-foreground text-base">{calculation.companyValue}%</span>
        </div>

        <div className="p-3 bg-surface-container/30 rounded border border-border/30">
          <span className="text-muted-foreground block text-[10px] uppercase font-semibold">Mediana do Setor (P50)</span>
          <span className="font-bold text-foreground text-base">{calculation.medianValue}%</span>
        </div>

        <div className="p-3 bg-surface-container/30 rounded border border-border/30">
          <span className="text-muted-foreground block text-[10px] uppercase font-semibold">Gap vs Mediana</span>
          <span className={`font-bold text-base ${isPositive ? 'text-success' : 'text-warning'}`}>
            {isPositive ? `+${calculation.gapPoints}` : calculation.gapPoints} p.p.
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between text-muted-foreground text-[11px] mt-3 pt-2 border-t border-border/30">
        <div className="flex items-center gap-1.5">
          <Users className="w-3.5 h-3.5 text-primary" />
          <span>{calculation.representativeness}</span>
        </div>
        <span>Confiança: <strong className="text-foreground">{calculation.confidenceScore}%</strong></span>
      </div>
    </ExecutiveSurface>
  );
};
