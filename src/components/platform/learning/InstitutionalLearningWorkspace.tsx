import React from 'react';
import { ExecutiveSurface } from '../../ui/executive-surface';
import { ExecutiveBadge } from '../../ui/executive-badge';
import { InstitutionalMemoryCard } from './InstitutionalMemoryCard';
import { Brain, ShieldCheck, GitMerge, TrendingUp, Sparkles } from 'lucide-react';
import { InstitutionalMemoryLedgerEngine } from '../../../../packages/product/institutional-learning-intelligence/src/InstitutionalMemoryLedgerEngine';

export interface InstitutionalLearningWorkspaceProps {
  readonly companyId?: string;
}

export const InstitutionalLearningWorkspace: React.FC<InstitutionalLearningWorkspaceProps> = ({
  companyId = 'empresa-demo'
}) => {
  const wisdomCount = InstitutionalMemoryLedgerEngine.getStoredWisdom().length;

  return (
    <div className="w-full space-y-6">
      {/* 1. Platform Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-xl bg-background/80 border border-border/60 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/20">
            <Brain className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight text-foreground">Institutional Learning Governance Layer</h1>
              <ExecutiveBadge variant="info" className="font-mono">ILI v1.0 Governed</ExecutiveBadge>
            </div>
            <p className="text-xs text-muted-foreground">Sistema de síntese de sabedoria institucional permanente, calibração decisória e evolução do Grafo Causal.</p>
          </div>
        </div>
      </div>

      {/* 2. Memory Triad Card */}
      <InstitutionalMemoryCard />

      {/* 3. Wisdom Synthesis Workspace */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ExecutiveSurface variant="default" padding="md" radius="lg">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <h3 className="font-semibold text-sm">Institutional Wisdom Objects ({wisdomCount})</h3>
          </div>
          <div className="space-y-2 text-xs">
            <div className="p-2.5 rounded bg-background/50 border border-border/40">
              <div className="flex justify-between items-center mb-1">
                <span className="font-bold text-foreground">Efeito de Redução de OPEX sobre EBITDA</span>
                <ExecutiveBadge variant="success">SEMANTIC</ExecutiveBadge>
              </div>
              <p className="text-muted-foreground text-[11px]">Aprendizado Causal: Redução de 10% no OPEX administrativo aumentou a margem líquida em 2.4% sem afetar a retenção comercial.</p>
            </div>
          </div>
        </ExecutiveSurface>

        <ExecutiveSurface variant="default" padding="md" radius="lg">
          <div className="flex items-center gap-2 mb-3">
            <GitMerge className="w-4 h-4 text-blue-400" />
            <h3 className="font-semibold text-sm">Knowledge Evolution Pipeline</h3>
          </div>
          <div className="space-y-2 text-xs">
            <div className="p-2 rounded bg-background/40 border border-border/30">
              <span className="font-bold text-purple-400">Step 1:</span> Workflow Outcome Signal & Audit Ledger Entry
            </div>
            <div className="p-2 rounded bg-background/40 border border-border/30">
              <span className="font-bold text-purple-400">Step 2:</span> Institutional Wisdom Object Synthesis
            </div>
            <div className="p-2 rounded bg-background/40 border border-border/30">
              <span className="font-bold text-purple-400">Step 3:</span> Causal Wisdom Graph Evolution
            </div>
            <div className="p-2 rounded bg-background/40 border border-border/30">
              <span className="font-bold text-purple-400">Step 4:</span> Decision Governance Context Calibration
                                      </div>
          </div>
        </ExecutiveSurface>
      </div>

      {/* 4. Audit Trail & Evolution Status */}
      <ExecutiveSurface variant="default" padding="md" radius="lg">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Institutional Wisdom Memory active for {companyId}</span>
          </div>
          <span>Domain Governance Registry v1.0 Compliant</span>
        </div>
      </ExecutiveSurface>
    </div>
  );
};
