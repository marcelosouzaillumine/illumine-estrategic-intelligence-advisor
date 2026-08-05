import React from 'react';
import { ExecutiveContext } from '../../../context/executive-context.types';
import { usePipelineIntelligence } from '../../../data/adapters/commercial-intelligence.adapter';

interface PipelineIntelligenceCapabilityProps {
  context: ExecutiveContext;
}

export const PipelineIntelligenceCapability: React.FC<PipelineIntelligenceCapabilityProps> = ({ context }) => {
  const { data, loading } = usePipelineIntelligence(context);

  if (loading) return <div className="p-8 text-slate-400">Processando Inteligência de Pipeline...</div>;
  if (!data) return null;

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <header className="mb-8">
        <h1 className="text-2xl font-semibold text-slate-100 tracking-tight">Pipeline Intelligence</h1>
        <p className="text-slate-400 text-sm mt-1">Commercial Office</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h3 className="text-sm font-medium text-slate-500 uppercase tracking-widest mb-2">Total Pipeline Value</h3>
          <div className="text-4xl font-light text-slate-100 mt-4">
            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(data.pipeline.totalValue)}
          </div>
          <div className="text-sm text-slate-400 mt-2 flex justify-between">
            <span>Weighted Value: {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(data.pipeline.weightedValue)}</span>
            <span className={data.pipeline.coverageRatio < 2.5 ? 'text-red-400' : 'text-emerald-400'}>
              {(data.pipeline.coverageRatio).toFixed(1)}x Coverage
            </span>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h3 className="text-sm font-medium text-slate-500 uppercase tracking-widest mb-2">Pipeline Efficiency</h3>
          <div className="text-4xl font-light text-slate-100 mt-4">
            {(data.efficiency.conversionRate * 100).toFixed(1)}% <span className="text-xl">Win Rate</span>
          </div>
          <div className="text-sm text-slate-400 mt-2">
            Average Sales Cycle: {data.efficiency.averageSalesCycle} days
          </div>
        </div>
      </div>
      
      {data.insights && data.insights.length > 0 && (
        <section className="mt-8 space-y-4">
          <h3 className="text-sm font-medium text-slate-500 uppercase tracking-widest">Executive Insights</h3>
          {data.insights.map((insight: any, idx: number) => (
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
