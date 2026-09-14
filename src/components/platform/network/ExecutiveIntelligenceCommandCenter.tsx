import React from 'react';
import { ExecutiveSurface } from '../../ui/executive-surface';
import { ExecutiveBadge } from '../../ui/executive-badge';
import { CapabilityMapCard } from './CapabilityMapCard';
import { Network, ShieldCheck, Route, Clock, Lock, BrainCircuit } from 'lucide-react';
import { IntelligenceNetworkOrchestrationEngine } from '../../../../packages/shell/intelligence-network/src/IntelligenceNetworkOrchestrationEngine';

export interface ExecutiveIntelligenceCommandCenterProps {
  readonly companyId?: string;
}

export const ExecutiveIntelligenceCommandCenter: React.FC<ExecutiveIntelligenceCommandCenterProps> = ({
  companyId = 'empresa-demo'
}) => {
  const orchestration = IntelligenceNetworkOrchestrationEngine.orchestrateNetwork(companyId, 'FINANCIAL');

  return (
    <div className="w-full space-y-6">
      {/* 1. Platform Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-xl bg-background/80 border border-border/60 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            <Network className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight text-foreground">Executive Governance Command Center</h1>
              <ExecutiveBadge variant="info" className="font-mono">ICL / IIN v1.0 Governed</ExecutiveBadge>
            </div>
            <p className="text-xs text-muted-foreground">Painel de Comando da Inteligência Organizacional: Coordenação de contexto, políticas, roteamento e observabilidade.</p>
          </div>
        </div>
      </div>

      {/* 2. Registered Capabilities Map */}
      <CapabilityMapCard />

      {/* 3. Governance Panels Grid (Execution Timeline, Policy Decisions, Learning Feedback) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Execution Timeline Panel */}
        <ExecutiveSurface variant="default" padding="md" radius="lg">
          <div className="flex items-center gap-2 mb-3">
            <Clock className="w-4 h-4 text-cyan-400" />
            <h3 className="font-semibold text-sm">Execution Timeline</h3>
          </div>
          <div className="space-y-1.5 text-xs font-mono">
            {orchestration.observabilityTrace.executionChain.map((step, idx) => (
              <div key={idx} className="p-1.5 rounded bg-background/40 border border-border/30 text-[11px]">
                <span className="text-muted-foreground">[{idx + 1}]</span> {step}
              </div>
            ))}
          </div>
        </ExecutiveSurface>

        {/* Policy Decisions Panel */}
        <ExecutiveSurface variant="default" padding="md" radius="lg">
          <div className="flex items-center gap-2 mb-3">
            <Lock className="w-4 h-4 text-amber-400" />
            <h3 className="font-semibold text-sm">Policy Decisions</h3>
          </div>
          <div className="space-y-2 text-xs">
            <div className="p-2.5 rounded bg-background/40 border border-border/30">
              <div className="flex justify-between items-center mb-1">
                <span className="font-bold text-foreground">{orchestration.evaluatedPolicy.policyName}</span>
                <ExecutiveBadge variant="success">{orchestration.evaluatedPolicy.complianceLevel}</ExecutiveBadge>
              </div>
              <p className="text-[11px] text-muted-foreground">{orchestration.evaluatedPolicy.policyReason}</p>
            </div>
          </div>
        </ExecutiveSurface>

        {/* Learning Feedback Panel */}
        <ExecutiveSurface variant="default" padding="md" radius="lg">
          <div className="flex items-center gap-2 mb-3">
            <BrainCircuit className="w-4 h-4 text-purple-400" />
            <h3 className="font-semibold text-sm">Learning Feedback</h3>
          </div>
          <div className="space-y-2 text-xs">
            <div className="p-2.5 rounded bg-background/40 border border-border/30">
              <span className="font-bold text-foreground">Wisdom Objects Aplicados:</span> {orchestration.observabilityTrace.wisdomAppliedCount}
            </div>
            <div className="p-2.5 rounded bg-background/40 border border-border/30">
              <span className="font-bold text-foreground">Evolução de Confiança:</span> {orchestration.observabilityTrace.confidenceEvolution.join(' % ➔ ')}%
            </div>
          </div>
        </ExecutiveSurface>
      </div>

      {/* 4. Audit Trail Status */}
      <ExecutiveSurface variant="default" padding="md" radius="lg">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Governance Coordination Layer Active for {companyId}</span>
          </div>
          <span>Domain Governance Registry v1.0 Compliant</span>
        </div>
      </ExecutiveSurface>
    </div>
  );
};
