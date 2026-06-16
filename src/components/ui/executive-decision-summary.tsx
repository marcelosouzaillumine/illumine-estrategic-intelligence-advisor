import React from 'react';
import { cn } from '@/lib/utils';
import { ExecutiveSurface } from './executive-surface';
import { ExecutiveDecisionWorkspaceModel } from '../../types/executive/ExecutiveDecisionWorkspaceModel';
import { ExecutiveText, ExecutiveMetric } from './executive-typography';

export interface ExecutiveDecisionSummaryProps {
  model?: ExecutiveDecisionWorkspaceModel;
  className?: string;
  label?: string;
  severityTone?: string;
  theme?: string;
  reason?: React.ReactNode;
  reasonLabel?: string;
}

export function ExecutiveDecisionSummary({ model, className, label, severityTone, theme, reason, reasonLabel }: ExecutiveDecisionSummaryProps) {
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'MONITORING': return 'bg-muted text-foreground border-border';
      case 'EXECUTION': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'ATTENTION': return 'bg-orange-50 text-orange-700 border-orange-200';
      case 'CRITICAL': return 'bg-red-50 text-red-700 border-red-200';
      case 'COMPLETED': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'OPTIMIZATION': return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      default: return 'bg-muted text-foreground border-border';
    }
  };

  if (!model) {
    return (
      <ExecutiveSurface elevation="none" padding="lg" radius="lg" className={cn("w-full flex flex-col bg-slate-50/50 border border-border relative rounded-2xl", className)}>
        <div className="flex flex-col gap-6 w-full">
          <div className="flex items-center gap-3 pb-2 border-b border-border/50">
            <ExecutiveText variant="label" as="span" className="px-3 py-1.5 rounded-md border bg-muted text-foreground">
              {label || 'ALERTA'}
            </ExecutiveText>
          </div>
          <div className="flex flex-col gap-2 pt-2">
            <ExecutiveText variant="label" className="uppercase">{reasonLabel || 'Racional'}</ExecutiveText>
            <ExecutiveText variant="sectionTitle" as="h1">
              {theme}
            </ExecutiveText>
          </div>
          <div className="flex flex-col gap-1.5 pt-4">
            <ExecutiveText variant="label" className="uppercase">Detalhes</ExecutiveText>
            <ExecutiveText variant="body" as="p" className="text-executive-secondary max-w-5xl">
              {reason}
            </ExecutiveText>
          </div>
        </div>
      </ExecutiveSurface>
    );
  }

  return (
    <ExecutiveSurface elevation="none" padding="lg" radius="lg" className={cn("w-full flex flex-col bg-slate-50/50 border border-border relative rounded-2xl", className)}>
      <div className="flex flex-col gap-6 w-full">
        
        {/* Top Line: Badges */}
        <div className="flex items-center gap-3 pb-2 border-b border-border/50">
          <ExecutiveText variant="label" as="span" className={cn("px-3 py-1.5 rounded-md border", getStatusBadge(model.status))}>
            {model.statusLabel || model.status}
          </ExecutiveText>
          <ExecutiveText variant="label" as="span" className="flex items-center gap-2">
            Confiança: <ExecutiveMetric variant="metricMetaValue" as="span">{model.confidenceLabel || model.confidence}</ExecutiveMetric>
          </ExecutiveText>
        </div>
        
        {/* Main Block: H1 Dominant Objective */}
        <div className="flex flex-col gap-2 pt-2">
          <ExecutiveText variant="label" className="uppercase">Objetivo Estratégico</ExecutiveText>
          <ExecutiveText variant="sectionTitle" as="h1">
            {model.objective}
          </ExecutiveText>
        </div>

        {/* Recommended Decision */}
        <div className="flex flex-col gap-1.5 pt-4">
          <ExecutiveText variant="label" className="uppercase">Decisão Recomendada</ExecutiveText>
          <ExecutiveText variant="bodyStrong" as="p" className="text-executive-primary max-w-5xl">
            {model.recommendedDecision}
          </ExecutiveText>
        </div>

        {/* Rationale */}
        <div className="flex flex-col gap-1.5 pt-4">
          <ExecutiveText variant="label" className="uppercase">Racional Executivo</ExecutiveText>
          <ExecutiveText variant="body" as="p" className="text-executive-secondary max-w-5xl">
            {model.rationale}
          </ExecutiveText>
        </div>

        {/* Footer: Driver */}
        <div className="flex flex-col gap-1.5 pt-6 border-t border-border mt-2">
          <ExecutiveText variant="label" className="uppercase">Motivo Determinante</ExecutiveText>
          <ExecutiveText variant="bodyStrong" as="span" className="text-executive-primary">
            {model.primaryDriver}
          </ExecutiveText>
        </div>

      </div>
    </ExecutiveSurface>
  );
}
