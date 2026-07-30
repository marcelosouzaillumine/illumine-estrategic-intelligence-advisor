import React from 'react';
import { ExecutiveSurface } from '../../ui/executive-surface';
import { ExecutiveBadge } from '../../ui/executive-badge';
import { Users, ShieldCheck, HelpCircle, ArrowRight, Activity, Calendar } from 'lucide-react';
import { AdvisorPulseEngine } from '../../../../packages/platform/executive-living/src/AdvisorPulseEngine';

export interface AdvisorPulseWorkspaceProps {
  readonly advisorName?: string;
}

export const AdvisorPulseWorkspace: React.FC<AdvisorPulseWorkspaceProps> = ({ advisorName = 'Dr. Eduardo' }) => {
  const pulse = AdvisorPulseEngine.generateAdvisorPulse(advisorName);

  return (
    <div className="w-full space-y-6">
      {/* 1. Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-xl bg-background/80 border border-border/60 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight text-foreground">Advisor Pulse™ — Operação Diária da Carteira</h1>
              <ExecutiveBadge variant="info" className="font-mono text-[10px]">ELI v1.0 Advisor</ExecutiveBadge>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">Acompanhamento contínuo de {pulse.activePortfolioCount} organizações na sua carteira.</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <ExecutiveBadge variant="success" className="font-mono">Receita Potencial: {pulse.potentialRevenueImpactFormatted}</ExecutiveBadge>
          <ExecutiveBadge variant="warning" className="font-mono text-[9px]">BENCHMARK SIMULADO</ExecutiveBadge>
        </div>
      </div>

      {/* 2. Portfolio Status Overview */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center text-xs">
        <div className="p-3 rounded bg-background/50 border border-border/30">
          <span className="font-bold text-muted-foreground block text-[10px]">CLIENTES NA CARTEIRA</span>
          <span className="font-mono text-base font-bold text-foreground">{pulse.activePortfolioCount}</span>
        </div>
        <div className="p-3 rounded bg-rose-500/10 border border-rose-500/20">
          <span className="font-bold text-rose-400 block text-[10px]">CLIENTES CRÍTICOS</span>
          <span className="font-mono text-base font-bold text-rose-400">{pulse.criticalClientsCount}</span>
        </div>
        <div className="p-3 rounded bg-amber-500/10 border border-amber-500/20">
          <span className="font-bold text-amber-400 block text-[10px]">AGUARDANDO INTERAÇÃO</span>
          <span className="font-mono text-base font-bold text-amber-400">{pulse.clientsAwaitingInteractionCount}</span>
        </div>
        <div className="p-3 rounded bg-emerald-500/10 border border-emerald-500/20">
          <span className="font-bold text-emerald-400 block text-[10px]">SAÚDE DA CARTEIRA</span>
          <span className="font-mono text-base font-bold text-emerald-400">Top {pulse.portfolioHealthRankPercent}%</span>
        </div>
      </div>

      {/* 3. Recommended Operational Agenda */}
      <ExecutiveSurface variant="default" padding="md" radius="lg" className="border border-cyan-500/30">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-cyan-400" />
            <h3 className="font-bold text-sm text-foreground">Agenda Recomendada do Dia</h3>
          </div>
          <ExecutiveBadge variant="info" className="font-mono">Tempo Estimado: {pulse.estimatedTimeFormatted}</ExecutiveBadge>
        </div>
        <div className="space-y-2 text-xs">
          {pulse.recommendedAgenda.map((item, idx) => (
            <div key={idx} className="p-2.5 rounded bg-background/50 border border-border/30 flex justify-between items-center">
              <span className="font-semibold text-foreground">{item}</span>
              <ExecutiveBadge variant="info">Prioridade {idx + 1}</ExecutiveBadge>
            </div>
          ))}
        </div>
      </ExecutiveSurface>

      {/* 4. Mandatory Closing Action */}
      <div className="p-4 rounded-xl bg-cyan-950/30 border border-cyan-500/40 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3">
          <HelpCircle className="w-6 h-6 text-cyan-400" />
          <div>
            <span className="font-bold text-cyan-300 block text-[11px] uppercase">Ação Imediata do Advisor:</span>
            <span className="font-bold text-sm text-foreground">Qual cliente crítico da sua carteira você deseja atender primeiro hoje?</span>
          </div>
        </div>
        <ExecutiveBadge variant="info" className="cursor-pointer hover:bg-cyan-500/30 flex items-center gap-1 font-mono text-xs py-1.5 px-3">
          Iniciar Atendimento <ArrowRight className="w-3.5 h-3.5" />
        </ExecutiveBadge>
      </div>

      {/* 5. Footer */}
      <ExecutiveSurface variant="default" padding="md" radius="lg">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Advisor Pulse Protocol ELI v1.0 Active</span>
          </div>
          <span>Platform v1.0 Compliant</span>
        </div>
      </ExecutiveSurface>
    </div>
  );
};
