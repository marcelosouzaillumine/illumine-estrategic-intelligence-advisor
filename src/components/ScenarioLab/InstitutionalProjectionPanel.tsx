import React from 'react';
import { Activity, Clock, ShieldAlert } from 'lucide-react';
import { cn } from '../../lib/utils';


interface Props {
  output: any;
}

export function InstitutionalProjectionPanel({ output }: Props) {
  
  const { 
    projectedRunwayMonths, 
    cashFlowOutput,
    causalOutput
  } = output;
  
  const runwayClass = projectedRunwayMonths < 3 ? 'text-rose-600 bg-critical-soft border-rose-200' 
                    : projectedRunwayMonths < 6 ? 'text-amber-600 bg-warning-soft border-amber-200'
                    : 'text-emerald-600 bg-success-soft border-emerald-200';

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      {/* RUNWAY PROJETADO */}
      <div className={cn("rounded-2xl border p-5 shadow-sm flex flex-col justify-between", runwayClass)}>
        <div className="flex items-center gap-2 mb-2">
          <Clock size={16} />
          <h3 className="text-xs font-black uppercase tracking-widest opacity-80">Runway Projetado</h3>
        </div>
        <div>
          <span className="text-3xl font-black">
            {projectedRunwayMonths === 999 ? '> 36' : projectedRunwayMonths.toFixed(1)}
          </span>
          <span className="text-sm font-bold ml-1 opacity-80">meses</span>
        </div>
        <p className="text-xs mt-2 font-medium opacity-80 line-clamp-2">
          {cashFlowOutput.runway.classification}
        </p>
      </div>
      
      {/* QUALIDADE DO CAIXA */}
      <div className="bg-slate-50 border border-border rounded-2xl p-5 shadow-sm">
        <div className="flex items-center gap-2 mb-2 text-muted-foreground">
          <Activity size={16} />
          <h3 className="text-xs font-black uppercase tracking-widest">Qualidade do Caixa</h3>
        </div>
        <div className="text-lg font-black text-muted-foreground truncate">
          {cashFlowOutput.cashQuality.classification.replace(/_/g, ' ')}
        </div>
        <div className="mt-2 text-xs font-medium text-muted-foreground">
          Dependência: {cashFlowOutput.financialDependency.classification.toUpperCase()}
        </div>
      </div>

      {/* CONTINUIDADE */}
      <div className="bg-slate-900 border border-border rounded-2xl p-5 shadow-sm text-white">
        <div className="flex items-center gap-2 mb-2 text-primary">
          <ShieldAlert size={16} />
          <h3 className="text-xs font-black uppercase tracking-widest">Resiliência</h3>
        </div>
        <div className="text-lg font-black truncate">
          Score Causal: N/A
        </div>
        <div className="mt-2 text-xs font-medium text-muted-foreground truncate">
          Causalidade Extraída
        </div>
      </div>
    </div>
  );
}
