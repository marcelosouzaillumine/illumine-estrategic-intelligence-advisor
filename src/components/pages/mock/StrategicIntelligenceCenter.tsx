import React from 'react';
import { Target, ShieldAlert, Cpu, Activity, BarChart, Globe, Zap } from 'lucide-react';
import { PageHeader } from '../../Common';

export function StrategicIntelligenceCenter() {
  return (
    <div className="max-w-[1440px] mx-auto px-6 lg:px-10 space-y-12 pb-32 animate-executive-fade">
      <PageHeader 
        title="Governance Center" 
        subtitle="Consolidação Institucional de Decisão, Risco e Valor (Orquestração Executiva)." 
        icon={Target} 
        transparent 
      />

      {/* Grid de Abas / Hubs (Simulado como Cards por simplicidade) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Hub: Financial Intelligence */}
        <div className="card-premium p-8 cursor-pointer group hover:border-slate-700 transition-all">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-400 group-hover:bg-emerald-500/20 transition-colors">
              <BarChart className="w-6 h-6" />
            </div>
            <h2 className="text-lg font-medium text-slate-200">Financial Intelligence</h2>
          </div>
          <p className="text-sm text-slate-400 leading-relaxed">
            Insights consolidados de capital, eficiência financeira e valor fiduciário.
          </p>
        </div>

        {/* Hub: Governance Intelligence */}
        <div className="card-premium p-8 cursor-pointer group hover:border-slate-700 transition-all">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-indigo-500/10 rounded-lg text-indigo-400 group-hover:bg-indigo-500/20 transition-colors">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <h2 className="text-lg font-medium text-slate-200">Governance Intelligence</h2>
          </div>
          <p className="text-sm text-slate-400 leading-relaxed">
            Acompanhamento de alçadas, integridade societária e conflitos de interesse.
          </p>
        </div>

        {/* Hub: Risk Intelligence */}
        <div className="card-premium p-8 cursor-pointer group hover:border-slate-700 transition-all">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-red-500/10 rounded-lg text-red-400 group-hover:bg-red-500/20 transition-colors">
              <Activity className="w-6 h-6" />
            </div>
            <h2 className="text-lg font-medium text-slate-200">Risk Intelligence</h2>
          </div>
          <p className="text-sm text-slate-400 leading-relaxed">
            Exposição sistêmica, matriz de probabilidade x impacto e planos de mitigação.
          </p>
        </div>

        {/* Hub: ESG Intelligence */}
        <div className="card-premium p-8 cursor-pointer group hover:border-slate-700 transition-all">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-teal-500/10 rounded-lg text-teal-400 group-hover:bg-teal-500/20 transition-colors">
              <Globe className="w-6 h-6" />
            </div>
            <h2 className="text-lg font-medium text-slate-200">ESG Intelligence</h2>
          </div>
          <p className="text-sm text-slate-400 leading-relaxed">
            Aderência cultural, compliance ético e indicadores de sustentabilidade corporativa.
          </p>
        </div>

        {/* Hub: Scenario Intelligence */}
        <div className="card-premium p-8 cursor-pointer group hover:border-slate-700 transition-all">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-amber-500/10 rounded-lg text-amber-400 group-hover:bg-amber-500/20 transition-colors">
              <Zap className="w-6 h-6" />
            </div>
            <h2 className="text-lg font-medium text-slate-200">Scenario Intelligence</h2>
          </div>
          <p className="text-sm text-slate-400 leading-relaxed">
            Projeções de impacto, simulação de deliberações e what-if executivo.
          </p>
        </div>

        {/* Hub: Institutional Advisory */}
        <div className="card-premium p-8 cursor-pointer group hover:border-slate-700 transition-all">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-primary rounded-lg text-primary group-hover:bg-primary transition-colors">
              <Cpu className="w-6 h-6" />
            </div>
            <h2 className="text-lg font-medium text-slate-200">Institutional Advisory</h2>
          </div>
          <p className="text-sm text-slate-400 leading-relaxed">
            Copiloto institucional para recomendações de decisão fiduciária.
          </p>
        </div>

      </div>
    </div>
  );
}
