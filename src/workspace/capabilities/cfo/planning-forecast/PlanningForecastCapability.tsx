import React from 'react';
import { useCfoPlanning } from '../../../data/adapters/cfo-intelligence.adapter';
import { ExecutiveContext } from '../../../context/executive-context.types';

interface PlanningForecastCapabilityProps {
  context: ExecutiveContext;
}

export const PlanningForecastCapability: React.FC<PlanningForecastCapabilityProps> = ({ context }) => {
  const { data, loading, error } = useCfoPlanning(context);

  if (loading) return <div className="p-8 text-slate-400">Processando Inteligência de Planejamento...</div>;
  if (error) return <div className="p-8 text-red-500">Erro ao carregar planejamento: {error.message}</div>;
  if (!data) return null;

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <header className="mb-8">
        <h1 className="text-2xl font-semibold text-slate-100 tracking-tight">Planning & Forecast</h1>
        <p className="text-slate-400 text-sm mt-1">CFO Office</p>
      </header>

      <section className="bg-slate-900 border border-slate-800 rounded-xl p-6">
        <h2 className="text-sm font-medium text-slate-500 uppercase tracking-widest mb-4">Executive Insight</h2>
        <p className="text-lg text-slate-200 leading-relaxed font-light">
          O desvio orçamentário atual é de <span className="font-semibold text-red-400">{data.budgetVariance.percentage}%</span>.
          O forecast aponta para um alcance de {data.forecastVsTarget.percentage}% da meta global anual.
        </p>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h3 className="text-sm font-medium text-slate-500 uppercase tracking-widest mb-2">Budget Variance</h3>
          <div className="text-3xl font-light text-slate-100">
            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: context.currency || 'BRL' }).format(data.budgetVariance.value)}
          </div>
          <div className="text-sm text-slate-400 mt-2">{data.budgetVariance.percentage}% do previsto</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h3 className="text-sm font-medium text-slate-500 uppercase tracking-widest mb-2">Forecast Target</h3>
          <div className="text-3xl font-light text-slate-100">
            {data.forecastVsTarget.percentage}%
          </div>
        </div>
      </div>
      
      {data.insights && data.insights.length > 0 && (
        <section className="mt-8 space-y-4">
          <h3 className="text-sm font-medium text-slate-500 uppercase tracking-widest">Recomendações e Correções</h3>
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
