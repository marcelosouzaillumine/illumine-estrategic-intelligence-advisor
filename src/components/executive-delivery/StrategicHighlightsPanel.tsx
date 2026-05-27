import React from 'react';
import { Target, CheckCircle2, Sparkles } from 'lucide-react';
import { ExecutiveIntelligenceReport } from '../../core/runtime/executive-intelligence-runtime';
import { cn, formatValue } from '../../lib/utils';

interface StrategicHighlightsPanelProps {
  report: ExecutiveIntelligenceReport;
  className?: string;
}

export function StrategicHighlightsPanel({ report, className }: StrategicHighlightsPanelProps) {
  if (!report) return null;

  const { metrics } = report;
  const kpis = metrics?.kpis || [];
  const efficiencies = metrics?.efficiencies || [];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Verde':
        return 'bg-emerald-50 text-emerald-700 border-emerald-100';
      case 'Amarelo':
        return 'bg-amber-50 text-amber-700 border-amber-100';
      case 'Vermelho':
        return 'bg-rose-50 text-rose-700 border-rose-100';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-100';
    }
  };

  const getEfficiencyColor = (color: string) => {
    switch (color) {
      case 'green':
      case 'emerald':
        return 'text-emerald-600 bg-emerald-50 border-emerald-100';
      case 'yellow':
      case 'amber':
        return 'text-amber-600 bg-amber-50 border-amber-100';
      case 'red':
      case 'rose':
        return 'text-rose-600 bg-rose-50 border-rose-100';
      default:
        return 'text-indigo-600 bg-indigo-50 border-indigo-100';
    }
  };

  return (
    <div className={cn("grid grid-cols-1 md:grid-cols-2 gap-6", className)}>
      
      {/* KPIs List */}
      <div className="bg-white border border-slate-200 rounded-[32px] p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-6">
          <Target className="text-slate-400" size={18} />
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Indicadores Operacionais (KPIs)</span>
        </div>

        {kpis.length === 0 ? (
          <div className="py-8 text-center text-xs font-medium text-slate-400 italic">
            Nenhum KPI declarado nesta execução.
          </div>
        ) : (
          <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
            {kpis.map((kpi, idx) => (
              <div 
                key={idx} 
                className="flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:border-slate-200 transition-all bg-slate-50/50"
              >
                <div>
                  <p className="text-xs font-bold text-slate-700">{kpi.name}</p>
                  <p className="text-[9px] text-slate-400 font-semibold mt-1">Tendência: {kpi.trend}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-black text-slate-900">
                    {formatValue(Number(kpi.val), kpi.unit)}
                  </span>
                  <span className={cn("text-[9px] px-2.5 py-1 rounded-full border font-black uppercase tracking-wider", getStatusColor(kpi.status))}>
                    {kpi.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Efficiencies & Optimizations */}
      <div className="bg-white border border-slate-200 rounded-[32px] p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-6">
          <Sparkles className="text-slate-400" size={18} />
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Eficiências Estruturais Detectadas</span>
        </div>

        {efficiencies.length === 0 ? (
          <div className="py-8 text-center text-xs font-medium text-slate-400 italic">
            Nenhuma eficiência declarada nesta execução.
          </div>
        ) : (
          <div className="space-y-4 max-h-[380px] overflow-y-auto pr-1">
            {efficiencies.map((eff, idx) => (
              <div 
                key={idx} 
                className={cn("p-4 rounded-2xl border flex gap-3 items-start", getEfficiencyColor(eff.color))}
              >
                <CheckCircle2 size={16} className="shrink-0 mt-0.5" />
                <div>
                  <div className="flex items-baseline justify-between gap-4">
                    <p className="text-xs font-black uppercase tracking-wider text-slate-800">{eff.name}</p>
                    <span className="text-xs font-black text-slate-900 shrink-0">
                      {eff.value}{eff.unit || '%'}
                    </span>
                  </div>
                  <p className="text-[11px] font-semibold text-slate-500 mt-1 leading-normal">
                    {eff.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
