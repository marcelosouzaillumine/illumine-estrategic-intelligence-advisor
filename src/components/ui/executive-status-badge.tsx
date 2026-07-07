import React from 'react';
import { cn } from '../../lib/utils';
import { ShieldAlert, ShieldCheck, Shield, AlertTriangle, HelpCircle } from 'lucide-react';

export type ExecutiveStatus = 'EXCELLENT' | 'HEALTHY' | 'WARNING' | 'CRITICAL' | 'NEUTRAL' | 'INSUFFICIENT_DATA';

export interface ExecutiveStatusBadgeProps {
  status: ExecutiveStatus;
  className?: string;
  showIcon?: boolean;
  variant?: 'summary' | 'metric' | 'technical';
  label?: React.ReactNode | string;
}

export function ExecutiveStatusBadge({ status, className, showIcon, variant = 'summary', label: customLabel }: ExecutiveStatusBadgeProps) {
  const isExcellent = status === 'EXCELLENT';
  const isHealthy = status === 'HEALTHY';
  const isWarning = status === 'WARNING';
  const isCritical = status === 'CRITICAL';
  const isNeutral = status === 'NEUTRAL';
  const isInsufficient = status === 'INSUFFICIENT_DATA';

  const isMetricOrTechnical = variant === 'metric' || variant === 'technical';
  const actuallyShowIcon = showIcon !== undefined ? showIcon : !isMetricOrTechnical;

  // SOVEREIGNTY GUARD: Single Unified Base Class
  // "Padronizar completamente: mesma altura, padding, border-radius, tipografia. Tamanho uniforme (text-xs), font-semibold, inline-flex, items-center, justify-center, whitespace-nowrap."
  const baseClasses = "inline-flex items-center justify-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-semibold uppercase tracking-wider whitespace-nowrap shrink-0 max-w-full overflow-hidden truncate";
  
  const statusClasses = cn(
    isExcellent && "bg-state-excellent-soft text-state-excellent-foreground border-state-excellent-border",
    isHealthy && "bg-state-healthy-soft text-state-healthy-foreground border-state-healthy-border",
    isWarning && "bg-state-warning-soft text-state-warning-foreground border-state-warning-border",
    isCritical && "bg-state-critical-soft text-state-critical-foreground border-state-critical-border",
    isNeutral && "bg-state-neutral-soft text-state-neutral-foreground border-state-neutral-border",
    isInsufficient && "bg-state-insufficient-soft text-state-insufficient-foreground border-state-insufficient-border"
  );

  const Icon = isExcellent ? ShieldCheck :
               isHealthy ? Shield :
               isWarning ? AlertTriangle :
               isCritical ? ShieldAlert :
               HelpCircle;

  let label: React.ReactNode | string = isExcellent ? 'Excelente' :
              isHealthy ? 'Saudável' :
              isWarning ? 'Atenção' :
              isCritical ? 'Crítico' :
              isNeutral ? 'Neutro' :
              isInsufficient ? 'Dados Insuficientes' :
              String(status);

  // Mapeamentos de texto longo para versões compactas no badge KPI para evitar vazamento do card
  if (customLabel) label = customLabel;
  if (isMetricOrTechnical && !customLabel) {
    if (isInsufficient) {
      label = 'Sem Dados';
    } else {
      const upperStatus = String(status).toUpperCase();
      if (upperStatus === 'AVALIAÇÃO NEUTRA' || upperStatus === 'AVALIACAO NEUTRA') label = 'Neutro';
      else if (upperStatus === 'TESOURARIA POSITIVA') label = 'Positivo';
      else if (upperStatus === 'CONCENTRAÇÃO NO CURTO PRAZO' || upperStatus === 'CONCENTRACAO NO CURTO PRAZO') label = 'Concentrado';
    }
  }

  return (
    <span className={cn(baseClasses, statusClasses, className)}>
      {actuallyShowIcon && <Icon className="w-3.5 h-3.5 shrink-0" />}
      <span className="truncate">{label}</span>
    </span>
  );
}
