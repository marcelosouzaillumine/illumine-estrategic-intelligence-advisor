import React from 'react';
import { ExecutiveContext } from '../../../context/executive-context.types';
import { useRiskExecutiveSummary } from '../../../data/adapters/risk-intelligence.adapter';

interface RiskIntelligenceCapabilityProps {
  context: ExecutiveContext;
}

export const RiskIntelligenceCapability: React.FC<RiskIntelligenceCapabilityProps> = ({ context }) => {
  const { data, loading } = useRiskExecutiveSummary(context);

  if (loading) return <div className="p-8 text-slate-400">Analisando Inteligência de Risco Transversal...</div>;
  if (!data) return null;

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <header className="mb-8">
        <h1 className="text-2xl font-semibold text-slate-100 tracking-tight">Risk Intelligence (Appetite & Insights)</h1>
        <p className="text-slate-400 text-sm mt-1">Risk Office</p>
      </header>

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 mb-6">
        <h3 className="text-sm font-medium text-slate-500 uppercase tracking-widest mb-4">Risk Appetite Alignment</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 bg-slate-800/50 rounded-lg">
            <div className="text-sm text-slate-400 mb-1">Strategic Risk</div>
            <div className="text-lg font-medium text-emerald-400">{data.appetiteAlignment.strategicRiskStatus}</div>
          </div>
          <div className="p-4 bg-slate-800/50 rounded-lg">
            <div className="text-sm text-slate-400 mb-1">Regulatory Risk</div>
            <div className="text-lg font-medium text-red-400">{data.appetiteAlignment.regulatoryRiskStatus}</div>
          </div>
          <div className="p-4 bg-slate-800/50 rounded-lg">
            <div className="text-sm text-slate-400 mb-1">Financial Risk</div>
            <div className="text-lg font-medium text-amber-400">{data.appetiteAlignment.financialRiskStatus}</div>
          </div>
          <div className="p-4 bg-slate-800/50 rounded-lg">
            <div className="text-sm text-slate-400 mb-1">Operational Risk</div>
            <div className="text-lg font-medium text-red-400">{data.appetiteAlignment.operationalRiskStatus}</div>
          </div>
        </div>
      </div>

      {data.criticalInsights && data.criticalInsights.length > 0 && (
        <section className="space-y-4">
          <h3 className="text-sm font-medium text-slate-500 uppercase tracking-widest">Executive Insights & Dependencies</h3>
          {data.criticalInsights.map((insight: any, idx: number) => (
            <div key={idx} className="p-4 bg-slate-800/50 border border-red-900/50 rounded-lg">
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
                  <p className="text-xs text-amber-400/90 font-medium uppercase tracking-wider mb-1">Recommendation</p>
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
