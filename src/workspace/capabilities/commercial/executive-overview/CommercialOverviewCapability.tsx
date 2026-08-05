import React from 'react';
import { ExecutiveContext } from '../../../context/executive-context.types';
import { useCommercialExecutiveSummary } from '../../../data/adapters/commercial-intelligence.adapter';

interface CommercialOverviewCapabilityProps {
  context: ExecutiveContext;
}

export const CommercialOverviewCapability: React.FC<CommercialOverviewCapabilityProps> = ({ context }) => {
  const { data, loading } = useCommercialExecutiveSummary(context);

  if (loading) return <div className="p-8 text-slate-400">Processando Inteligência Comercial...</div>;
  if (!data) return null;

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <header className="mb-8">
        <h1 className="text-2xl font-semibold text-slate-100 tracking-tight">Commercial Overview</h1>
        <p className="text-slate-400 text-sm mt-1">Commercial Office</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h3 className="text-sm font-medium text-slate-500 uppercase tracking-widest mb-2">Health Score</h3>
          <div className="text-5xl font-light text-slate-100 mt-4">
            {data.healthScore}
          </div>
          <div className="text-sm text-slate-400 mt-2">Overall Health (0-100)</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h3 className="text-sm font-medium text-slate-500 uppercase tracking-widest mb-2">Commercial Risks</h3>
          <ul className="mt-4 space-y-2">
            {data.commercialRisks.map((risk, idx) => (
              <li key={idx} className="flex items-start">
                <span className="text-red-500 mr-2">•</span>
                <span className="text-sm text-slate-200">{risk}</span>
              </li>
            ))}
            {data.commercialRisks.length === 0 && (
              <li className="text-sm text-slate-400 italic">No critical risks identified.</li>
            )}
          </ul>
        </div>
      </div>
      
      {data.criticalInsights && data.criticalInsights.length > 0 && (
        <section className="mt-8 space-y-4">
          <h3 className="text-sm font-medium text-slate-500 uppercase tracking-widest">Executive Insights</h3>
          {data.criticalInsights.map((insight: any, idx: number) => (
            <div key={idx} className="p-4 bg-slate-800/50 border border-slate-700/50 rounded-lg">
              <h4 className="font-medium text-slate-200 mb-1">{insight.title}</h4>
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
