import React from 'react';
import { ExecutiveContext } from '../../../context/executive-context.types';
import { useCeoGrowthIntelligence } from '../../../data/adapters/ceo-intelligence.adapter';
import { TrendingUp, Users, Map, Key } from 'lucide-react';

export const GrowthIntelligenceCapability: React.FC<{ context: ExecutiveContext }> = ({ context }) => {
  const { data, loading, error } = useCeoGrowthIntelligence(context);

  if (loading) return <div className="p-8 text-slate-400">Carregando Growth Intelligence...</div>;
  if (error || !data) return <div className="p-8 text-rose-400">Erro ao carregar dados de crescimento.</div>;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="flex items-center justify-between pb-6 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-light text-slate-100 flex items-center gap-3">
            <TrendingUp className="w-6 h-6 text-indigo-400" />
            Growth Intelligence
          </h1>
          <p className="text-slate-400 mt-2 font-light">Performance comercial e alavancas de crescimento.</p>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h3 className="text-sm font-medium text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-emerald-400" />
            Crescimento de Receita
          </h3>
          <div className="text-3xl font-light text-slate-100">{data.revenueGrowth.value}%</div>
          <div className="text-sm text-slate-400 mt-2">Meta: {data.revenueGrowth.target}% (Variance: {data.revenueGrowth.variance}%)</div>
        </div>
        
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h3 className="text-sm font-medium text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-2">
            <Users className="w-4 h-4 text-indigo-400" />
            Novos Clientes
          </h3>
          <div className="text-3xl font-light text-slate-100">{data.customerGrowth.newClients}</div>
          <div className="text-sm text-slate-400 mt-2">Churn: {data.customerGrowth.churnRate}%</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h3 className="text-sm font-medium text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-2">
            <Map className="w-4 h-4 text-amber-400" />
            Market Share
          </h3>
          <div className="text-3xl font-light text-slate-100">{data.marketExpansion.marketShare}%</div>
          <div className="text-sm text-slate-400 mt-2">Penetração: {data.marketExpansion.penetrationRate}%</div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <section className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h3 className="text-sm font-medium text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
            <Key className="w-4 h-4 text-indigo-400" />
            Growth Drivers
          </h3>
          <ul className="space-y-2 text-slate-300">
            {data.growthDrivers.map((driver, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-indigo-400 mt-1">•</span> {driver}
              </li>
            ))}
          </ul>
        </section>
        <section className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h3 className="text-sm font-medium text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
            <Key className="w-4 h-4 text-rose-400" />
            Growth Constraints
          </h3>
          <ul className="space-y-2 text-slate-300">
            {data.growthConstraints.map((constraint, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-rose-400 mt-1">•</span> {constraint}
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
};
