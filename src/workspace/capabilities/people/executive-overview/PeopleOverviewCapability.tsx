import React from 'react';
import { ExecutiveContext } from '../../../context/executive-context.types';
import { usePeopleExecutiveSummary } from '../../../data/adapters/people-intelligence.adapter';

interface PeopleOverviewCapabilityProps {
  context: ExecutiveContext;
}

export const PeopleOverviewCapability: React.FC<PeopleOverviewCapabilityProps> = ({ context }) => {
  const { data, loading } = usePeopleExecutiveSummary(context);

  if (loading) return <div className="p-8 text-slate-400">Processando Inteligência de Pessoas...</div>;
  if (!data) return null;

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <header className="mb-8">
        <h1 className="text-2xl font-semibold text-slate-100 tracking-tight">People & Organization Overview</h1>
        <p className="text-slate-400 text-sm mt-1">People Office • Maturity: <span className="text-emerald-400">{data.maturityLevel}</span></p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h3 className="text-sm font-medium text-slate-500 uppercase tracking-widest mb-2">People Health Score</h3>
          <div className="text-4xl font-light text-slate-100 mt-4 flex items-baseline gap-2">
            {data.healthScore} <span className="text-lg text-slate-500">/ 100</span>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h3 className="text-sm font-medium text-slate-500 uppercase tracking-widest mb-2">Capacity Utilization</h3>
          <div className="text-4xl font-light text-amber-400 mt-4">
            {(data.capacityUtilization * 100).toFixed(1)}%
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h3 className="text-sm font-medium text-slate-500 uppercase tracking-widest mb-2">eNPS</h3>
          <div className="text-4xl font-light text-slate-100 mt-4">
            {data.eNPS}
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h3 className="text-sm font-medium text-slate-500 uppercase tracking-widest mb-2">Labor Cost %</h3>
          <div className="text-4xl font-light text-slate-100 mt-4">
            {(data.laborCostPercentage * 100).toFixed(1)}%
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h3 className="text-sm font-medium text-slate-500 uppercase tracking-widest mb-4">Critical Bottlenecks</h3>
          <ul className="space-y-3">
            {data.topBottlenecks.map((bottleneck, idx) => (
              <li key={idx} className="flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-red-400" />
                <span className="text-slate-200">{bottleneck}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h3 className="text-sm font-medium text-slate-500 uppercase tracking-widest mb-4">Critical Risks</h3>
          <ul className="space-y-3">
            {data.criticalRisks.map((risk, idx) => (
              <li key={idx} className="flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-amber-400" />
                <span className="text-slate-200">{risk}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      
      {data.criticalInsights && data.criticalInsights.length > 0 && (
        <section className="mt-8 space-y-4">
          <h3 className="text-sm font-medium text-slate-500 uppercase tracking-widest">Executive Insights</h3>
          {data.criticalInsights.map((insight: any, idx: number) => (
            <div key={idx} className="p-4 bg-slate-800/50 border border-slate-700/50 rounded-lg">
              <div className="flex justify-between items-start mb-1">
                <h4 className="font-medium text-slate-200">{insight.title}</h4>
                {insight.relatedOffices && (
                  <div className="flex gap-2">
                    {insight.relatedOffices.map((office: string) => (
                      <span key={office} className="px-2 py-0.5 rounded bg-slate-700 text-xs font-medium uppercase text-slate-300">
                        {office}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <p className="text-slate-400 text-sm">{insight.narrative}</p>
              <div className="mt-3 p-3 bg-slate-900/50 rounded border border-slate-700/30">
                <p className="text-xs text-amber-400/90 font-medium uppercase tracking-wider mb-1">Recommendation</p>
                <p className="text-sm text-slate-300">{insight.recommendation}</p>
              </div>
            </div>
          ))}
        </section>
      )}
    </div>
  );
};
