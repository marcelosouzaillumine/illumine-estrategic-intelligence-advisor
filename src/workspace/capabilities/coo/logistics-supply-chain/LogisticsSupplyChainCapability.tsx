import React from 'react';
import { ExecutiveContext } from '../../../context/executive-context.types';
import { useLogisticsSupplyChain } from '../../../data/adapters/coo-intelligence.adapter';

interface LogisticsSupplyChainCapabilityProps {
  context: ExecutiveContext;
}

export const LogisticsSupplyChainCapability: React.FC<LogisticsSupplyChainCapabilityProps> = ({ context }) => {
  const { data, loading } = useLogisticsSupplyChain(context);

  if (loading) return <div className="p-8 text-slate-400">Processando Inteligência Logística...</div>;
  if (!data) return null;

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <header className="mb-8">
        <h1 className="text-2xl font-semibold text-slate-100 tracking-tight">Logistics & Supply Chain Intelligence</h1>
        <p className="text-slate-400 text-sm mt-1">COO Office</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h3 className="text-sm font-medium text-slate-500 uppercase tracking-widest mb-2">OTIF (On Time In Full)</h3>
          <div className="text-4xl font-light text-slate-100 mt-4">
            {(data.metrics.otif * 100).toFixed(1)}%
          </div>
          <div className="text-sm text-slate-400 mt-2">
            SLA Compliance: <span className={data.metrics.slaCompliance < 0.95 ? 'text-red-400' : 'text-emerald-400'}>
              {(data.metrics.slaCompliance * 100).toFixed(1)}%
            </span>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h3 className="text-sm font-medium text-slate-500 uppercase tracking-widest mb-2">Transportation Cost</h3>
          <div className="text-4xl font-light text-slate-100 mt-4">
            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(data.metrics.transportationCost)}
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h3 className="text-sm font-medium text-slate-500 uppercase tracking-widest mb-2">Inventory Value</h3>
          <div className="text-4xl font-light text-slate-100 mt-4">
            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(data.metrics.inventoryValue)}
          </div>
          <div className="text-sm text-slate-400 mt-2">
            Distribution Risk: <span className="text-amber-400">{data.distributionRisk}</span>
          </div>
        </div>
      </div>

      {data.insights && data.insights.length > 0 && (
        <section className="mt-8 space-y-4">
          <h3 className="text-sm font-medium text-slate-500 uppercase tracking-widest">Logistics Insights</h3>
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
