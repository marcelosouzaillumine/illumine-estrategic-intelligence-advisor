import React from 'react';
import { ExecutiveSurface } from '../../ui/executive-surface';
import { ExecutiveBadge } from '../../ui/executive-badge';
import { Users, ShieldCheck, HelpCircle, ArrowRight, Award } from 'lucide-react';
import { ExecutiveCompanionOrchestrator } from '../../../../packages/platform/executive-companion/src/ExecutiveCompanionOrchestrator';
import { MomentumCard } from './MomentumCard';
import { ExecutiveWisdomCard } from './ExecutiveWisdomCard';

export interface AdvisorCompanionWorkspaceProps {
  readonly advisorName?: string;
}

export const AdvisorCompanionWorkspace: React.FC<AdvisorCompanionWorkspaceProps> = ({
  advisorName = 'Dr. Eduardo'
}) => {
  const companion = ExecutiveCompanionOrchestrator.buildCompanionExperience('adv-companion', advisorName, 'ADVISOR', 'carteira-advisory', false);

  return (
    <div className="w-full space-y-6">
      {/* 1. Header & Advisor Command */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-xl bg-background/80 border border-border/60 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight text-foreground">Bom dia, {advisorName}.</h1>
              <ExecutiveBadge variant="info" className="font-mono text-[10px]">Advisor Companion v2.0</ExecutiveBadge>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">Hoje você é responsável por acompanhar 18 organizações. Sua atuação pode preservar R$ 12,4 milhões em receita anual.</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <ExecutiveBadge variant="success" className="font-mono">Carteira: Top 94%</ExecutiveBadge>
          <ExecutiveBadge variant="warning" className="font-mono text-[9px]">BENCHMARK SIMULADO</ExecutiveBadge>
        </div>
      </div>

      {/* 2. Portfolio Momentum & Wisdom */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <MomentumCard momentum={companion.momentum} />
        <ExecutiveWisdomCard wisdom={companion.wisdom} />
      </div>

      {/* 3. Mandatory Advisor Closing Question Card */}
      <div className="p-4 rounded-xl bg-cyan-950/30 border border-cyan-500/40 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3">
          <HelpCircle className="w-6 h-6 text-cyan-400" />
          <div>
            <span className="font-bold text-cyan-300 block text-[11px] uppercase">Decisão do Comandante de Carteira:</span>
            <span className="font-bold text-sm text-foreground">Qual cliente crítico da sua carteira você deseja atender primeiro hoje?</span>
          </div>
        </div>
        <ExecutiveBadge variant="info" className="cursor-pointer hover:bg-cyan-500/30 flex items-center gap-1 font-mono text-xs py-1.5 px-3">
          Iniciar Atendimento <ArrowRight className="w-3.5 h-3.5" />
        </ExecutiveBadge>
      </div>

      {/* 4. Footer */}
      <ExecutiveSurface variant="default" padding="md" radius="lg">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Advisor Companion Protocol ECI v2.0 Active</span>
          </div>
          <span>Platform v1.0 Compliant</span>
        </div>
      </ExecutiveSurface>
    </div>
  );
};
