import React from 'react';
import { ExecutiveSurface } from '../../ui/executive-surface';
import { ExecutiveBadge } from '../../ui/executive-badge';
import { UserCheck, ShieldAlert, CheckCircle } from 'lucide-react';

export const ApprovalFlowCard: React.FC = () => {
  return (
    <ExecutiveSurface variant="default" padding="md" radius="lg" className="border border-border/40">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <UserCheck className="w-5 h-5 text-blue-400" />
          <h3 className="font-semibold text-sm">Human Approval Governance Matrix</h3>
        </div>
        <ExecutiveBadge variant="info" className="font-mono">Approval Policy Active</ExecutiveBadge>

      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 text-xs">
        <div className="p-2 rounded bg-background/50 border border-border/30">
          <span className="font-bold text-slate-400 block mb-1">Risco BAIXO</span>
          <span className="text-emerald-400 font-medium">Aprovação Automática</span>
        </div>
        <div className="p-2 rounded bg-background/50 border border-border/30">
          <span className="font-bold text-blue-400 block mb-1">Risco MÉDIO</span>
          <span className="text-foreground font-medium">Gestor Financeiro</span>
        </div>
        <div className="p-2 rounded bg-background/50 border border-border/30">
          <span className="font-bold text-amber-400 block mb-1">Risco ALTO</span>
          <span className="text-amber-400 font-medium">Diretoria Executiva</span>
        </div>
        <div className="p-2 rounded bg-background/50 border border-border/30">
          <span className="font-bold text-rose-400 block mb-1">Risco CRÍTICO</span>
          <span className="text-rose-400 font-medium">Conselho de Adm</span>
        </div>
      </div>
    </ExecutiveSurface>
  );
};
