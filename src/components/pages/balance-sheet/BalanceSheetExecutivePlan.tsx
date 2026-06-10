import React from 'react';

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
    <div className="bg-card rounded-[40px] p-10 shadow-xl shadow-slate-200/30 hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-500 border border-border flex flex-col justify-center relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-surface-container/30 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
      <h3 className="text-2xl font-black text-primary mb-6 relative z-10">Plano Executivo Consolidado</h3>
      
      <div className="relative z-10">
        {executivePlan && executivePlan.includes('|') ? (
          <div className="border-l-4 rounded-r-3xl rounded-l-md p-8 flex flex-col shadow-sm transition-all hover:shadow-md bg-surface-container/30 border-accent">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 border-b border-primary pb-4 gap-4">
              <div>
                <h4 className="text-[10px] font-black uppercase tracking-widest text-primary mb-2">Prioridade Estratégica</h4>
                <div className="flex items-center gap-3">
                  <span className={"text-sm font-black uppercase tracking-widest px-3 py-1 rounded-full border " + 
                    (executiveInterpretation?.strategicSeverity === 'CRITICAL' ? 'bg-rose-100 text-rose-700 border-rose-200' :
                     executiveInterpretation?.strategicSeverity === 'HIGH' ? 'bg-amber-100 text-amber-700 border-amber-200' :
                     executiveInterpretation?.strategicSeverity === 'MODERATE' ? 'bg-yellow-100 text-yellow-700 border-yellow-200' :
                     'bg-emerald-100 text-emerald-700 border-emerald-200')
                  }>
                    {executiveInterpretation?.strategicSeverity === 'CRITICAL' ? '🔴 CRÍTICA' :
                     executiveInterpretation?.strategicSeverity === 'HIGH' ? '🟠 ALTA' :
                     executiveInterpretation?.strategicSeverity === 'MODERATE' ? '🟡 MODERADA' : '🟢 MONITORAMENTO'}
                  </span>
                  <span className="text-lg font-bold text-primary">
                    {dominantRiskFamily || 'Diretriz Estratégica'}
                  </span>
                </div>
              </div>
              <div className="bg-card px-4 py-2 rounded-xl border border-border shadow-sm text-right">
                <span className="block text-[9px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Motivo Principal</span>
                <span className="text-sm font-bold text-muted-foreground">{executiveInterpretation?.strategicSeverityReason || 'Análise Executiva'}</span>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-6">
              {[
                { title: 'Financeiro', plan: executiveInterpretation?.planFinanceiro },
                { title: 'Operacional', plan: executiveInterpretation?.planOperacional },
                { title: 'Governança', plan: executiveInterpretation?.planGovernanca }
              ].map((frente, i) => {
                if (!frente.plan) return null;
                return (
                  <div key={i} className="bg-card p-6 rounded-3xl border border-border shadow-md shadow-slate-200/30 hover:shadow-lg hover:shadow-slate-200/50 hover:-translate-y-1 transition-all duration-300 flex flex-col group">
                    <h5 className="text-[10px] font-black uppercase tracking-widest text-primary mb-4">{frente.title}</h5>
                    <span className="inline-block self-start px-3 py-1.5 bg-accent group-hover:bg-accent text-accent rounded-lg text-[9px] font-black uppercase tracking-widest mb-4 transition-colors">
                      {frente.plan.prazo}
                    </span>
                    <p className="text-secondary">
                      {frente.plan.acao}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <p className="text-secondary">{executivePlan}</p>
        )}
      </div>
    </div>
  );
};
