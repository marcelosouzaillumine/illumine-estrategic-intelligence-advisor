import React from 'react';
import { ExecutiveContext } from '../../../context/executive-context.types';
import { useCommercialPerformance } from '../../../data/adapters/commercial-intelligence.adapter';

interface CommercialPerformanceCapabilityProps {
  context: ExecutiveContext;
}

export const CommercialPerformanceCapability: React.FC<CommercialPerformanceCapabilityProps> = ({ context }) => {
  const { data, loading } = useCommercialPerformance(context);

  if (loading) return <div className="p-8 text-slate-400">Processando Desempenho Comercial...</div>;
  if (!data) return null;

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <header className="mb-8">
        <h1 className="text-2xl font-semibold text-slate-100 tracking-tight">Revenue Performance</h1>
        <p className="text-slate-400 text-sm mt-1">Commercial Office</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h3 className="text-sm font-medium text-slate-500 uppercase tracking-widest mb-2">Actual Revenue</h3>
          <div className="text-4xl font-light text-slate-100 mt-4">
            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(data.revenue.actual)}
          </div>
          <div className="text-sm text-slate-400 mt-2 flex justify-between">
            <span>Target: {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(data.revenue.target)}</span>
            <span className={data.revenue.yoyGrowth > 0 ? 'text-emerald-400' : 'text-red-400'}>
              {(data.revenue.yoyGrowth * 100).toFixed(1)}% YoY
            </span>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h3 className="text-sm font-medium text-slate-500 uppercase tracking-widest mb-2">Unit Economics</h3>
          <div className="space-y-4 mt-4">
            <div className="flex justify-between items-center border-b border-slate-800 pb-2">
              <span className="text-slate-400 text-sm">Average Ticket</span>
              <span className="text-slate-200">
                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(data.metrics.averageTicket)}
              </span>
            </div>
            <div className="flex justify-between items-center border-b border-slate-800 pb-2">
              <span className="text-slate-400 text-sm">Margin per Customer</span>
              <span className="text-slate-200">{(data.metrics.marginPerCustomer * 100).toFixed(1)}%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400 text-sm">Recurring Revenue</span>
              <span className="text-slate-200">{(data.metrics.recurringRevenueRatio * 100).toFixed(1)}%</span>
            </div>
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
