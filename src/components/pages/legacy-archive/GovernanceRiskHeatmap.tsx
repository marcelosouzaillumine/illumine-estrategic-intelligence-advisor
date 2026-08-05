import { ExecutiveText } from '../../ui/executive-typography';
import { ExecutiveHeading } from '../../ui/executive-heading';
import { ExecutivePageTemplate } from '../../ui/executive-page-template';
import React from 'react';
import { ShieldAlert, AlertTriangle, TrendingUp, Activity, CheckCircle, Users } from 'lucide-react';
import { useGovernanceRiskHeatmapViewModel } from '../../../viewmodels/governance/useGovernanceRiskHeatmapViewModel';

import { ExecutiveSummarySection } from '../../ui/executive-summary-section';
import { ExecutiveStrategicTensions } from '../../ui/executive-strategic-tensions';
import { ExecutiveDecisionTrace } from '../../ui/executive-decision-trace';

export function GovernanceRiskHeatmap() {
  const { state } = useGovernanceRiskHeatmapViewModel();
  const { heatmapData } = state;

  if (!heatmapData) {
    return <div className="p-8 text-muted-foreground">Carregando telemetria de riscos institucionais...</div>;
  }

  return (
    <ExecutivePageTemplate header={{ title: "Visão consolidada da exposição a riscos e integridade operacional.", description: "Visão consolidada da exposição a riscos e integridade operacional.", icon: ShieldAlert }}>

      {/* --- CAMADA 1: NÍVEL CONSELHO (SÍNTESE DE HEATMAP DE RISCOS) --- */}
      <ExecutiveSummarySection 
        className="mb-8"
        status={{ label: 'Matriz de Riscos Ativa', variant: 'success' }}
        question="Qual o nível global de exposição aos riscos operacionais, financeiros e regulatórios?"
        opinion="O comitê fiduciário atesta a matriz de riscos e o andamento dos planos de mitigação."
        driver="Riscos críticos, mitigações em atraso, proprietários alocados e curva de severidade."
        implication="Prevenção de incidentes materiais e preservação da liquidez e operação."
        executiveQuestion="Cobrar a execução dos planos de mitigação em atraso e nomear responsáveis para os riscos orfãos."
      >
        <ExecutiveStrategicTensions tensions={[]} />
        <ExecutiveDecisionTrace trace={[]} />
      </ExecutiveSummarySection>

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
          <ExecutiveHeading as="h2" className="text-muted-foreground mb-6 flex items-center gap-2">
            <Activity className="w-5 h-5 text-muted-foreground" />
            Impacto vs Probabilidade
          </ExecutiveHeading>
          
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
          <ExecutiveHeading as="h2" className="text-muted-foreground mb-6 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-400" />
            Top Riscos Críticos
          </ExecutiveHeading>
          <div className="space-y-4">
            {heatmapData.topCriticalRisks.length === 0 ? (
              <div className="text-muted-foreground text-xs font-bold uppercase tracking-wider py-8 text-center">Nenhum risco crítico identificado no período.</div>
            ) : (
              heatmapData.topCriticalRisks.map(risk => (
                <div key={risk.riskId} className="p-4 bg-slate-950/40 border border-border/10 rounded-xl">
                  <div className="flex justify-between items-start mb-2">
                    <ExecutiveHeading as="h3" className="text-muted-foreground">{risk.title}</ExecutiveHeading>
                    <span className="px-2.5 py-0.5 text-[10px] uppercase font-bold tracking-wider rounded-full bg-red-500/10 text-red-400 border border-red-500/20">
                      Crítico
                    </span>
                  </div>
                  <ExecutiveText as="div" variant="caption" className="text-muted-foreground mt-1">{risk.category}</ExecutiveText>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </ExecutivePageTemplate>
  );
}

function StatusCard({ title, value, icon, trend }: { title: string, value: number | string, icon: React.ReactNode, trend: string }) {
  return (
    <div className="card-premium p-6 flex flex-col justify-between hover:border-border transition-all">
      <div className="flex justify-between items-start mb-4">
        <ExecutiveHeading as="h3" className="text-muted-foreground">{title}</ExecutiveHeading>
        <div className="p-2 bg-slate-950/40 rounded-xl border border-border/10">
          {React.isValidElement(icon) ? icon : icon ? React.createElement(icon as any, { size: 18 }) : null}
        </div>
      </div>
      <div>
        <div className="text-2xl font-light text-muted-foreground">{value}</div>
        <div className="text-xs text-muted-foreground mt-1 uppercase tracking-wider font-bold">{trend}</div>
      </div>
    </div>
  );
}
