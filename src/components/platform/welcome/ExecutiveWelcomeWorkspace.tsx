import React from 'react';
import { ExecutiveSurface } from '../../ui/executive-surface';
import { ExecutiveBadge } from '../../ui/executive-badge';
import { Sparkles, Sun, Target, Filter, ShieldCheck, HelpCircle, History, Heart, ArrowRight, Award, Trophy, Compass, Activity, CheckCircle2 } from 'lucide-react';
import { ExecutiveWelcomeOrchestrator } from '../../../../packages/platform/executive-welcome/src/ExecutiveWelcomeOrchestrator';

export interface ExecutiveWelcomeWorkspaceProps {
  readonly userName?: string;
  readonly companyId?: string;
  readonly daysSinceLastAccess?: number;
}

export const ExecutiveWelcomeWorkspace: React.FC<ExecutiveWelcomeWorkspaceProps> = ({
  userName = 'Marcelo',
  companyId = 'empresa-demo',
  daysSinceLastAccess = 0
}) => {
  const welcome = ExecutiveWelcomeOrchestrator.buildWelcomeExperience('usr-01', userName, 'CLIENT', companyId, daysSinceLastAccess, false);

  return (
    <div className="w-full space-y-6">
      {/* 1. Header & Greeting Card */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-xl bg-gradient-to-r from-indigo-950/40 via-background to-background border border-indigo-500/20 shadow-md">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Sun className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight text-foreground">{welcome.greetingText}</h1>
              <ExecutiveBadge variant="success" className="font-mono text-[10px]">EWIX v1.2 Identity Experience</ExecutiveBadge>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">{welcome.presence?.adaptiveContextGreeting}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <ExecutiveBadge variant="info" className="font-mono flex items-center gap-1">
            <Heart className="w-3 h-3 text-rose-400" /> Identity Score: {welcome.identity?.executiveEvolutionScore}
          </ExecutiveBadge>
          <ExecutiveBadge variant="success" className="font-mono text-[10px]">
            Momentum: {welcome.identity?.currentExecutiveMomentum}
          </ExecutiveBadge>
        </div>
      </div>

      {/* 2. Celebration Notification Banner */}
      {welcome.celebration && welcome.celebration.isCelebrated && (
        <div className="p-4 rounded-xl bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-background border border-amber-500/30 flex items-center gap-3">
          <Trophy className="w-6 h-6 text-amber-400 shrink-0" />
          <div>
            <span className="font-bold text-sm text-amber-300 block">{welcome.celebration.titleText}</span>
            <span className="text-xs text-muted-foreground">{welcome.celebration.messageText}</span>
          </div>
        </div>
      )}

      {/* 3. Executive Identity & Legacy Storytelling Banner */}
      {welcome.identity && (
        <ExecutiveSurface variant="default" padding="md" radius="lg" className="border border-amber-500/30 bg-amber-500/5">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Compass className="w-5 h-5 text-amber-400" />
              <h3 className="font-bold text-sm text-foreground">Seu Legado Continua Sendo Construído</h3>
            </div>
            {welcome.legacy?.isSimulatedBenchmark && (
              <ExecutiveBadge variant="warning" className="font-mono text-[9px]">
                BENCHMARK SIMULADO DE HOMOLOGAÇÃO
              </ExecutiveBadge>
            )}
          </div>
          <p className="text-xs text-foreground font-medium leading-relaxed">
            "{welcome.identity.legacyNarrativeText}"
          </p>
        </ExecutiveSurface>
      )}

      {/* 4. Purpose Statement Card */}
      <ExecutiveSurface variant="default" padding="md" radius="lg" className="border border-purple-500/30">
        <div className="flex items-center gap-2 mb-2">
          <Activity className="w-4 h-4 text-purple-400" />
          <h3 className="font-bold text-sm text-foreground">Propósito do Seu Trabalho Hoje</h3>
        </div>
        <p className="text-xs text-purple-200/90 leading-relaxed">
          {welcome.purposeStatementText}
        </p>
      </ExecutiveSurface>

      {/* 5. Executive Legacy™ & Executive Impact™ Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Executive Legacy Card */}
        <ExecutiveSurface variant="default" padding="md" radius="lg" className="border border-indigo-500/30">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Trophy className="w-4 h-4 text-indigo-400" />
              <h3 className="font-bold text-sm">Executive Legacy™</h3>
            </div>
            <ExecutiveBadge variant="info">ROI: {welcome.legacy?.accumulatedRoiFormatted}</ExecutiveBadge>
          </div>
          <div className="space-y-2 text-xs">
            <div className="p-2 rounded bg-background/50 border border-border/30 flex justify-between">
              <span className="text-muted-foreground">Valor Preservado:</span>
              <span className="font-mono font-bold text-emerald-400">{welcome.legacy?.valuePreservedFormatted}</span>
            </div>
            <div className="p-2 rounded bg-background/50 border border-border/30 flex justify-between">
              <span className="text-muted-foreground">Valor Criado:</span>
              <span className="font-mono font-bold text-indigo-400">{welcome.legacy?.valueCreatedFormatted}</span>
            </div>
            <div className="p-2 rounded bg-background/50 border border-border/30 flex justify-between">
              <span className="text-muted-foreground">Decisões Concluídas:</span>
              <span className="font-mono font-bold text-foreground">{welcome.legacy?.totalDecisionsImplementedCount}</span>
            </div>
          </div>
        </ExecutiveSurface>

        {/* Your Executive Impact Card */}
        <ExecutiveSurface variant="default" padding="md" radius="lg" className="border border-emerald-500/30">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <h3 className="font-bold text-sm">Your Executive Impact™</h3>
            </div>
            <ExecutiveBadge variant="success">Impacto Alto</ExecutiveBadge>
          </div>
          <div className="space-y-2 text-xs">
            <div className="p-2 rounded bg-background/50 border border-border/30 flex justify-between">
              <span className="text-muted-foreground">Organizações Impactadas:</span>
              <span className="font-mono font-bold text-foreground">{welcome.identity?.totalOrganizationsImpactedCount}</span>
            </div>
            <div className="p-2 rounded bg-background/50 border border-border/30 flex justify-between">
              <span className="text-muted-foreground">Iniciativas Estratégicas:</span>
              <span className="font-mono font-bold text-foreground">{welcome.identity?.totalStrategicMissionsCompletedCount}</span>
            </div>
            <div className="p-2 rounded bg-background/50 border border-border/30 flex justify-between">
              <span className="text-muted-foreground">Probabilidade de Renovação:</span>
              <span className="font-mono font-bold text-emerald-400">{welcome.renewalProbabilityPercent}%</span>
            </div>
          </div>
        </ExecutiveSurface>
      </div>

      {/* 6. Executive Daily Briefing™ Ritual Card */}
      <ExecutiveSurface variant="default" padding="md" radius="lg" className="border border-indigo-500/30">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-400" />
            <h3 className="font-bold text-sm text-foreground">{welcome.ritual?.ritualName}</h3>
          </div>
          <ExecutiveBadge variant="info" className="font-mono">Tempo Estimado: {welcome.ritual?.estimatedStabilizationTimeFormatted}</ExecutiveBadge>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 text-xs">
          {welcome.ritual?.ritualSequence.map((step, idx) => (
            <div key={idx} className="p-2.5 rounded bg-background/50 border border-border/30">
              <span className="font-bold text-indigo-400 block text-[10px]">PASSO {idx + 1}</span>
              <span className="font-semibold text-foreground">{step}</span>
            </div>
          ))}
        </div>
      </ExecutiveSurface>

      {/* 7. Executive Mandatory Closing Question Card */}
      <div className="p-4 rounded-xl bg-purple-950/30 border border-purple-500/40 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3">
          <HelpCircle className="w-6 h-6 text-purple-400" />
          <div>
            <span className="font-bold text-purple-300 block text-[11px] uppercase">Ação Imediata do Dia:</span>
            <span className="font-bold text-sm text-foreground">{welcome.closingActionQuestion}</span>
          </div>
        </div>
        <ExecutiveBadge variant="info" className="cursor-pointer hover:bg-purple-500/30 flex items-center gap-1 font-mono text-xs py-1.5 px-3">
          Iniciar Agora <ArrowRight className="w-3.5 h-3.5" />
        </ExecutiveBadge>
      </div>

      {/* 8. Footer */}
      <ExecutiveSurface variant="default" padding="md" radius="lg">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Executive Identity Experience EWIX v1.2 Active for {companyId}</span>
          </div>
          <span>Platform v1.0 Compliant</span>
        </div>
      </ExecutiveSurface>
    </div>
  );
};
