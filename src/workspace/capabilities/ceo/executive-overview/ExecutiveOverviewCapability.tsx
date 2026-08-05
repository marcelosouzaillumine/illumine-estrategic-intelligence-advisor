import React from 'react';
import { ExecutiveContext } from '../../../context/executive-context.types';
import { useCeoExecutiveSummary } from '../../../data/adapters/ceo-intelligence.adapter';
import { LayoutDashboard, CheckCircle, AlertTriangle, AlertCircle, TrendingUp } from 'lucide-react';

export const ExecutiveOverviewCapability: React.FC<{ context: ExecutiveContext }> = ({ context }) => {
  const { data, loading, error } = useCeoExecutiveSummary(context);

  if (loading) return <div className="p-8 text-slate-400">Carregando Executive Overview...</div>;
  if (error || !data) return <div className="p-8 text-rose-400">Erro ao carregar dados executivos.</div>;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="flex items-center justify-between pb-6 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-light text-slate-100 flex items-center gap-3">
            <LayoutDashboard className="w-6 h-6 text-indigo-400" />
            Executive Overview
          </h1>
          <p className="text-slate-400 mt-2 font-light">Health Score, insights e decisões estratégicas imediatas.</p>
        </div>
      </header>

      <section className="bg-slate-900 border border-slate-800 rounded-xl p-6 flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h2 className="text-sm font-medium text-slate-500 uppercase tracking-widest mb-1">Corporate Health Score</h2>
          <p className="text-4xl font-light text-slate-100">{data.overallHealthScore}/100</p>
        </div>
        <div className="mt-4 md:mt-0 px-4 py-2 bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 rounded-lg text-sm">
          A saúde geral corporativa está no quartil superior.
        </div>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h3 className="text-sm font-medium text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-400" />
            Critical Insights
          </h3>
          <div className="space-y-3">
            {data.criticalInsights.map(insight => (
              <div key={insight.id} className="p-3 bg-slate-800/50 rounded-lg">
                <p className="font-medium text-slate-200">{insight.title}</p>
                <p className="text-sm text-slate-400">{insight.narrative}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h3 className="text-sm font-medium text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-400" />
            Decisões Requeridas
          </h3>
          <div className="space-y-3">
            {data.decisionsRequired.map(decision => (
              <div key={decision.id} className="p-3 bg-slate-800/50 border-l-2 border-emerald-500 rounded-r-lg">
                <p className="font-medium text-slate-200">{decision.title}</p>
                <p className="text-sm text-slate-400">{decision.context}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
