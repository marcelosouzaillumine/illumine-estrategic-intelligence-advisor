import React from 'react';
import { ExecutiveSurface } from '../../ui/executive-surface';
import { ExecutiveBadge } from '../../ui/executive-badge';
import { Users, ShieldCheck, HelpCircle, ArrowRight, Award, Trophy, Compass } from 'lucide-react';
import { ExecutiveWelcomeOrchestrator } from '../../../../packages/platform/executive-welcome/src/ExecutiveWelcomeOrchestrator';

export interface AdvisorWelcomeWorkspaceProps {
  readonly advisorName?: string;
}

export const AdvisorWelcomeWorkspace: React.FC<AdvisorWelcomeWorkspaceProps> = ({
  advisorName = 'Dr. Eduardo'
}) => {
  const welcome = ExecutiveWelcomeOrchestrator.buildWelcomeExperience('adv-01', advisorName, 'ADVISOR', 'carteira-advisory', 0, false);

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
              <h1 className="text-xl font-bold tracking-tight text-foreground">{welcome.greetingText}</h1>
              <ExecutiveBadge variant="info" className="font-mono text-[10px]">{welcome.ritual?.ritualName}</ExecutiveBadge>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">{welcome.briefing.headlineText}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <ExecutiveBadge variant="success" className="font-mono">Receita Preservada: {welcome.ritual?.revenuePreservedFormatted}</ExecutiveBadge>
          <ExecutiveBadge variant="info" className="font-mono text-[10px]">Saúde da Carteira: Top 94%</ExecutiveBadge>
        </div>
      </div>

      {/* 2. Advisor Legacy & Impact Banner */}
      {welcome.advisorLegacy && (
        <ExecutiveSurface variant="default" padding="md" radius="lg" className="border border-cyan-500/30 bg-cyan-500/5">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-cyan-400" />
              <h3 className="font-bold text-sm text-foreground">Seu Impacto Profissional na Carteira</h3>
            </div>
            {welcome.legacy?.isSimulatedBenchmark && (
              <ExecutiveBadge variant="warning" className="font-mono text-[9px]">
                BENCHMARK SIMULADO DE HOMOLOGAÇÃO
              </ExecutiveBadge>
            )}
          </div>
          <p className="text-xs text-foreground font-medium leading-relaxed">
            "{welcome.advisorLegacy.legacyNarrativeText}"
          </p>
        </ExecutiveSurface>
      )}

      {/* 3. Purpose Statement */}
      <ExecutiveSurface variant="default" padding="md" radius="lg" className="border border-purple-500/30">
        <div className="flex items-center gap-2 mb-2">
          <Compass className="w-4 h-4 text-purple-400" />
          <h3 className="font-bold text-sm text-foreground">Propósito da Sua Carteira</h3>
        </div>
        <p className="text-xs text-purple-200/90 leading-relaxed">
          Três clientes precisam da sua atenção imediata hoje. Você está construindo uma carteira mais saudável que 94% dos advisors da plataforma.
        </p>
      </ExecutiveSurface>

      {/* 4. Advisor Daily Ritual™ Card */}
      <ExecutiveSurface variant="default" padding="md" radius="lg" className="border border-cyan-500/30">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-cyan-400" />
            <h3 className="font-bold text-sm text-foreground">Sequência do Advisor Daily Ritual™</h3>
          </div>
          <ExecutiveBadge variant="info" className="font-mono">Tempo Estimado da Carteira: {welcome.ritual?.estimatedStabilizationTimeFormatted}</ExecutiveBadge>
        </div>
        <div className="space-y-2 text-xs">
          {welcome.ritual?.ritualSequence.map((step, idx) => (
            <div key={idx} className="p-2.5 rounded bg-background/50 border border-border/30 flex justify-between items-center">
              <span className="font-semibold text-foreground">{step}</span>
              <ExecutiveBadge variant="info">Passo {idx + 1}</ExecutiveBadge>
            </div>
          ))}
        </div>
      </ExecutiveSurface>

      {/* 5. Mandatory Closing Question Card */}
      <div className="p-4 rounded-xl bg-cyan-950/30 border border-cyan-500/40 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3">
          <HelpCircle className="w-6 h-6 text-cyan-400" />
          <div>
            <span className="font-bold text-cyan-300 block text-[11px] uppercase">Decisão do Comandante:</span>
            <span className="font-bold text-sm text-foreground">{welcome.closingActionQuestion}</span>
          </div>
        </div>
        <ExecutiveBadge variant="info" className="cursor-pointer hover:bg-cyan-500/30 flex items-center gap-1 font-mono text-xs py-1.5 px-3">
          Iniciar Atendimento <ArrowRight className="w-3.5 h-3.5" />
        </ExecutiveBadge>
      </div>

      {/* 6. Footer */}
      <ExecutiveSurface variant="default" padding="md" radius="lg">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Advisor Welcome Governance Protocol EWIX v1.2 Active</span>
          </div>
          <span>Platform v1.0 Compliant</span>
        </div>
      </ExecutiveSurface>
    </div>
  );
};
