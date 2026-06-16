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
      <div className={cn("w-full flex flex-col gap-6 p-6 border border-border shadow-sm rounded-xl bg-card", className)}>
        <div className="flex items-center gap-3">
          <div className="text-primary flex items-center justify-center">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground leading-tight tracking-tight">
              Diagnóstico Estratégico
            </h2>
      <p className="text-sm text-executive-secondary flex items-center gap-2 mt-1">
              <Loader2 className="w-3 h-3 animate-spin" /> Recalculando inteligência executiva para {selectedYear}...
            </p>
          </div>
        </div>
      </div>
    );
  }

  const getSeverityColors = (severity?: string) => {
    switch (severity) {
      case 'critical': return 'bg-state-critical-soft border-state-critical-border';
      case 'warning': return 'bg-state-warning-soft border-state-warning-border';
      case 'healthy': return 'bg-state-healthy-soft border-state-healthy-border';
      case 'excellent': return 'bg-state-excellent-soft border-state-excellent-border';
      default: return 'bg-card border-border';
    }
  };

  const getSeverityIcon = (severity?: string) => {
    switch (severity) {
      case 'critical': return <AlertTriangle className="w-4 h-4 text-state-critical-foreground" />;
      case 'warning': return <AlertTriangle className="w-4 h-4 text-state-warning-foreground" />;
      case 'healthy': return <ShieldCheck className="w-4 h-4 text-state-healthy-foreground" />;
      case 'excellent': return <ShieldCheck className="w-4 h-4 text-state-excellent-foreground" />;
      default: return <ShieldCheck className="w-4 h-4 text-muted-foreground" />;
    }
  };

  return (
    <div className={cn("w-full flex flex-col gap-6", className)}>
      {/* HEADER */}
      <div className="flex items-center gap-3 pb-2 border-b border-border">
        <div className="text-primary flex items-center justify-center">
          <Compass className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-foreground leading-tight tracking-tight">
            Diagnóstico Estratégico
          </h2>
          <p className="text-sm text-executive-secondary mt-1">
            {payload.moduleContext === 'BP' 
              ? "Visão consolidada da posição patrimonial, liquidez, estrutura de capital e capacidade de sustentação financeira para suporte à tomada de decisão."
              : "Visão consolidada do desempenho econômico, da formação do resultado e das prioridades operacionais para suporte à tomada de decisão."}
          </p>
        </div>
      </div>

      {/* CARDS GRID 2x2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        
        {/* Situação Atual */}
        <ExecutiveSurface padding="md" radius="md" className="bg-white border border-border shadow-md flex flex-col gap-2">
          <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
            <MapPin className="w-4 h-4 text-primary" />
            Situação Atual
          </h4>
          <p className="text-sm text-executive-secondary leading-relaxed text-pretty flex-1 font-medium">
            {payload.currentSituation}
          </p>
        </ExecutiveSurface>

        {/* Prioridade Estratégica */}
        <ExecutiveSurface padding="md" radius="md" className="bg-white border border-border shadow-md flex flex-col gap-2">
          <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
            <Target className="w-4 h-4 text-primary" />
            Prioridade Estratégica
          </h4>
          <p className="text-sm text-executive-secondary leading-relaxed text-pretty flex-1 font-medium">
            {payload.strategicPriority}
          </p>
        </ExecutiveSurface>

        {/* Outlook */}
        <ExecutiveSurface padding="md" radius="md" className="bg-white border border-border shadow-md flex flex-col gap-2">
          <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
            <LineChart className="w-4 h-4 text-primary" />
            Perspectiva
          </h4>
          <p className="text-sm text-executive-secondary leading-relaxed text-pretty flex-1 font-medium">
            {payload.outlook}
          </p>
        </ExecutiveSurface>

        {/* Recomendação Prioritária (Destaque Visual) */}
        <ExecutiveSurface padding="md" radius="md" className={cn(
          "border flex flex-col gap-2 relative overflow-hidden shadow-md",
          getSeverityColors(payload.severityState)
        )}>
          <h4 className="text-sm font-semibold text-foreground flex items-center gap-2 z-10">
            {getSeverityIcon(payload.severityState)}
            Recomendação Prioritária
          </h4>
          <p className="text-sm text-foreground leading-relaxed text-pretty flex-1 z-10 font-medium">
            {payload.priorityRecommendation}
          </p>
          
          {/* Principal Driver Institucional Opcional */}
          {payload.primaryDriver && (
            <div className="mt-2 pt-2 border-t border-border z-10">
              <p className="text-xs text-executive-secondary font-medium">
                <span className="font-bold text-foreground">Principal driver institucional:</span> {payload.primaryDriver}
              </p>
            </div>
          )}
        </ExecutiveSurface>
      </div>
    </div>
  );
}
