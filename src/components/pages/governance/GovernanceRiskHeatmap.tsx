import React, { useState, useEffect } from 'react';
import { ShieldAlert, AlertTriangle, TrendingUp, Activity, CheckCircle, Users } from 'lucide-react';
import { enterpriseRiskEngine } from '../../../core/runtime/governance/risk/EnterpriseRiskEngine';
import { RiskHeatmap } from '../../../core/runtime/governance/risk/types';

export function GovernanceRiskHeatmap() {
  const [heatmapData, setHeatmapData] = useState<RiskHeatmap | null>(null);

  useEffect(() => {
    // Em produção, o tenantId viria do TenantExecutionContext do usuário logado.
    // Estamos chamando a engine real que está vazia no momento, 
    // mas pronta para receber dados reais (sem mocks soltos na engine).
    const data = enterpriseRiskEngine.generateHeatmap('current-tenant-id');
    setHeatmapData(data);
  }, []);

  if (!heatmapData) {
    return <div className="p-8 text-slate-400">Carregando telemetria de riscos institucionais...</div>;
  }

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-fade-in">
      {/* Cabeçalho Executivo */}
      <div className="flex justify-between items-end border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-3xl font-light text-slate-100 tracking-tight flex items-center gap-3">
            <ShieldAlert className="w-8 h-8 text-emerald-500" />
            Matriz de Risco Corporativo
          </h1>
          <p className="text-slate-400 mt-2">
            Visão consolidada da exposição a riscos e integridade operacional.
          </p>
        </div>
        <div className="text-right">
          <div className="text-sm text-slate-500 uppercase tracking-widest font-semibold">Exposição Residual</div>
          <div className="text-4xl font-light text-emerald-400">{heatmapData.consolidatedResidualRisk.toLocaleString()}</div>
        </div>
      </div>

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
          icon={<Users className="w-5 h-5 text-slate-400" />} 
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
        <div className="lg:col-span-2 bg-slate-900/50 border border-slate-800 rounded-xl p-6">
          <h2 className="text-lg font-medium text-slate-200 mb-6 flex items-center gap-2">
            <Activity className="w-5 h-5 text-slate-400" />
            Impacto vs Probabilidade
          </h2>
          
          <div className="aspect-video bg-slate-950 rounded-lg border border-slate-800 flex items-center justify-center relative overflow-hidden">
            {/* Aqui entraria a renderização do grid 5x5 do heatmap real baseado em heatmapData.matrix */}
            <div className="text-center">
              <ShieldAlert className="w-12 h-12 text-slate-700 mx-auto mb-3" />
              <p className="text-slate-500 text-sm">
                Aguardando consolidação do Motor de Risco.<br/>
                Ambiente multi-tenant seguro e isolado.
              </p>
            </div>
          </div>
        </div>

        {/* Top Riscos */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
          <h2 className="text-lg font-medium text-slate-200 mb-6 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-400" />
            Top Riscos Críticos
          </h2>
          <div className="space-y-4">
            {heatmapData.topCriticalRisks.length === 0 ? (
              <div className="text-slate-500 text-sm py-4 text-center">Nenhum risco crítico identificado no período.</div>
            ) : (
              heatmapData.topCriticalRisks.map(risk => (
                <div key={risk.riskId} className="p-4 bg-slate-950 border border-slate-800 rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-slate-200 font-medium text-sm">{risk.title}</h3>
                    <span className="px-2 py-0.5 text-[10px] uppercase font-bold tracking-wider rounded-full bg-red-500/10 text-red-400 border border-red-500/20">
                      Critico
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">{risk.category}</p>
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
    <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-5 flex flex-col justify-between">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-sm font-medium text-slate-400">{title}</h3>
        <div className="p-2 bg-slate-950 rounded-lg border border-slate-800">
          {icon}
        </div>
      </div>
      <div>
        <div className="text-2xl font-light text-slate-100">{value}</div>
        <div className="text-xs text-slate-500 mt-1 uppercase tracking-wider font-medium">{trend}</div>
      </div>
    </div>
  );
}
