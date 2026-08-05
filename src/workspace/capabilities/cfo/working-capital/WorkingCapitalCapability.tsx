import React from 'react';
import { ExecutiveContext } from '../../../context/executive-context.types';
import { useCfoWorkingCapital } from '../../../data/adapters/cfo-intelligence.adapter';
import { ShieldCheck, Activity, Target, ShieldAlert, ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface WorkingCapitalCapabilityProps {
  context: ExecutiveContext;
}

export const WorkingCapitalCapability: React.FC<WorkingCapitalCapabilityProps> = ({ context }) => {
  const { data, loading, error } = useCfoWorkingCapital(context);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-slate-400 font-light flex items-center gap-3">
          <Activity className="w-5 h-5 animate-pulse text-amber-500" />
          Carregando Working Capital Engine...
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="p-6 bg-red-900/20 border border-red-500/20 rounded-xl text-red-400">
        Não foi possível carregar as métricas de Capital de Giro no momento.
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="flex items-center justify-between pb-6 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-light text-slate-100 flex items-center gap-3">
            <Target className="w-6 h-6 text-amber-500" />
            Working Capital Intelligence
          </h1>
          <p className="text-slate-400 mt-2 font-light">
            Otimização do ciclo de caixa, contas a receber e contas a pagar.
          </p>
        </div>
      </header>

      <section className="bg-slate-900 border border-slate-800 rounded-xl p-6">
        <h2 className="text-sm font-medium text-slate-500 uppercase tracking-widest mb-4">Executive Insight</h2>
        <p className="text-lg text-slate-200 leading-relaxed font-light">
          O ciclo de conversão de caixa (CCC) está atualmente em <span className="font-semibold">{data.cashConversionCycle.cycleDays} dias</span>.
          O risco de inadimplência (Aging Risk) tem severidade classificada como <span className="font-semibold capitalize text-amber-400">{data.agingRisk.severity}</span>, 
          com exposição de {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: context.currency || 'BRL' }).format(data.agingRisk.exposure)}.
        </p>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h3 className="text-sm font-medium text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-2">
            <ArrowDownRight className="w-4 h-4 text-emerald-400" />
            Recebíveis
          </h3>
          <div className="text-3xl font-light text-slate-100">
            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: context.currency || 'BRL' }).format(data.receivables.totalOutstanding)}
          </div>
          <div className="text-sm text-slate-400 mt-2">DSO: {data.cashConversionCycle.dso} dias (Prazo Médio)</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h3 className="text-sm font-medium text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-2">
            <ArrowUpRight className="w-4 h-4 text-rose-400" />
            A Pagar
          </h3>
          <div className="text-3xl font-light text-slate-100">
            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: context.currency || 'BRL' }).format(data.payables.totalOutstanding)}
          </div>
          <div className="text-sm text-slate-400 mt-2">DPO: {data.cashConversionCycle.dpo} dias (Prazo Médio)</div>
        </div>
        
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h3 className="text-sm font-medium text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-2">
            <Activity className="w-4 h-4 text-amber-400" />
            Ciclo de Caixa (CCC)
          </h3>
          <div className="text-3xl font-light text-slate-100">
            {data.cashConversionCycle.cycleDays} dias
          </div>
          <div className="text-sm text-slate-400 mt-2">Giro de Estoque (DIO): {data.cashConversionCycle.dio} dias</div>
        </div>
        
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h3 className="text-sm font-medium text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-rose-400" />
            Atrasos / Overdue
          </h3>
          <div className="text-3xl font-light text-slate-100">
            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: context.currency || 'BRL' }).format(data.receivables.overdueAmount)}
          </div>
          <div className="text-sm text-slate-400 mt-2">Risco de Inadimplência: {data.agingRisk.severity}</div>
        </div>
      </div>
      
      {data.insights && data.insights.length > 0 && (
        <section className="mt-8 space-y-4">
          <h3 className="text-sm font-medium text-slate-500 uppercase tracking-widest flex items-center gap-2">
            <ShieldCheck className="w-4 h-4" />
            Ações e Recomendações
          </h3>
          {data.insights.map((insight: any, idx: number) => (
            <div key={idx} className="p-4 bg-slate-800/50 border border-slate-700/50 rounded-lg">
              <h4 className="font-medium text-slate-200">{insight.title}</h4>
              <p className="text-slate-300 mt-1 text-sm">{insight.narrative}</p>
              {insight.impact && <p className="text-amber-400/90 mt-2 text-sm">Impacto: {insight.impact}</p>}
              {insight.recommendation && <p className="text-emerald-400/90 mt-1 text-sm">Recomendação: {insight.recommendation}</p>}
            </div>
          ))}
        </section>
      )}
    </div>
  );
};
