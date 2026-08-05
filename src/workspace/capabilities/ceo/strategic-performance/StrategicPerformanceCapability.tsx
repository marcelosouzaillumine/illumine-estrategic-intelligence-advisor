import React from 'react';
import { ExecutiveContext } from '../../../context/executive-context.types';
import { useCeoStrategicPerformance } from '../../../data/adapters/ceo-intelligence.adapter';
import { Target, Activity, ShieldAlert, Zap } from 'lucide-react';

export const StrategicPerformanceCapability: React.FC<{ context: ExecutiveContext }> = ({ context }) => {
  const { data, loading, error } = useCeoStrategicPerformance(context);

  if (loading) return <div className="p-8 text-slate-400">Carregando Strategic Performance...</div>;
  if (error || !data) return <div className="p-8 text-rose-400">Erro ao carregar dados estratégicos.</div>;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="flex items-center justify-between pb-6 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-light text-slate-100 flex items-center gap-3">
            <Target className="w-6 h-6 text-indigo-400" />
            Strategic Performance
          </h1>
          <p className="text-slate-400 mt-2 font-light">Evolução do plano de negócios e desempenho frente às metas.</p>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h3 className="text-sm font-medium text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-2">
            <Activity className="w-4 h-4 text-emerald-400" />
            Business Score
          </h3>
          <div className="text-3xl font-light text-slate-100">{data.businessEvolution.score}</div>
          <div className="text-sm text-slate-400 mt-2 capitalize">{data.businessEvolution.trend}</div>
        </div>
        
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h3 className="text-sm font-medium text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-2">
            <Target className="w-4 h-4 text-indigo-400" />
            Metas
          </h3>
          <div className="text-3xl font-light text-slate-100">{data.strategicGoals.onTrack} / {data.strategicGoals.total}</div>
          <div className="text-sm text-slate-400 mt-2">On Track</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h3 className="text-sm font-medium text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-amber-400" />
            Em Risco
          </h3>
          <div className="text-3xl font-light text-slate-100">{data.strategicGoals.atRisk}</div>
          <div className="text-sm text-slate-400 mt-2">Atenção requerida</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h3 className="text-sm font-medium text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-2">
            <Zap className="w-4 h-4 text-rose-400" />
            Críticos
          </h3>
          <div className="text-3xl font-light text-slate-100">{data.strategicGoals.critical}</div>
          <div className="text-sm text-slate-400 mt-2">Risco de execução</div>
        </div>
      </div>
      
      {data.insights && data.insights.length > 0 && (
        <section className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h3 className="text-sm font-medium text-slate-500 uppercase tracking-widest mb-4">Strategic Insights</h3>
          <div className="space-y-4">
            {data.insights.map((insight: any) => (
              <div key={insight.id} className="p-4 bg-slate-800/50 rounded-lg">
                <h4 className="font-medium text-slate-200">{insight.title}</h4>
                <p className="text-slate-300 mt-1">{insight.narrative}</p>
                {insight.impact && <p className="text-amber-400/90 mt-2 text-sm">Impacto: {insight.impact}</p>}
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
