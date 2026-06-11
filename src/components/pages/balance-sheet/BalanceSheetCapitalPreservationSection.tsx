import React from 'react';
import { cn } from '../../../lib/utils';
import { ExecutiveSurface } from '../../ui/executive-surface';
import { ExecutiveMetricCard } from '../../ui/executive-metric-card';
import { ExecutiveLabelResolver } from '../../../services/FiduciaryRuntimeAdapter';

export type BalanceSheetCapitalPreservationSectionProps = {
  indicators?: any[];
  t: (key: string) => string;
};

export const BalanceSheetCapitalPreservationSection = ({ indicators, t }: BalanceSheetCapitalPreservationSectionProps) => {
  if (!indicators) return null;

  const metrics = ['Loss Absorption Capacity', 'Equity Buffer', 'Survival Index', 'Capital Erosion Velocity (CEV)', 'Equity Quality Index'];

  return (
    <ExecutiveSurface 
      variant="default" 
      elevation="lg" 
      padding="none" 
      className="rounded-[40px] p-8 md:p-10 hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-500 relative overflow-hidden"
    >
      <h3 className="text-xl md:text-[22px] font-semibold text-foreground mb-6">Preservação de Capital</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-5 gap-5 md:gap-6">
        {metrics.map((metric, idx) => {
          const ind = indicators.find((i: any) => i.metricName === metric);
          if (!ind) return null;
          
          const classStr = (ind.classification || '').toUpperCase();
          let tone: 'critical' | 'warning' | 'success' | 'neutral' = 'neutral';
          
          if (ind.severity === 'CRITICAL' || classStr.includes('CRITIC') || classStr.includes('CRÍTICA') || classStr.includes('CRÍTICO') || classStr.includes('SEVERE') || classStr.includes('DRENADO')) {
            tone = 'critical';
          } else if (ind.severity === 'ATTENTION' || ind.severity === 'WARNING' || classStr.includes('ATTENTION') || classStr.includes('ATENÇÃO') || classStr.includes('WARNING') || classStr.includes('ALERTA') || classStr.includes('EROSÃO')) {
            tone = 'warning';
          } else if (ind.severity === 'HEALTHY' || ind.severity === 'SUCCESS' || classStr.includes('HEALTHY') || classStr.includes('SAUDÁVEL') || classStr.includes('SAUDAVEL') || classStr.includes('ADEQUADA') || classStr.includes('PLENA') || classStr.includes('ESTÁVEL') || classStr.includes('PRESERVADO')) {
            tone = 'success';
          }

          const isCrit = tone === 'critical';
          const isWarn = tone === 'warning';
          
          const isNumeric = ind.format === 'percentage' || ind.format === 'multiplier' || !isNaN(Number(ind.value));
          const mainValueFormatted = ind.format === 'percentage' ? (Number(ind.value)*100).toFixed(1)+'%' : 
                                      ind.format === 'multiplier' ? Number(ind.value).toFixed(2)+'x' : 
                                      ind.format === 'string' ? ind.value : 
                                      Number(ind.value).toFixed(1);

          return (
            <ExecutiveMetricCard
              key={idx}
              label={ExecutiveLabelResolver.resolve(metric, t)}
              value={
                <div className="flex flex-col gap-1 items-start w-full">
                  <span className={isNumeric ? "text-[28px] font-semibold leading-none" : "text-[24px] md:text-[26px] font-semibold leading-tight"}>
                    {mainValueFormatted}
                  </span>
                  {metric === 'Equity Quality Index' && ind.evidence?.capitalConsumedAmount && (
                    <span className="text-[11px] font-semibold text-foreground/50 leading-none mt-1">
                      {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(ind.evidence.capitalConsumedAmount)}
                    </span>
                  )}
                </div>
              }
              description={ind.rationale}
              tone={tone}
              variant="transparent"
              className="bg-surface-container/30"
              statusBadge={
                ind.value !== ind.classification ? (
                  <span className={cn("text-[10px] font-semibold uppercase tracking-widest px-2.5 py-0.5 rounded-full border whitespace-nowrap", 
                    isCrit ? 'bg-critical-soft text-critical-foreground border-critical/20' : 
                    isWarn ? 'bg-warning-soft text-warning-foreground border-warning/20' : 
                    'bg-success-soft text-success-foreground border-success/20'
                  )}>
                    {ExecutiveLabelResolver.resolve(ind.classification, t)}
                  </span>
                ) : undefined
              }
            />
          );
        })}
      </div>
    </ExecutiveSurface>
  );
};
