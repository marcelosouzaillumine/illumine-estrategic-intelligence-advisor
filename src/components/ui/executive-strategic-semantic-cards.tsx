import React from 'react';
import { cn } from '@/lib/utils';
import type { ExecutiveStrategicDiagnosisPayload } from '../../services/FiduciaryRuntimeAdapter';
import { Compass, AlertTriangle, Target, LineChart, ShieldCheck, MapPin, Loader2 } from 'lucide-react';
import { ExecutiveSurface } from './executive-surface';

import { ExecutiveHeading } from './executive-heading';
import { ExecutiveText } from './executive-typography';

export interface ExecutiveStrategicSemanticCardsProps {
  payload: ExecutiveStrategicDiagnosisPayload;
  selectedYear?: number;
  hideContainer?: boolean;
  className?: string;
}

export function ExecutiveStrategicRecommendationCard({ payload, className }: { payload: ExecutiveStrategicDiagnosisPayload; className?: string }) {
  if (!payload) return null;

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
    <ExecutiveSurface padding="md" radius="md" className={cn(
      "border flex flex-col gap-2 relative overflow-hidden shadow-md",
      getSeverityColors(payload.severityState),
      className
    )}>
      <ExecutiveHeading as="h4" variant="submoduleTitle" className="flex items-center gap-2 z-10 text-foreground">
        {getSeverityIcon(payload.severityState)}
        Recomendação Prioritária
      </ExecutiveHeading>
      <ExecutiveText variant="bodyStandard" className="text-foreground leading-relaxed text-pretty flex-1 z-10 font-medium">
        {payload.priorityRecommendation}
      </ExecutiveText>
      {payload.primaryDriver && (
        <div className="mt-2 pt-2 border-t border-border z-10">
          <ExecutiveText variant="microLabel" className="text-executive-secondary font-medium">
            <span className="font-bold text-foreground">Principal driver institucional:</span> {payload.primaryDriver}
          </ExecutiveText>
        </div>
      )}
    </ExecutiveSurface>
  );
}

export function ExecutiveStrategicSynthesisCards({ payload, selectedYear = payload?.analysisYear ?? 2024, hideContainer, className }: ExecutiveStrategicSemanticCardsProps) {
  if (!payload) return null;

  if (payload.analysisYear !== selectedYear) {
    return (
      <div className={cn("w-full flex flex-col gap-6 p-6 border border-border shadow-sm rounded-xl bg-card", className)}>
        <div className="flex items-center gap-3">
          <div className="text-primary flex items-center justify-center">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <ExecutiveHeading as="h2" variant="moduleTitle" className="text-foreground leading-tight tracking-tight">
              Diagnóstico Estratégico
            </ExecutiveHeading>
            <ExecutiveText variant="bodyStandard" className="text-executive-secondary flex items-center gap-2 mt-1">
              <Loader2 className="w-3 h-3 animate-spin" /> Recalculando inteligência executiva para {selectedYear}...
            </ExecutiveText>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("w-full flex flex-col gap-6", className)}>
      {!hideContainer && (
        <div className="flex items-center gap-3 pb-2 border-b border-border">
          <div className="text-primary flex items-center justify-center">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <ExecutiveHeading as="h2" variant="moduleTitle" className="text-foreground leading-tight tracking-tight">
              Diagnóstico Estratégico
            </ExecutiveHeading>
            <ExecutiveText variant="bodyStandard" className="text-executive-secondary mt-1">
              {payload.moduleContext === 'BP' 
                ? "Visão consolidada da posição patrimonial, liquidez, estrutura de capital e capacidade de sustentação financeira para suporte à tomada de decisão."
                : "Visão consolidada do desempenho econômico, da formação do resultado e das prioridades operacionais para suporte à tomada de decisão."}
            </ExecutiveText>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <ExecutiveSurface padding="md" radius="md" className="bg-card border border-border shadow-md flex flex-col gap-2">
          <ExecutiveHeading as="h4" variant="submoduleTitle" className="flex items-center gap-2 text-foreground">
            <MapPin className="w-4 h-4 text-primary" />
            Situação Atual
          </ExecutiveHeading>
          <ExecutiveText variant="bodyStandard" className="text-executive-secondary leading-relaxed text-pretty flex-1 font-medium">
            {payload.currentSituation}
          </ExecutiveText>
        </ExecutiveSurface>

        <ExecutiveSurface padding="md" radius="md" className="bg-card border border-border shadow-md flex flex-col gap-2">
          <ExecutiveHeading as="h4" variant="submoduleTitle" className="flex items-center gap-2 text-foreground">
            <Target className="w-4 h-4 text-primary" />
            Prioridade Estratégica
          </ExecutiveHeading>
          <ExecutiveText variant="bodyStandard" className="text-executive-secondary leading-relaxed text-pretty flex-1 font-medium">
            {payload.strategicPriority}
          </ExecutiveText>
        </ExecutiveSurface>

        <ExecutiveSurface padding="md" radius="md" className="bg-card border border-border shadow-md flex flex-col gap-2">
          <ExecutiveHeading as="h4" variant="submoduleTitle" className="flex items-center gap-2 text-foreground">
            <LineChart className="w-4 h-4 text-primary" />
            Perspectiva
          </ExecutiveHeading>
          <ExecutiveText variant="bodyStandard" className="text-executive-secondary leading-relaxed text-pretty flex-1 font-medium">
            {payload.outlook}
          </ExecutiveText>
        </ExecutiveSurface>
      </div>
    </div>
  );
}

export function ExecutiveStrategicSemanticCards({ payload, selectedYear = payload?.analysisYear ?? 2024, className }: ExecutiveStrategicSemanticCardsProps) {
  if (!payload) return null;

  return (
    <div className={cn("w-full flex flex-col gap-6", className)}>
      <ExecutiveStrategicSynthesisCards payload={payload} selectedYear={selectedYear} />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ExecutiveStrategicRecommendationCard payload={payload} />
      </div>
    </div>
  );
}
