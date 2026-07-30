import React from 'react';
import { cn } from '../../lib/utils';
import { ExecutiveRecommendationContract } from '../../types/executive-recommendation-contract';
import { ExecutiveBadge } from './executive-badge';
import { ExecutiveSurface } from './executive-surface';
import { ExecutiveHeading } from './executive-heading';
import { ExecutiveText } from './executive-typography';
import { ArrowRight, Calendar, UserCheck, Target, TrendingUp, ShieldCheck, CheckCircle2 } from 'lucide-react';

export interface ExecutiveActionSurfaceProps extends React.HTMLAttributes<HTMLDivElement> {
  recommendation: ExecutiveRecommendationContract;
  onApprove?: (recommendation: ExecutiveRecommendationContract) => void;
}

const priorityVariants: Record<ExecutiveRecommendationContract['priority'], 'critical' | 'warning' | 'info' | 'neutral'> = {
  critical: 'critical',
  high: 'warning',
  medium: 'info',
  low: 'neutral',
};

export const ExecutiveActionSurface: React.FC<ExecutiveActionSurfaceProps> = ({
  recommendation,
  onApprove,
  className,
  ...props
}) => {
  const {
    decision,
    rationale,
    evidence,
    expectedKPIShift,
    owner,
    timeframe,
    priority,
    successCriteria,
    monitoringMetrics,
  } = recommendation;

  return (
    <ExecutiveSurface
      padding="lg"
      radius="xl"
      className={cn("bg-card border border-border shadow-sm space-y-6 hover:border-primary/40 transition-colors", className)}
      {...props}
    >
      {/* Header: Priority & Action Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <ExecutiveBadge variant={priorityVariants[priority]}>
              Prioridade {priority.toUpperCase()}
            </ExecutiveBadge>
            <span className="text-xs text-muted-foreground font-mono">ID: {recommendation.id}</span>
          </div>
          <ExecutiveHeading as="h3" className="text-foreground font-semibold text-lg">
            {decision}
          </ExecutiveHeading>
        </div>

        {onApprove && (
          <button
            onClick={() => onApprove(recommendation)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-primary text-primary-foreground hover:opacity-90 transition-opacity self-start sm:self-auto"
          >
            <CheckCircle2 size={14} />
            Aprovar Resolução
          </button>
        )}
      </div>

      {/* Rationale & Evidence */}
      <div className="space-y-3">
        <ExecutiveText variant="body" className="text-muted-foreground text-sm leading-relaxed">
          {rationale}
        </ExecutiveText>

        {evidence.length > 0 && (
          <div className="bg-muted/40 rounded-xl p-3.5 border border-border/40 space-y-2">
            <span className="text-xs font-semibold text-foreground uppercase tracking-wider block">
              Trilha de Evidências Auditáveis
            </span>
            <ul className="space-y-1">
              {evidence.map((item, idx) => (
                <li key={idx} className="text-xs text-muted-foreground flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary/70 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Grid of Action Details: Owner, Timeframe, Impact & KPI */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
        {/* Owner */}
        <div className="p-3 rounded-xl bg-card border border-border/60 space-y-1">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
            <UserCheck size={14} className="text-primary" />
            <span>Responsável</span>
          </div>
          <p className="text-xs font-semibold text-foreground truncate">{owner}</p>
        </div>

        {/* Timeframe */}
        <div className="p-3 rounded-xl bg-card border border-border/60 space-y-1">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
            <Calendar size={14} className="text-primary" />
            <span>Prazo Estimado</span>
          </div>
          <p className="text-xs font-semibold text-foreground">{timeframe}</p>
        </div>

        {/* Expected Impact */}
        <div className="p-3 rounded-xl bg-card border border-border/60 space-y-1">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
            <TrendingUp size={14} className="text-emerald-500" />
            <span>Impacto Esperado</span>
          </div>
          <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
            {expectedKPIShift.expected}
          </p>
        </div>

        {/* Monitored Metrics */}
        <div className="p-3 rounded-xl bg-card border border-border/60 space-y-1">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
            <Target size={14} className="text-primary" />
            <span>KPI Monitorado</span>
          </div>
          <p className="text-xs font-semibold text-foreground truncate">
            {monitoringMetrics.join(', ') || 'N/A'}
          </p>
        </div>
      </div>

      {/* Success Criteria */}
      {successCriteria && (
        <div className="text-xs text-muted-foreground border-t border-border/40 pt-3 flex items-center gap-2">
          <ShieldCheck size={14} className="text-primary shrink-0" />
          <span><strong className="text-foreground">Critério de Sucesso:</strong> {successCriteria}</span>
        </div>
      )}
    </ExecutiveSurface>
  );
};
