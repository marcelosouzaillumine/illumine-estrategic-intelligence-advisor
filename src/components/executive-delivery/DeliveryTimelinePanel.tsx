import React from 'react';
import { Calendar, TrendingUp, AlertCircle } from 'lucide-react';
import { ExecutiveIntelligenceReport } from '../../services/FiduciaryRuntimeAdapter';
import { cn } from '../../lib/utils';

interface DeliveryTimelinePanelProps {
  report: ExecutiveIntelligenceReport;
  className?: string;
}

export function DeliveryTimelinePanel({ report, className }: DeliveryTimelinePanelProps) {
  if (!report) return null;

  const trendSignals = report.temporalCausality?.trendSignals || [];
  const inflectionPoints = report.temporalCausality?.inflectionPoints || [];

  return (
    <div className={cn("bg-white border border-border rounded-[32px] p-6 shadow-sm", className)}>
      <div className="flex items-center gap-2 mb-6">
        <Calendar className="text-muted-foreground" size={18} />
        <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Evolução Temporal & Sinais de Tendência</span>
      </div>

      {trendSignals.length === 0 && inflectionPoints.length === 0 ? (
        <div className="py-8 text-center text-xs font-medium text-muted-foreground italic">
          Nenhum sinal temporal encontrado nos registros históricos do runtime.
        </div>
      ) : (
        <div className="space-y-6">
          {/* Trend Signals */}
          {trendSignals.length > 0 && (
            <div className="space-y-3">
              <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest block mb-2">Sinais de Tendência Longitudinal</span>
              <div className="relative border-l-2 border-border ml-3 pl-4 space-y-4">
                {trendSignals.map((signal, idx) => (
                  <div key={idx} className="relative">
                    {/* Timeline marker */}
                    <div className="absolute -left-[25px] top-1 w-3 h-3 rounded-full border border-primary bg-white flex items-center justify-center">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-muted-foreground">{signal.indicator}</span>
                        <span className={cn(
                          "text-[9px] px-2 py-0.5 rounded font-black uppercase tracking-wider",
                          signal.isFavorable ? "bg-success-soft text-emerald-700 border border-emerald-100" : "bg-critical-soft text-rose-700 border border-rose-100"
                        )}>
                          {signal.direction}
                        </span>
                      </div>
                      <p className="text-[11px] font-semibold text-muted-foreground mt-1 leading-normal">
                        {signal.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Inflection Points */}
          {inflectionPoints.length > 0 && (
            <div className="pt-4 border-t border-border space-y-3">
              <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest block mb-2">Pontos de Inflexão Histórica</span>
              <div className="grid grid-cols-1 gap-3">
                {inflectionPoints.map((inf, idx) => (
                  <div key={idx} className="p-3 bg-slate-50 border border-border rounded-xl flex items-start gap-2">
                    <TrendingUp className="text-primary shrink-0 mt-0.5" size={14} />
                    <div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-xs font-bold text-muted-foreground">{inf.indicator}</span>
                        <span className="text-[9px] text-muted-foreground font-bold">Período: {inf.period}</span>
                      </div>
                      <p className="text-[10px] font-semibold text-muted-foreground mt-0.5 leading-normal">
                        {inf.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
