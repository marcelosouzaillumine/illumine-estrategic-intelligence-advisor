import React from 'react';
import { ExecutiveSurface } from '../../ui/executive-surface';

export type ExecutivePlanAction = {
  prazo: string;
  acao: string;
};

export type BalanceSheetExecutivePlanProps = {
  executivePlan?: string;
  dominantRiskFamily?: string;
  executiveInterpretation?: {
    strategicSeverity?: string;
    strategicSeverityReason?: string;
    planFinanceiro?: ExecutivePlanAction;
    planOperacional?: ExecutivePlanAction;
    planGovernanca?: ExecutivePlanAction;
  };
};

export const BalanceSheetExecutivePlan = ({
  executivePlan,
  dominantRiskFamily,
  executiveInterpretation
}: BalanceSheetExecutivePlanProps) => {
  return (
    <ExecutiveSurface padding="none" className="rounded-[40px] p-10 shadow-xl shadow-slate-200/30 hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-500 flex flex-col items-start justify-start relative overflow-hidden w-full">
      <div className="absolute top-0 right-0 w-64 h-64 bg-surface-container/30 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
      <h3 className="text-2xl font-bold text-foreground mb-6 relative z-10">Plano Executivo Consolidado</h3>
      
      <div className="relative z-10 w-full flex flex-col items-start justify-start">
        {executivePlan && executivePlan.includes('|') ? (
          <div className="w-full border-l-4 rounded-r-3xl rounded-l-md p-8 flex flex-col items-start justify-start shadow-sm transition-all hover:shadow-md bg-surface-container/30 border-accent">
            <div className="w-full flex flex-col md:flex-row items-start justify-between mb-6 border-b border-border pb-4 gap-4">
              <div className="flex flex-col items-start justify-start">
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-foreground/70 mb-2">Prioridade Estratégica</h4>
                <div className="flex items-center gap-3">
                  <span className={"text-sm font-bold uppercase tracking-widest px-3 py-1 rounded-full border " + 
                    (executiveInterpretation?.strategicSeverity === 'CRITICAL' ? 'bg-rose-100 text-rose-700 border-rose-200' :
                     executiveInterpretation?.strategicSeverity === 'HIGH' ? 'bg-amber-100 text-amber-700 border-amber-200' :
                     executiveInterpretation?.strategicSeverity === 'MODERATE' ? 'bg-yellow-100 text-yellow-700 border-yellow-200' :
                     'bg-emerald-100 text-emerald-700 border-emerald-200')
                  }>
                    {executiveInterpretation?.strategicSeverity === 'CRITICAL' ? '🔴 CRÍTICA' :
                     executiveInterpretation?.strategicSeverity === 'HIGH' ? '🟠 ALTA' :
                     executiveInterpretation?.strategicSeverity === 'MODERATE' ? '🟡 MODERADA' : '🟢 MONITORAMENTO'}
                  </span>
                  <span className="text-lg font-bold text-foreground">
                    {dominantRiskFamily || 'Diretriz Estratégica'}
                  </span>
                </div>
              </div>
              <ExecutiveSurface padding="none" variant="default" elevation="sm" className="px-4 py-2 rounded-xl flex flex-col items-end justify-start text-right">
                <span className="block text-[9px] font-bold uppercase tracking-widest text-foreground/70 mb-1">Motivo Principal</span>
                <span className="text-sm font-bold text-foreground/75">{executiveInterpretation?.strategicSeverityReason || 'Análise Executiva'}</span>
              </ExecutiveSurface>
            </div>
            <div className="w-full grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-6">
              {[
                { title: 'Financeiro', plan: executiveInterpretation?.planFinanceiro },
                { title: 'Operacional', plan: executiveInterpretation?.planOperacional },
                { title: 'Governança', plan: executiveInterpretation?.planGovernanca }
              ].map((frente, i) => {
                if (!frente.plan) return null;
                return (
                  <ExecutiveSurface key={i} padding="none" className="p-6 rounded-3xl shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col items-start justify-start group">
                    <h5 className="text-[10px] font-bold uppercase tracking-widest text-foreground mb-4">{frente.title}</h5>
                    <ExecutiveSurface padding="none" variant="transparent" elevation="none" className="inline-block self-start px-3 py-1.5 rounded-lg mb-4 transition-colors bg-surface-container border border-border">
                      <span className="text-[9px] font-bold uppercase tracking-widest text-foreground/70">
                        {frente.plan.prazo}
                      </span>
                    </ExecutiveSurface>
                    <p className="text-sm font-semibold text-foreground/75 leading-relaxed">
                      {frente.plan.acao}
                    </p>
                  </ExecutiveSurface>
                );
              })}
            </div>
          </div>
        ) : (
          <p className="text-sm font-semibold text-foreground/75">{executivePlan}</p>
        )}
      </div>
    </ExecutiveSurface>
  );
};
