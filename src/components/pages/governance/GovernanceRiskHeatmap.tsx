import React from 'react';
import { ShieldAlert, AlertTriangle, TrendingUp, Activity, CheckCircle, Users } from 'lucide-react';
import { PageHeader } from '../../Common';
import { useGovernanceRiskHeatmapViewModel } from '../../../viewmodels/governance/useGovernanceRiskHeatmapViewModel';

export function GovernanceRiskHeatmap() {
  const { state } = useGovernanceRiskHeatmapViewModel();
  const { heatmapData } = state;

  if (!heatmapData) {
    return <div className="p-8 text-muted-foreground">Carregando telemetria de riscos institucionais...</div>;
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
            <div className="text-[10px] text-muted-foreground uppercase tracking-widest font-black mb-1">Exposição Residual</div>
            <div className="text-4xl font-light text-emerald-400">{heatmapData.consolidatedResidualRisk.toLocaleString()}</div>
          </div>
        }
      />

      {/* Cards de Status (Executive Summary) */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatusCard 
          title="Riscos Críticos" 
          value={heatmapData.topCriticalRisks.length} 
          icon={<AlertTriangle className="w-5 h-5 text-red-500" />} 
          trend="Atenção Imediata"
        />
        <StatusCard 
          title="Mitigações Atrasadas" 
          value={heatmapData.delayedMitigations.length} 
          icon={<Activity className="w-5 h-5 text-amber-500" />} 
          trend="Fiduciário"
        />
        <StatusCard 
          title="Riscos Sem Owner" 
          value={heatmapData.risksWithoutOwner.length} 
          icon={<Users className="w-5 h-5 text-muted-foreground" />} 
          trend="Governança"
        />
        <StatusCard 
          title="Tendência de Exposição" 
          value={heatmapData.exposureTrend} 
          icon={<TrendingUp className="w-5 h-5 text-emerald-500" />} 
          trend="vs Último Trimestre"
        />
      </div>

      {/* Matriz e Listagem (Board-Ready View) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Painel da Matriz Visual (Placeholder para gráfico real) */}
        <div className="lg:col-span-2 card-premium p-8">
          <h2 className="text-lg font-medium text-muted-foreground mb-6 flex items-center gap-2">
            <Activity className="w-5 h-5 text-muted-foreground" />
            Impacto vs Probabilidade
          </h2>
          
          <div className="aspect-video bg-slate-950/60 rounded-xl border border-border/10 flex items-center justify-center relative overflow-hidden shadow-inner">
            {/* Aqui entraria a renderização do grid 5x5 do heatmap real baseado em heatmapData.matrix */}
            <div className="text-center">
              <ShieldAlert className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground text-xs font-bold uppercase tracking-wider leading-relaxed">
                Aguardando consolidação do Motor de Risco.<br/>
                Ambiente multi-tenant seguro e isolado.
              </p>
            </div>
          </div>
        </div>

        {/* Top Riscos */}
        <div className="card-premium p-8">
          <h2 className="text-lg font-medium text-muted-foreground mb-6 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-400" />
            Top Riscos Críticos
          </h2>
          <div className="space-y-4">
            {heatmapData.topCriticalRisks.length === 0 ? (
              <div className="text-muted-foreground text-xs font-bold uppercase tracking-wider py-8 text-center">Nenhum risco crítico identificado no período.</div>
            ) : (
              heatmapData.topCriticalRisks.map(risk => (
                <div key={risk.riskId} className="p-4 bg-slate-950/40 border border-border/10 rounded-xl">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-muted-foreground font-medium text-sm">{risk.title}</h3>
                    <span className="px-2.5 py-0.5 text-[10px] uppercase font-bold tracking-wider rounded-full bg-red-500/10 text-red-400 border border-red-500/20">
                      Crítico
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{risk.category}</p>
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
    <div className="card-premium p-6 flex flex-col justify-between hover:border-border transition-all">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{title}</h3>
        <div className="p-2 bg-slate-950/40 rounded-xl border border-border/10">
          {icon}
        </div>
      </div>
      <div>
        <div className="text-2xl font-light text-muted-foreground">{value}</div>
        <div className="text-xs text-muted-foreground mt-1 uppercase tracking-wider font-bold">{trend}</div>
      </div>
    </div>
  );
}
