import React from 'react';
import { ExecutiveSurface } from '../../ui/executive-surface';
import { ExecutiveBadge } from '../../ui/executive-badge';
import { Activity, ShieldCheck } from 'lucide-react';
import { ExecutiveLivingOrchestrator } from '../../../../packages/platform/executive-living/src/ExecutiveLivingOrchestrator';
import { ExecutiveFeedCard } from './ExecutiveFeedCard';
import { ExecutiveSignalCard } from './ExecutiveSignalCard';
import { ExecutiveMomentCard } from './ExecutiveMomentCard';
import { ExecutiveReflectionCard } from './ExecutiveReflectionCard';
import { ExecutiveNudgeCard } from './ExecutiveNudgeCard';

export interface ExecutiveFeedWorkspaceProps {
  readonly companyId?: string;
}

export const ExecutiveFeedWorkspace: React.FC<ExecutiveFeedWorkspaceProps> = ({ companyId = 'empresa-demo' }) => {
  const living = ExecutiveLivingOrchestrator.buildLivingExperience('usr-feed', companyId, false);

  return (
    <div className="w-full space-y-6">
      {/* 1. Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-xl bg-gradient-to-r from-purple-950/40 via-background to-background border border-purple-500/20 shadow-md">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight text-foreground">Executive Feed™ (Timeline Vivo)</h1>
              <ExecutiveBadge variant="success" className="font-mono text-[10px]">ELI v1.0 System Active</ExecutiveBadge>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">Acompanhamento executivo contínuo e percepção em tempo real.</p>
          </div>
        </div>
        <ExecutiveBadge variant="warning" className="font-mono text-[9px]">
          BENCHMARK SIMULADO DE HOMOLOGAÇÃO
        </ExecutiveBadge>
      </div>

      {/* 2. Discret Nudges */}
      <ExecutiveNudgeCard nudges={living.nudges} />

      {/* 3. Signals & Moments Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {living.signals[0] && <ExecutiveSignalCard signal={living.signals[0]} />}
        {living.moments[0] && <ExecutiveMomentCard moment={living.moments[0]} />}
      </div>

      {/* 4. Timeline Feed Items */}
      <ExecutiveSurface variant="default" padding="md" radius="lg" className="border border-purple-500/30">
        <h3 className="font-bold text-sm text-foreground mb-3">Eventos Recentes da Organização</h3>
        <div className="space-y-2">
          {living.feed.items.map((item) => (
            <ExecutiveFeedCard key={item.itemId} item={item} />
          ))}
        </div>
      </ExecutiveSurface>

      {/* 5. End-of-day Reflection */}
      <ExecutiveReflectionCard reflection={living.reflection} />

      {/* 6. Footer */}
      <ExecutiveSurface variant="default" padding="md" radius="lg">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Executive Living Governance System ELI v1.0 Active for {companyId}</span>
          </div>
          <span>Platform v1.0 Compliant</span>
        </div>
      </ExecutiveSurface>
    </div>
  );
};
