import React from 'react';
import { cn } from '@/lib/utils';
import type { ExecutiveStrategicDiagnosisPayload } from '../../services/FiduciaryRuntimeAdapter';
import { Compass, AlertTriangle, Target, LineChart, ShieldCheck, MapPin, Loader2 } from 'lucide-react';
import { ExecutiveSurface } from './executive-surface';

export interface ExecutiveStrategicSemanticCardsProps {
  payload: ExecutiveStrategicDiagnosisPayload;
  selectedYear: number;
  className?: string;
}

export function ExecutiveStrategicSemanticCards({ payload, selectedYear, className }: ExecutiveStrategicSemanticCardsProps) {
  if (!payload) return null;

  if (payload.analysisYear !== selectedYear) {
    return (
      <div className={cn("w-full flex flex-col gap-6 p-6 border border-border/50 rounded-xl bg-card/50", className)}>
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg text-primary">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-foreground leading-tight tracking-tight">
              Parecer Estratégico
            </h2>
            <p className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
              <Loader2 className="w-3 h-3 animate-spin" /> Recalculando inteligência executiva para {selectedYear}...
            </p>
          </div>
        </div>
      </div>
    );
  }

  const getSeverityColors = (severity?: string) => {
    switch (severity) {
      case 'critical': return 'bg-critical/5 border-critical/20 text-critical';
      case 'warning': return 'bg-warning/5 border-warning/20 text-warning';
      case 'healthy': return 'bg-success/5 border-success/20 text-success';
      default: return 'bg-border/5 border-border/20 text-foreground';
    }
  };

  const getSeverityIcon = (severity?: string) => {
    switch (severity) {
      case 'critical': return <AlertTriangle className="w-5 h-5 text-critical" />;
      case 'warning': return <AlertTriangle className="w-5 h-5 text-warning" />;
      case 'healthy': return <ShieldCheck className="w-5 h-5 text-success" />;
      default: return <ShieldCheck className="w-5 h-5 text-muted-foreground" />;
    }
  };

  return (
    <div className={cn("w-full flex flex-col gap-6", className)}>
      {/* HEADER */}
      <div className="flex items-center gap-3 pb-2 border-b border-border/50">
        <div className="p-2 bg-primary/10 rounded-lg text-primary">
          <Compass className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-foreground leading-tight tracking-tight">
            Parecer Estratégico
          </h2>
          <p className="text-sm text-foreground/70 mt-1">
            Síntese consolidada da condição atual, das prioridades executivas e das perspectivas futuras para suporte à tomada de decisão da Diretoria e do Conselho.
          </p>
        </div>
      </div>

      {/* CARDS GRID 2x2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        
        {/* Situação Atual */}
        <ExecutiveSurface padding="md" radius="md" className="bg-card border-border flex flex-col gap-2">
          <h4 className="text-sm font-bold text-foreground flex items-center gap-2">
            <MapPin className="w-4 h-4 text-primary" />
            Situação Atual
          </h4>
          <p className="text-sm text-foreground/80 leading-relaxed text-pretty flex-1">
            {payload.currentSituation}
          </p>
        </ExecutiveSurface>

        {/* Prioridade Estratégica */}
        <ExecutiveSurface padding="md" radius="md" className="bg-card border-border flex flex-col gap-2">
          <h4 className="text-sm font-bold text-foreground flex items-center gap-2">
            <Target className="w-4 h-4 text-primary" />
            Prioridade Estratégica
          </h4>
          <p className="text-sm text-foreground/80 leading-relaxed text-pretty flex-1">
            {payload.strategicPriority}
          </p>
        </ExecutiveSurface>

        {/* Outlook */}
        <ExecutiveSurface padding="md" radius="md" className="bg-card border-border flex flex-col gap-2">
          <h4 className="text-sm font-bold text-foreground flex items-center gap-2">
            <LineChart className="w-4 h-4 text-primary" />
            Perspectiva
          </h4>
          <p className="text-sm text-foreground/80 leading-relaxed text-pretty flex-1">
            {payload.outlook}
          </p>
        </ExecutiveSurface>

        {/* Recomendação Prioritária (Destaque Visual) */}
        <ExecutiveSurface padding="md" radius="md" className={cn(
          "border flex flex-col gap-2 relative overflow-hidden shadow-sm",
          getSeverityColors(payload.severityState)
        )}>
          <h4 className="text-sm font-bold flex items-center gap-2 z-10">
            {getSeverityIcon(payload.severityState)}
            Recomendação Prioritária
          </h4>
          <p className="text-sm font-medium leading-relaxed text-pretty flex-1 z-10 text-foreground/90">
            {payload.priorityRecommendation}
          </p>
          
          {/* Fator Determinante Opcional */}
          {payload.primaryDriver && (
            <div className="mt-2 pt-2 border-t border-current/10 z-10">
              <p className="text-xs text-current/90">
                <span className="font-bold">Fator determinante:</span> {payload.primaryDriver}
              </p>
            </div>
          )}
        </ExecutiveSurface>
      </div>
    </div>
  );
}
