import React from 'react';
import { ExecutiveSurface } from '../../ui/executive-surface';
import { ExecutiveBadge } from '../../ui/executive-badge';
import { ExecutiveNarrativeCard } from './ExecutiveNarrativeCard';
import { Sparkles, Compass, Target, Clock, ShieldCheck, PlayCircle, Layers } from 'lucide-react';
import { ExecutiveNarrativeEngine } from '../../../../packages/platform/executive-product-experience/src/ExecutiveNarrativeEngine';
import { ExecutiveInsightPrioritizationEngine } from '../../../../packages/platform/executive-product-experience/src/ExecutiveInsightPrioritizationEngine';
import { ExecutiveValueVisualizationEngine } from '../../../../packages/platform/executive-product-experience/src/ExecutiveValueVisualizationEngine';
import { ExecutiveExperienceScoreEngine } from '../../../../packages/platform/executive-product-experience/src/ExecutiveExperienceScoreEngine';

export interface ExecutiveProductExperienceWorkspaceProps {
  readonly companyId?: string;
}

export const ExecutiveProductExperienceWorkspace: React.FC<ExecutiveProductExperienceWorkspaceProps> = ({
  companyId = 'empresa-demo'
}) => {
  const narrative = ExecutiveNarrativeEngine.translateToExecutiveNarrative('Margem EBITDA', 8.5);
  const prioritization = ExecutiveInsightPrioritizationEngine.prioritizeCompanyInsights(companyId);
  const valueView = ExecutiveValueVisualizationEngine.generateEightQuestionsView(companyId);
  const eesScore = ExecutiveExperienceScoreEngine.calculateEES(companyId);

  return (
    <div className="w-full space-y-6">
      {/* 1. Commercial Header & Demo Mode Badge */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-xl bg-background/80 border border-border/60 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight text-foreground">Executive Product Experience™ (EPX v1.0)</h1>
              <ExecutiveBadge variant="success" className="font-mono">Commercial GTM Mode</ExecutiveBadge>
            </div>
            <p className="text-xs text-muted-foreground">Sistema Operacional de Decisão Executiva — Conversão imediata de inteligência em percepção de valor.</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <ExecutiveBadge variant="info" className="flex items-center gap-1 font-mono">
            <PlayCircle className="w-3.5 h-3.5" /> 5-Min Executive Tour
          </ExecutiveBadge>
          <ExecutiveBadge variant="info" className="font-mono">EES Score: {eesScore.eesOverallScore}</ExecutiveBadge>
        </div>
      </div>

      {/* 2. Executive Narrative Banner */}
      <ExecutiveNarrativeCard narrative={narrative} />

      {/* 3. The 8 Executive Questions Grid (Executive Value Visualization) */}
      <ExecutiveSurface variant="default" padding="md" radius="lg" className="border border-border/40">
        <div className="flex items-center gap-2 mb-3">
          <Compass className="w-5 h-5 text-indigo-400" />
          <h3 className="font-semibold text-sm">Visão de Valor Executiva (As 8 Perguntas Fundamentais)</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
          <div className="p-2.5 rounded bg-background/50 border border-border/30">
            <span className="font-bold text-muted-foreground block text-[10px] uppercase">1. Onde estou?</span>
            <span className="font-medium text-foreground">{valueView.whereAmI}</span>
          </div>
          <div className="p-2.5 rounded bg-background/50 border border-border/30">
            <span className="font-bold text-muted-foreground block text-[10px] uppercase">2. O que aconteceu?</span>
            <span className="font-medium text-foreground">{valueView.whatHappened}</span>
          </div>
          <div className="p-2.5 rounded bg-background/50 border border-border/30">
            <span className="font-bold text-muted-foreground block text-[10px] uppercase">3. Por que aconteceu?</span>
            <span className="font-medium text-foreground">{valueView.whyItHappened}</span>
          </div>
          <div className="p-2.5 rounded bg-background/50 border border-border/30">
            <span className="font-bold text-amber-400 block text-[10px] uppercase">4. Qual o risco?</span>
            <span className="font-medium text-amber-400 font-bold">{valueView.whatIsTheRisk}</span>
          </div>
          <div className="p-2.5 rounded bg-background/50 border border-border/30">
            <span className="font-bold text-purple-400 block text-[10px] uppercase">5. O que devo fazer?</span>
            <span className="font-medium text-purple-400 font-bold">{valueView.whatShouldIDo}</span>
          </div>
          <div className="p-2.5 rounded bg-background/50 border border-emerald-500/30">
            <span className="font-bold text-emerald-400 block text-[10px] uppercase">6. Impacto Financeiro</span>
            <span className="font-bold text-emerald-400">{valueView.financialImpactValue}</span>
          </div>
          <div className="p-2.5 rounded bg-background/50 border border-border/30">
            <span className="font-bold text-muted-foreground block text-[10px] uppercase">7. Prazo</span>
            <span className="font-medium text-foreground">{valueView.timeFrameDays} dias</span>
          </div>
          <div className="p-2.5 rounded bg-background/50 border border-border/30">
            <span className="font-bold text-muted-foreground block text-[10px] uppercase">8. Responsável</span>
            <span className="font-medium text-foreground">{valueView.assignedOwner}</span>
          </div>
        </div>
      </ExecutiveSurface>

      {/* 4. Priorities & Commercial Tour Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ExecutiveSurface variant="default" padding="md" radius="lg">
          <div className="flex items-center gap-2 mb-3">
            <Target className="w-4 h-4 text-emerald-400" />
            <h3 className="font-semibold text-sm">Top 3 Prioridades & Quick Wins</h3>
          </div>
          <div className="space-y-2 text-xs">
            {prioritization.items.map((item) => (
              <div key={item.itemId} className="p-2.5 rounded bg-background/50 border border-border/30 flex justify-between items-center">
                <div>
                  <span className="font-bold text-foreground">{item.title}</span>
                  <p className="text-[11px] text-muted-foreground">Retorno em: {item.expectedReturnDays} dias</p>
                </div>
                <ExecutiveBadge variant={item.category === 'CRITICAL_RISK' ? 'warning' : 'success'}>{item.category}</ExecutiveBadge>
              </div>
            ))}
          </div>
        </ExecutiveSurface>

        <ExecutiveSurface variant="default" padding="md" radius="lg">
          <div className="flex items-center gap-2 mb-3">
            <Layers className="w-4 h-4 text-cyan-400" />
            <h3 className="font-semibold text-sm">Executive Journey Framework</h3>
          </div>
          <div className="space-y-2 text-xs">
            <div className="p-2 rounded bg-background/40 border border-border/30">
              <span className="font-bold text-cyan-400">Fluxo Institucional:</span> Descobrir ➔ Compreender ➔ Priorizar ➔ Decidir ➔ Executar ➔ Acompanhar ➔ Aprender
            </div>
            <div className="p-2 rounded bg-background/40 border border-border/30">
              <span className="font-bold text-cyan-400">Tempo de Compreensão (EES):</span> {eesScore.timeToUnderstandingSeconds}s
            </div>
            <div className="p-2 rounded bg-background/40 border border-border/30">
              <span className="font-bold text-cyan-400">Taxa de Execução Recomendada:</span> {eesScore.executionRatePercent}%
            </div>
          </div>
        </ExecutiveSurface>
      </div>

      {/* 5. Audit Trail & Certification */}
      <ExecutiveSurface variant="default" padding="md" radius="lg">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Executive Product Experience Protocol active for {companyId}</span>
          </div>
          <span>Platform Experience Protocol Compliant</span>
        </div>
      </ExecutiveSurface>
    </div>
  );
};
