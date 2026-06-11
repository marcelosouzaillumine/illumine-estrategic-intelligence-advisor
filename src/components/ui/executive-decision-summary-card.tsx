import React from 'react';
import { cn } from '@/lib/utils';
import { ExecutiveDecisionPayload } from '../../core/runtime/executive-consolidation/ExecutiveSynthesisTypes';
import { Compass, AlertTriangle, CheckCircle, Info, ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';
import { ExecutiveSurface } from './executive-surface';

export interface ExecutiveDecisionSummaryCardProps {
  payload: ExecutiveDecisionPayload;
  className?: string;
  moduleName?: string;
}

export function ExecutiveDecisionSummaryCard({ payload, className, moduleName }: ExecutiveDecisionSummaryCardProps) {
  if (!payload) return null;

  return (
    <div className={cn("w-full flex flex-col gap-6", className)}>
      {/* HEADER */}
      <div className="flex items-center gap-3 pb-2 border-b border-border/50">
        <div className="p-2 bg-primary/10 rounded-lg text-primary">
          <Compass className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-foreground leading-tight tracking-tight">
            Síntese Executiva para Tomada de Decisão
          </h2>
          <p className="text-sm text-muted-foreground">
            Parecer Analítico Fiduciário para o Conselho {moduleName ? `- ${moduleName}` : ''}
          </p>
        </div>
      </div>

      {/* KPI STRIP */}
      {payload.kpis && payload.kpis.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {payload.kpis.map((kpi, idx) => (
            <ExecutiveSurface key={idx} padding="md" radius="md" className="border-border bg-card/40 flex flex-col gap-1">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{kpi.label}</span>
              <div className="flex items-center justify-between">
                <span className="text-xl font-bold tracking-tight text-foreground">{kpi.value}</span>
                {kpi.trend === 'positive' && <ArrowUpRight className="w-4 h-4 text-emerald-500" />}
                {kpi.trend === 'negative' && <ArrowDownRight className="w-4 h-4 text-rose-500" />}
                {kpi.trend === 'neutral' && <Minus className="w-4 h-4 text-muted-foreground" />}
              </div>
            </ExecutiveSurface>
          ))}
        </div>
      )}

      {/* ONE LINE SUMMARY */}
      {payload.summary && (
        <div className="text-lg font-medium leading-relaxed text-foreground border-l-4 border-primary/40 pl-4 py-1">
          {payload.summary}
        </div>
      )}

      {/* THEMATIC NARRATIVES */}
      {payload.thematicNarratives && payload.thematicNarratives.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
          {payload.thematicNarratives.map((theme, idx) => (
            <div key={idx} className="flex flex-col gap-2">
              <h4 className="text-sm font-bold text-foreground flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary/60"></span>
                {theme.title}
              </h4>
              <p className="text-sm text-foreground/80 leading-relaxed text-pretty">
                {theme.content}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* BOARD CONCLUSION & RECOMMENDATION */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-2">
        <ExecutiveSurface padding="md" radius="md" className="bg-surface-high border-border">
          <h4 className="text-sm font-bold text-foreground mb-3 flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-primary" />
            {payload.boardConclusion.title}
          </h4>
          <p className="text-sm text-foreground/80 leading-relaxed text-pretty">
            {payload.boardConclusion.content}
          </p>
        </ExecutiveSurface>

        <ExecutiveSurface padding="md" radius="md" className={cn(
          "border",
          payload.priorityRecommendation.severity === 'critical' ? 'bg-critical/5 border-critical/20' :
          payload.priorityRecommendation.severity === 'warning' ? 'bg-warning/5 border-warning/20' :
          'bg-success/5 border-success/20'
        )}>
          <h4 className={cn(
            "text-sm font-bold mb-3 flex items-center gap-2",
            payload.priorityRecommendation.severity === 'critical' ? 'text-critical' :
            payload.priorityRecommendation.severity === 'warning' ? 'text-warning' :
            'text-success'
          )}>
            {payload.priorityRecommendation.severity === 'critical' ? <AlertTriangle className="w-4 h-4" /> :
             payload.priorityRecommendation.severity === 'warning' ? <AlertTriangle className="w-4 h-4" /> :
             <Info className="w-4 h-4" />}
            Recomendação Prioritária
          </h4>
          <p className="text-sm text-foreground/90 font-medium leading-relaxed text-pretty">
            {payload.priorityRecommendation.content}
          </p>
        </ExecutiveSurface>
      </div>
    </div>
  );
}
