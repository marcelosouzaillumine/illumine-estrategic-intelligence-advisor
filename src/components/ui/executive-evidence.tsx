import React from 'react';
import { cn } from '../../lib/utils';
import { ExecutiveEvidenceBinding } from '../../types/executive-recommendation-contract';
import { ExecutiveSurface } from './executive-surface';
import { ExecutiveBadge } from './executive-badge';
import { Database, Calendar, TrendingUp, TrendingDown, Minus, ShieldCheck } from 'lucide-react';

export interface ExecutiveEvidenceProps extends React.HTMLAttributes<HTMLDivElement> {
  evidence: ExecutiveEvidenceBinding;
}

export const ExecutiveEvidence: React.FC<ExecutiveEvidenceProps> = ({
  evidence,
  className,
  ...props
}) => {
  const { conclusion, source, period, comparison, confidenceScore, metrics } = evidence;

  return (
    <ExecutiveSurface
      padding="md"
      radius="xl"
      className={cn("bg-card border border-border/80 space-y-4", className)}
      {...props}
    >
      {/* Top Header: Source, Period & Confidence */}
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs border-b border-border/60 pb-3">
        <div className="flex items-center gap-3 text-muted-foreground font-medium">
          <span className="flex items-center gap-1">
            <Database size={13} className="text-primary" />
            {source}
          </span>
          <span className="flex items-center gap-1">
            <Calendar size={13} className="text-primary" />
            {period}
          </span>
        </div>

        <ExecutiveBadge variant={confidenceScore >= 90 ? 'success' : 'info'}>
          Confiança {confidenceScore}%
        </ExecutiveBadge>
      </div>

      {/* Main Statement / Conclusion */}
      <div className="space-y-1">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground block">
          Conclusão Fiduciária Baseada em Dados
        </span>
        <h4 className="text-sm font-semibold text-foreground leading-snug">
          {conclusion}
        </h4>
        <p className="text-xs text-muted-foreground font-medium">
          Comparativo: {comparison}
        </p>
      </div>

      {/* Metrics Breakdown Grid */}
      {metrics && metrics.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          {metrics.map((m, idx) => (
            <div key={idx} className="p-2.5 rounded-lg bg-muted/30 border border-border/50 space-y-1">
              <span className="text-[11px] text-muted-foreground block truncate">{m.name}</span>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-foreground">{m.value}</span>
                <span className="flex items-center gap-1 text-[11px] font-semibold">
                  {m.trend === 'up' && <TrendingUp size={12} className="text-emerald-500" />}
                  {m.trend === 'down' && <TrendingDown size={12} className="text-rose-500" />}
                  {m.trend === 'stable' && <Minus size={12} className="text-muted-foreground" />}
                  {m.variance}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </ExecutiveSurface>
  );
};
