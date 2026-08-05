import React from 'react';
import { ExecutiveContext } from '../../../context/executive-context.types';
import { useInnovationExecutiveSummary } from '../../../data/adapters/innovation-intelligence.adapter';

interface InnovationIntelligenceCapabilityProps {
  context: ExecutiveContext;
}

export const InnovationIntelligenceCapability: React.FC<InnovationIntelligenceCapabilityProps> = ({ context }) => {
  const { data, loading } = useInnovationExecutiveSummary(context);

  if (loading) return <div className="p-8 text-slate-400">Analisando Dependências de Inovação...</div>;
  if (!data) return null;

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <header className="mb-8">
        <h1 className="text-2xl font-semibold text-slate-100 tracking-tight">Innovation Intelligence & Dependencies</h1>
        <p className="text-slate-400 text-sm mt-1">Innovation Office</p>
      </header>

      {data.criticalInsights && data.criticalInsights.length > 0 && (
        <section className="space-y-4">
          <h3 className="text-sm font-medium text-slate-500 uppercase tracking-widest">Cross-Domain Executive Insights</h3>
          {data.criticalInsights.map((insight: any, idx: number) => (
            <div key={idx} className="p-4 bg-slate-800/50 border border-amber-900/50 rounded-lg">
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
              <p className="text-slate-400 text-sm mt-2">{insight.narrative}</p>
              
              <div className="mt-4 flex gap-4">
                <div className="flex-1 p-3 bg-slate-900/50 rounded border border-slate-700/30">
                  <p className="text-xs text-red-400/90 font-medium uppercase tracking-wider mb-1">Impact</p>
                  <p className="text-sm text-slate-300">{insight.impact}</p>
                </div>
                <div className="flex-1 p-3 bg-slate-900/50 rounded border border-slate-700/30">
                  <p className="text-xs text-emerald-400/90 font-medium uppercase tracking-wider mb-1">Recommendation</p>
                  <p className="text-sm text-slate-300">{insight.recommendation}</p>
                </div>
              </div>
            </div>
          ))}
        </section>
      )}
    </div>
  );
};
