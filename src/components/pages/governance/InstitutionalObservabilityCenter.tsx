import React from 'react';
import { Activity, ShieldAlert, Zap, Network, ServerCrash, CheckCircle2 } from 'lucide-react';
import { PageHeader } from '../../Common';

export function InstitutionalObservabilityCenter() {
  return (
    <div className="max-w-[1440px] mx-auto px-6 lg:px-10 space-y-12 pb-32 animate-executive-fade">
      {/* Cabeçalho */}
      <PageHeader 
        title="Saúde e Continuidade Institucional"
        subtitle="Monitoramento em tempo real da integridade sistêmica, governança e estabilidade operacional."
        icon={Activity}
        transparent
      />

      {/* Grid de Abas / Status (Simulado) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="card-premium p-6 flex flex-col justify-between hover:border-slate-700 transition-all">
          <div className="flex justify-between items-center mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Status Geral</span>
            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
          </div>
          <div>
            <div className="text-2xl font-light text-slate-100">Operacional</div>
            <div className="text-xs text-slate-500 mt-1 uppercase tracking-wider font-bold">Zero Alertas Críticos</div>
          </div>
        </div>

        <div className="card-premium p-6 flex flex-col justify-between hover:border-slate-700 transition-all">
          <div className="flex justify-between items-center mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Integridade de Governança</span>
            <ShieldAlert className="w-5 h-5 text-emerald-500" />
          </div>
          <div>
            <div className="text-2xl font-light text-slate-100">100%</div>
            <div className="text-xs text-slate-500 mt-1 uppercase tracking-wider font-bold">Zero Quebra de Alçada</div>
          </div>
        </div>

        <div className="card-premium p-6 flex flex-col justify-between hover:border-slate-700 transition-all">
          <div className="flex justify-between items-center mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Continuidade Sistêmica</span>
            <ServerCrash className="w-5 h-5 text-emerald-500" />
          </div>
          <div>
            <div className="text-2xl font-light text-slate-100">99.99%</div>
            <div className="text-xs text-slate-500 mt-1 uppercase tracking-wider font-bold">Uptime Institucional</div>
          </div>
        </div>

        <div className="card-premium p-6 flex flex-col justify-between hover:border-slate-700 transition-all">
          <div className="flex justify-between items-center mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Decisões Processadas</span>
            <Network className="w-5 h-5 text-indigo-500" />
          </div>
          <div>
            <div className="text-2xl font-light text-slate-100">142</div>
            <div className="text-xs text-slate-500 mt-1 uppercase tracking-wider font-bold">Últimos 30 dias</div>
          </div>
        </div>

      </div>

      {/* Seção Principal */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Painel de Estabilidade Operacional */}
        <div className="card-premium p-8">
          <h2 className="text-lg font-medium text-slate-200 mb-6 flex items-center gap-2">
            <Zap className="w-5 h-5 text-slate-400" />
            Estabilidade Operacional (Runtime Health)
          </h2>
          <div className="space-y-4">
            {['Motor Fiduciário', 'Inteligência Financeira', 'Gateway de Conflitos', 'Rastreabilidade de Lineage'].map((service, idx) => (
              <div key={idx} className="flex justify-between items-center border-b border-border/10 pb-4 last:border-0 last:pb-0">
                <span className="text-slate-300 text-sm">{service}</span>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-slate-500 font-mono">12ms</span>
                  <span className="flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-xl border border-emerald-500/20 font-bold uppercase tracking-wider">
                    <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></span>
                    Saudável
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Benchmarking & Cross-Tenant Security */}
        <div className="card-premium p-8">
          <h2 className="text-lg font-medium text-slate-200 mb-6 flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-slate-400" />
            Segurança de Dados e Isolamento
          </h2>
          <div className="flex flex-col items-center justify-center py-10 text-center border border-dashed border-border/20 rounded-xl bg-slate-950/40 shadow-inner">
            <ShieldAlert className="w-10 h-10 text-emerald-500 mb-3 opacity-80" />
            <h3 className="text-sm font-medium text-slate-300">Zero Cross-Tenant Leakage</h3>
            <p className="text-xs text-slate-500 mt-2 max-w-[280px] leading-relaxed">
              O ambiente institucional opera em strict isolation mode. Todos os acessos auditados.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
