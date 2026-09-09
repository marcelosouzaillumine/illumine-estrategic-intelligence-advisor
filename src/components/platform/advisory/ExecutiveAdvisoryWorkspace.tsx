import React from 'react';
import { ExecutiveSurface } from '../../ui/executive-surface';
import { ExecutiveBadge } from '../../ui/executive-badge';
import { RecommendationCard } from './RecommendationCard';
import { Lightbulb, ShieldCheck, Compass, Sliders, CheckCircle2 } from 'lucide-react';
import { ExecutiveAdvisorEngine } from '../../../../packages/intelligence/executive-advisory-intelligence/src/ExecutiveAdvisorEngine';

export interface ExecutiveAdvisoryWorkspaceProps {
  readonly companyId?: string;
}

export const ExecutiveAdvisoryWorkspace: React.FC<ExecutiveAdvisoryWorkspaceProps> = ({
  companyId = 'empresa-demo'
}) => {
  const advisory = ExecutiveAdvisorEngine.generateExecutiveAdvisory(companyId);

  return (
    <div className="w-full space-y-6">
      {/* 1. Platform Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-xl bg-background/80 border border-border/60 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <Lightbulb className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight text-foreground">Executive Advisory Governance Layer</h1>
              <ExecutiveBadge variant="info" className="font-mono">EAIL v1.0 Governed</ExecutiveBadge>
            </div>
            <p className="text-xs text-muted-foreground">Sistema de aconselhamento executivo baseado em evidências, contrapontos fiduciários e chancela humana obrigatória.</p>
          </div>
        </div>
      </div>

      {/* 2. Recommendations List */}
      <div className="space-y-4">
        {advisory.recommendations.map((rec) => (
          <RecommendationCard key={rec.recommendationId} recommendation={rec} />
        ))}
      </div>

      {/* 3. Scenario & Advisory Governance Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ExecutiveSurface variant="default" padding="md" radius="lg">
          <div className="flex items-center gap-2 mb-3">
            <Sliders className="w-4 h-4 text-emerald-400" />
            <h3 className="font-semibold text-sm">Strategic Scenario Simulation</h3>
          </div>
          <div className="space-y-2 text-xs">
            <div className="p-2.5 rounded bg-background/50 border border-border/40 flex justify-between items-center">
              <span>Cenário Atual Baseline (EBITDA / Dívida)</span>
              <span className="font-mono text-muted-foreground">8.0% / 65%</span>
            </div>
            <div className="p-2.5 rounded bg-background/50 border border-emerald-500/30 flex justify-between items-center">
              <span className="font-bold text-emerald-400">Cenário Recomendado Projetado</span>
              <span className="font-mono text-emerald-400 font-bold">11.5% / 43% (+3.5%)</span>
            </div>
          </div>
        </ExecutiveSurface>

        <ExecutiveSurface variant="default" padding="md" radius="lg">
          <div className="flex items-center gap-2 mb-3">
            <Compass className="w-4 h-4 text-purple-400" />
            <h3 className="font-semibold text-sm">Constitutional Advisory Pipeline</h3>
          </div>
          <div className="space-y-2 text-xs">
            <div className="p-2 rounded bg-background/40 border border-border/30">
              <span className="font-bold text-indigo-400">Step 1:</span> Evidence & CounterArguments Assembly
            </div>
            <div className="p-2 rounded bg-background/40 border border-border/30">
              <span className="font-bold text-indigo-400">Step 2:</span> Strategic Scenario Consequences Modeling
            </div>
            <div className="p-2 rounded bg-background/40 border border-border/30">
              <span className="font-bold text-indigo-400">Step 3:</span> Human Executive Review & Approval Gate
            </div>
            <div className="p-2 rounded bg-background/40 border border-border/30">
              <span className="font-bold text-indigo-400">Step 4:</span> Conversion to DecisionCommandEnvelope
            </div>
          </div>
        </ExecutiveSurface>
      </div>

      {/* 4. Audit Trail Status */}
      <ExecutiveSurface variant="default" padding="md" radius="lg">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>AI Advice ≠ AI Decision Rule Enforced for {companyId}</span>
          </div>
          <span>Domain Governance Registry v1.0 Compliant</span>
        </div>
      </ExecutiveSurface>
    </div>
  );
};
