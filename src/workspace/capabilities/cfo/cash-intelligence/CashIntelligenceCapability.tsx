import React from 'react';
import { useCfoCashIntelligence } from '../../../data/adapters/cfo-intelligence.adapter';
import { ExecutiveContext } from '../../../context/executive-context.types';

interface CashIntelligenceCapabilityProps {
  context: ExecutiveContext;
}

export const CashIntelligenceCapability: React.FC<CashIntelligenceCapabilityProps> = ({ context }) => {
  const { data, loading, error } = useCfoCashIntelligence(context);

  if (loading) return <div className="p-8 text-slate-400">Processando Inteligência de Caixa...</div>;
  if (error) return <div className="p-8 text-red-500">Erro ao carregar inteligência de caixa: {error.message}</div>;
  if (!data) return null;

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <header className="mb-8">
        <h1 className="text-2xl font-semibold text-slate-100 tracking-tight">Cash Intelligence</h1>
        <p className="text-slate-400 text-sm mt-1">CFO Office</p>
      </header>

      <section className="bg-slate-900 border border-slate-800 rounded-xl p-6">
        <h2 className="text-sm font-medium text-slate-500 uppercase tracking-widest mb-4">Executive Insight</h2>
        <p className="text-lg text-slate-200 leading-relaxed font-light">
          O risco de liquidez atual é classificado como <span className="font-semibold">{data.liquidity.risk}</span>.
          Temos {data.liquidity.runwayDays} dias de runway projetados.
        </p>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h3 className="text-sm font-medium text-slate-500 uppercase tracking-widest mb-2">Free Cash Flow</h3>
          <div className="text-3xl font-light text-slate-100">
            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: context.currency || 'BRL' }).format(data.freeCashFlow.value)}
          </div>
          <div className="text-sm text-slate-400 mt-2">Trend: {data.freeCashFlow.trend}</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h3 className="text-sm font-medium text-slate-500 uppercase tracking-widest mb-2">Runway Days</h3>
          <div className="text-3xl font-light text-slate-100">
            {data.liquidity.runwayDays}
          </div>
        </div>
      </div>
      
      {data.insights && data.insights.length > 0 && (
        <section className="mt-8 space-y-4">
          <h3 className="text-sm font-medium text-slate-500 uppercase tracking-widest">Recomendações de Liquidez</h3>
          {data.insights.map((insight: any, idx: number) => (
            <div key={idx} className="p-4 bg-slate-800/50 border border-slate-700/50 rounded-lg">
              <p className="text-slate-300">{insight.description}</p>
            </div>
          ))}
        </section>
      )}
    </div>
  );
};
