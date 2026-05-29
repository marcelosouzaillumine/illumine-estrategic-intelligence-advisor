import React, { useMemo } from 'react';
import { ShieldAlert, AlertTriangle, TrendingUp, Activity, CheckCircle, Users, ActivitySquare } from 'lucide-react';
import { detectCrossStatementCausality } from '../../../core/runtime/CrossStatementCausalityEngine';
import { PageHeader } from '../../Common';

export function RiskExposureCenter() {
  // Simulação de injeção da engine causal Cross-Domain
  const causality = useMemo(() => {
    return detectCrossStatementCausality(4000, -2000, 0, 8000, 0, 0);
  }, []);

  if (!causality) {
    return <div className="p-8 text-slate-400">Carregando telemetria causal institucional...</div>;
  }

  return (
    <div className="max-w-[1440px] mx-auto px-6 lg:px-10 space-y-12 pb-32 animate-executive-fade">
      {/* Cabeçalho Executivo */}
      <PageHeader 
        title="Matriz de Risco Corporativo"
        subtitle="Visão consolidada da exposição a riscos e integridade operacional."
        icon={ShieldAlert}
        transparent
        actions={
          <div className="text-right">
            <div className="text-[10px] text-slate-500 uppercase tracking-widest font-black mb-1">Exposição Residual</div>
            <div className="text-4xl font-light text-emerald-400">Monitoramento Ativo</div>
          </div>
        }
      />

      {/* Cards de Status (Causality Summary) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatusCard 
          title="Tensões Ativas" 
          value={causality.tensions.length} 
          icon={<AlertTriangle className="w-5 h-5 text-red-500" />} 
          trend="Cross-Statement"
        />
        <StatusCard 
          title="Resolução Runtime" 
          value={causality.resolution.status} 
          icon={<ActivitySquare className="w-5 h-5 text-amber-500" />} 
          trend="Status"
        />
        <StatusCard 
          title="Origem Sistêmica Principal" 
          value={causality.tensions[0]?.source || 'N/A'} 
          icon={<TrendingUp className="w-5 h-5 text-emerald-500" />} 
          trend="Domínio de Risco"
        />
      </div>

      {/* Matriz e Listagem (Board-Ready View) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Painel da Matriz Visual (Causal Domino Effect) */}
        <div className="lg:col-span-2 card-premium p-8">
          <h2 className="text-lg font-medium text-slate-200 mb-6 flex items-center gap-2">
            <Activity className="w-5 h-5 text-slate-400" />
            Efeito Dominó (Causalidade Sistêmica)
          </h2>
          
          <div className="aspect-video bg-slate-950/60 rounded-xl border border-border/10 p-6 flex flex-col gap-4 overflow-y-auto">
            {causality.tensions.length === 0 ? (
              <div className="text-center my-auto">
                <ShieldAlert className="w-12 h-12 text-slate-700 mx-auto mb-3" />
                <p className="text-slate-500 text-xs font-bold uppercase tracking-wider leading-relaxed">
                  Aguardando consolidação do Motor Causal.<br/>
                  Nenhuma propagação de tensão detectada.
                </p>
              </div>
            ) : (
              causality.tensions.map((tension, idx) => (
                <div key={idx} className="flex flex-col gap-2 p-4 bg-slate-900 border border-slate-800 rounded-lg">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
                    <span className="text-rose-400">{tension.source}</span>
                    <span>→</span>
                    <span className="text-amber-400">{tension.target}</span>
                  </div>
                  <p className="text-sm text-slate-300">{tension.mechanism}</p>
                  <p className="text-xs text-slate-500 italic mt-2">Evidência: {tension.evidence}</p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Top Vulnerabilidades */}
        <div className="card-premium p-8">
          <h2 className="text-lg font-medium text-slate-200 mb-6 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-400" />
            Tensões Críticas Escalonadas
          </h2>
          <div className="space-y-4">
            {causality.tensions.filter(t => t.severity === 'CRÍTICA' || t.severity === 'ALTA').length === 0 ? (
              <div className="text-slate-500 text-xs font-bold uppercase tracking-wider py-8 text-center">Nenhuma tensão crítica identificada no período.</div>
            ) : (
              causality.tensions.filter(t => t.severity === 'CRÍTICA' || t.severity === 'ALTA').map((tension, idx) => (
                <div key={idx} className="p-4 bg-slate-950/40 border border-border/10 rounded-xl">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-slate-200 font-medium text-sm">{tension.source} → {tension.target}</h3>
                    <span className={`px-2.5 py-0.5 text-[10px] uppercase font-bold tracking-wider rounded-full border ${
                      tension.severity === 'CRÍTICA' ? 'bg-red-500/10 text-red-400 border-red-500/20' : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                    }`}>
                      {tension.severity}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

function StatusCard({ title, value, icon, trend }: { title: string, value: number | string, icon: React.ReactNode, trend: string }) {
  return (
    <div className="card-premium p-6 flex flex-col justify-between hover:border-slate-700 transition-all">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">{title}</h3>
        <div className="p-2 bg-slate-950/40 rounded-xl border border-border/10">
          {icon}
        </div>
      </div>
      <div>
        <div className="text-2xl font-light text-slate-100">{value}</div>
        <div className="text-xs text-slate-500 mt-1 uppercase tracking-wider font-bold">{trend}</div>
      </div>
    </div>
  );
}
