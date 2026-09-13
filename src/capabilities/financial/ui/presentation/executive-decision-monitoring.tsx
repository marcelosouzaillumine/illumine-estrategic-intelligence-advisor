import React from 'react';
import { cn } from '../../../../lib/utils';
import { ExecutiveDecisionMonitoringState } from '../../../../types/executive-recommendation-contract';
import { ExecutiveSurface } from '../../../../components/ui/executive-surface';
import { ExecutiveBadge } from '../../../../components/ui/executive-badge';
import { ExecutiveHeading } from '../../../../components/ui/executive-heading';
import { ExecutiveText } from '../../../../components/ui/executive-typography';
import { CheckCircle2, Clock, AlertTriangle, RefreshCw, Target, BrainCircuit, Activity } from 'lucide-react';

export interface ExecutiveDecisionMonitoringProps extends React.HTMLAttributes<HTMLDivElement> {
  monitoring: ExecutiveDecisionMonitoringState;
}

const statusBadges: Record<ExecutiveDecisionMonitoringState['monitoringStatus'], { label: string; variant: 'success' | 'warning' | 'info' | 'neutral' }> = {
  verified: { label: 'Resultado Verificado', variant: 'success' },
  in_progress: { label: 'Em Monitoramento', variant: 'info' },
  pending: { label: 'Aguardando Avaliação', variant: 'warning' },
  recalibrated: { label: 'Recalibrado', variant: 'neutral' },
};

export const ExecutiveDecisionMonitoring: React.FC<ExecutiveDecisionMonitoringProps> = ({
  monitoring,
  className,
  ...props
}) => {
  const {
    decisionTaken,
    expectedShift,
    monitoringMetrics,
    actualShift,
    learningNote,
    monitoringStatus,
    lastEvaluatedAt,
  } = monitoring;

  const statusInfo = statusBadges[monitoringStatus];

  return (
    <ExecutiveSurface
      padding="lg"
      radius="xl"
      className={cn("bg-card border border-border space-y-5", className)}
      {...props}
    >
      {/* Header: Title & Status */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/60 pb-3">
        <div className="flex items-center gap-2">
          <BrainCircuit size={18} className="text-primary" />
          <ExecutiveHeading as="h4" className="text-sm font-semibold text-foreground">
            Acompanhamento Decisório & Aprendizado Organizacional
          </ExecutiveHeading>
        </div>

        <div className="flex items-center gap-2">
          <ExecutiveBadge variant={statusInfo.variant}>
            {statusInfo.label}
          </ExecutiveBadge>
          <span className="text-[11px] text-muted-foreground font-mono">
            Avaliado em: {lastEvaluatedAt}
          </span>
        </div>
      </div>

      {/* Decision Taken */}
      <div className="space-y-1">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground block">
          Decisão Homologada pelo Conselho
        </span>
        <p className="text-sm font-medium text-foreground">
          {decisionTaken}
        </p>
      </div>

      {/* Comparison: Expected vs Actual */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-muted/30 rounded-xl p-4 border border-border/40">
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
            <Target size={13} className="text-primary" />
            <span>Resultado Esperado (`ExpectedKPIShift`)</span>
          </div>
          <p className="text-xs font-semibold text-foreground">
            {expectedShift.expected}
          </p>
        </div>

        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
            <Activity size={13} className="text-emerald-500" />
            <span>Resultado Realizado</span>
          </div>
          <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
            {actualShift || 'Aguardando apuração do período contábil.'}
          </p>
        </div>
      </div>

      {/* Monitored Metrics */}
      <div className="space-y-1">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground block">
          Indicadores Chave Acompanhados
        </span>
        <div className="flex flex-wrap gap-2">
          {monitoringMetrics.map((metric, idx) => (
            <span
              key={idx}
              className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-card border border-border text-foreground"
            >
              {metric}
            </span>
          ))}
        </div>
      </div>

      {/* Organizational Learning Note */}
      {learningNote && (
        <div className="p-3.5 rounded-xl bg-primary/5 border border-primary/20 space-y-1">
          <span className="text-xs font-semibold text-primary flex items-center gap-1.5">
            <BrainCircuit size={14} />
            Aprendizado Registrado na Memória Organizacional
          </span>
          <ExecutiveText variant="body" className="text-xs text-muted-foreground leading-relaxed">
            {learningNote}
          </ExecutiveText>
        </div>
      )}
    </ExecutiveSurface>
  );
};
