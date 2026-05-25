import React from 'react';
import { Activity, ShieldAlert, Zap, Network, ServerCrash, CheckCircle2 } from 'lucide-react';

export function InstitutionalObservabilityCenter() {
  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-fade-in">
      {/* Cabeçalho */}
      <div className="border-b border-slate-800 pb-6 mb-8">
        <h1 className="text-3xl font-light text-slate-100 tracking-tight flex items-center gap-3">
          <Activity className="w-8 h-8 text-indigo-500" />
          Saúde e Continuidade Institucional
        </h1>
        <p className="text-slate-400 mt-2">
          Monitoramento em tempo real da integridade sistêmica, governança e estabilidade operacional.
        </p>
      </div>

      {/* Grid de Abas / Status (Simulado) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-5">
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm font-medium text-slate-400">Status Geral</span>
            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
          </div>
          <div className="text-2xl font-light text-slate-100">Operacional</div>
          <div className="text-xs text-slate-500 mt-1 uppercase tracking-wider">Zero Alertas Críticos</div>
        </div>

        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-5">
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm font-medium text-slate-400">Integridade de Governança</span>
            <ShieldAlert className="w-5 h-5 text-emerald-500" />
          </div>
          <div className="text-2xl font-light text-slate-100">100%</div>
          <div className="text-xs text-slate-500 mt-1 uppercase tracking-wider">Zero Quebra de Alçada</div>
        </div>

        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-5">
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm font-medium text-slate-400">Continuidade Sistêmica</span>
            <ServerCrash className="w-5 h-5 text-emerald-500" />
          </div>
          <div className="text-2xl font-light text-slate-100">99.99%</div>
          <div className="text-xs text-slate-500 mt-1 uppercase tracking-wider">Uptime Institucional</div>
        </div>

        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-5">
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm font-medium text-slate-400">Decisões Processadas</span>
            <Network className="w-5 h-5 text-indigo-500" />
          </div>
          <div className="text-2xl font-light text-slate-100">142</div>
          <div className="text-xs text-slate-500 mt-1 uppercase tracking-wider">Últimos 30 dias</div>
        </div>

      </div>

      {/* Seção Principal */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
        
        {/* Painel de Estabilidade Operacional */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
          <h2 className="text-lg font-medium text-slate-200 mb-6 flex items-center gap-2">
            <Zap className="w-5 h-5 text-slate-400" />
            Estabilidade Operacional (Runtime Health)
          </h2>
          <div className="space-y-4">
            {['Motor Fiduciário', 'Inteligência Financeira', 'Gateway de Conflitos', 'Rastreabilidade de Lineage'].map((service, idx) => (
              <div key={idx} className="flex justify-between items-center border-b border-slate-800/50 pb-3 last:border-0 last:pb-0">
                <span className="text-slate-300 text-sm">{service}</span>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-slate-500 font-mono">12ms</span>
                  <span className="flex items-center gap-1 text-xs text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-full border border-emerald-500/20">
                    <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></span>
                    Saudável
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Benchmarking & Cross-Tenant Security */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
          <h2 className="text-lg font-medium text-slate-200 mb-6 flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-slate-400" />
            Segurança de Dados e Isolamento
          </h2>
          <div className="flex flex-col items-center justify-center h-40 text-center border border-dashed border-slate-800 rounded-lg bg-slate-950/50">
            <ShieldAlert className="w-10 h-10 text-emerald-500 mb-3 opacity-80" />
            <h3 className="text-sm font-medium text-slate-300">Zero Cross-Tenant Leakage</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-[250px]">
              O ambiente institucional opera em strict isolation mode. Todos os acessos auditados.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
