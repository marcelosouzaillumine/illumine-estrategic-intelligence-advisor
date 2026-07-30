import React from 'react';
import { ExecutiveSurface } from '../../ui/executive-surface';
import { ExecutiveBadge } from '../../ui/executive-badge';
import { ShieldCheck, HelpCircle, ArrowRight, Sun, Award } from 'lucide-react';
import { ExecutiveCompanionOrchestrator } from '../../../../packages/platform/executive-companion/src/ExecutiveCompanionOrchestrator';
import { ExecutiveCompanionCard } from './ExecutiveCompanionCard';
import { ExecutiveTimelineCard } from './ExecutiveTimelineCard';
import { MomentumCard } from './MomentumCard';
import { AchievementGallery } from './AchievementGallery';
import { ExecutiveWisdomCard } from './ExecutiveWisdomCard';

export interface ExecutiveCompanionWorkspaceProps {
  readonly userName?: string;
  readonly companyId?: string;
}

export const ExecutiveCompanionWorkspace: React.FC<ExecutiveCompanionWorkspaceProps> = ({
  userName = 'Marcelo',
  companyId = 'empresa-demo'
}) => {
  const companion = ExecutiveCompanionOrchestrator.buildCompanionExperience('usr-companion', userName, 'CLIENT', companyId, false);

  return (
    <div className="w-full space-y-6">
      {/* 1. Header & Welcome Greeting */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-xl bg-gradient-to-r from-indigo-950/50 via-background to-background border border-indigo-500/30 shadow-md">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Sun className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight text-foreground">Bom dia, {userName}.</h1>
              <ExecutiveBadge variant="success" className="font-mono text-[10px]">ECI v2.0 Companion Active</ExecutiveBadge>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">Sua organização encontra-se em condição operacional monitorada com Momentum Excepcional.</p>
          </div>
        </div>
        <ExecutiveBadge variant="warning" className="font-mono text-[9px]">
          BENCHMARK SIMULADO DE HOMOLOGAÇÃO
        </ExecutiveBadge>
      </div>

      {/* 2. Executive Companion Profile & Momentum Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ExecutiveCompanionCard companion={companion} />
        <MomentumCard momentum={companion.momentum} />
      </div>

      {/* 3. Executive Timeline Card */}
      <ExecutiveTimelineCard timeline={companion.timeline} />

      {/* 4. Achievement Gallery */}
      <AchievementGallery achievements={companion.achievements} />

      {/* 5. Executive Wisdom Card */}
      <ExecutiveWisdomCard wisdom={companion.wisdom} />

      {/* 6. Mandatory Closing Question Card */}
      <div className="p-4 rounded-xl bg-purple-950/30 border border-purple-500/40 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3">
          <HelpCircle className="w-6 h-6 text-purple-400" />
          <div>
            <span className="font-bold text-purple-300 block text-[11px] uppercase">Ação Imediata do Companheiro Executivo:</span>
            <span className="font-bold text-sm text-foreground">Qual dessas deliberações estratégicas o Conselho analisará primeiro hoje?</span>
          </div>
        </div>
        <ExecutiveBadge variant="info" className="cursor-pointer hover:bg-purple-500/30 flex items-center gap-1 font-mono text-xs py-1.5 px-3">
          Iniciar Deliberação <ArrowRight className="w-3.5 h-3.5" />
        </ExecutiveBadge>
      </div>

      {/* 7. Footer */}
      <ExecutiveSurface variant="default" padding="md" radius="lg">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Executive Companion Intelligence Protocol ECI v2.0 Active for {companyId}</span>
          </div>
          <span>Platform v1.0 Compliant</span>
        </div>
      </ExecutiveSurface>
    </div>
  );
};
