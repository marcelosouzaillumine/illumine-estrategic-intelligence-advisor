import React from 'react';
import { ExecutiveContext } from '../../../context/executive-context.types';
import { useCeoRiskOverview } from '../../../data/adapters/ceo-intelligence.adapter';
import { ShieldAlert, ShieldCheck, AlertTriangle } from 'lucide-react';

export const RiskOverviewCapability: React.FC<{ context: ExecutiveContext }> = ({ context }) => {
  const { data, loading, error } = useCeoRiskOverview(context);

  if (loading) return <div className="p-8 text-slate-400">Carregando Risk Overview...</div>;
  if (error || !data) return <div className="p-8 text-rose-400">Erro ao carregar dados de risco.</div>;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="flex items-center justify-between pb-6 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-light text-slate-100 flex items-center gap-3">
            <ShieldAlert className="w-6 h-6 text-indigo-400" />
            Risk & Opportunities
          </h1>
          <p className="text-slate-400 mt-2 font-light">Mapeamento de riscos e estratégias de mitigação ativas.</p>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h3 className="text-sm font-medium text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-2">
            Financeiro
          </h3>
          <div className="text-3xl font-light text-slate-100">{data.financialRisks.count}</div>
          <div className="text-sm text-slate-400 mt-2 capitalize text-amber-400">{data.financialRisks.level} Risk</div>
        </div>
        
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h3 className="text-sm font-medium text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-2">
            Operacional
          </h3>
          <div className="text-3xl font-light text-slate-100">{data.operationalRisks.count}</div>
          <div className="text-sm text-slate-400 mt-2 capitalize text-rose-400">{data.operationalRisks.level} Risk</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h3 className="text-sm font-medium text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-2">
            Estratégico
          </h3>
          <div className="text-3xl font-light text-slate-100">{data.strategicRisks.count}</div>
          <div className="text-sm text-slate-400 mt-2 capitalize text-rose-500">{data.strategicRisks.level} Risk</div>
        </div>
      </div>
      
      <section className="bg-slate-900 border border-slate-800 rounded-xl p-6 mt-8">
        <h3 className="text-sm font-medium text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-400" />
          Risk Heatmap
        </h3>
        <div className="space-y-3">
          {data.riskHeatmap.map((risk, idx) => (
            <div key={idx} className="p-4 bg-slate-800/50 rounded-lg flex items-start gap-4">
              <div className="flex-1">
                <p className="font-medium text-slate-200 capitalize">{risk.domain}</p>
                <p className="text-sm text-slate-400">{risk.description}</p>
              </div>
              <div className="text-right text-sm">
                <p className="text-slate-400">Probabilidade: <span className="text-amber-400 capitalize">{risk.probability}</span></p>
                <p className="text-slate-400">Impacto: <span className="text-rose-400 capitalize">{risk.impact}</span></p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {data.mitigationActions && data.mitigationActions.length > 0 && (
        <section className="bg-slate-900 border border-slate-800 rounded-xl p-6 mt-8">
          <h3 className="text-sm font-medium text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            Mitigation Actions
          </h3>
          <ul className="space-y-2 text-slate-300">
            {data.mitigationActions.map((action, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-emerald-400 mt-1">•</span> {action}
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
};
