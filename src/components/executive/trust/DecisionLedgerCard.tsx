import React from 'react';
import { ShieldCheck } from 'lucide-react';
import { ExecutiveSurface } from '../../ui/executive-surface';
import { ExecutiveText } from '../../ui/executive-typography';
import { DecisionLedgerContract } from '@illumine/executive-contracts';

export interface DecisionLedgerCardProps {
  readonly ledgerRecord: DecisionLedgerContract;
}

export const DecisionLedgerCard: React.FC<DecisionLedgerCardProps> = ({ ledgerRecord }) => {
  return (
    <ExecutiveSurface className="p-4 mb-4 bg-card border border-border rounded-lg shadow-sm">
      <div className="flex items-center justify-between gap-2 mb-2 pb-2 border-b border-border/50">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-success" />
          <ExecutiveText variant="sectionTitle" className="font-semibold text-primary">
            Executive Decision Ledger — Registro Imutável
          </ExecutiveText>
        </div>
        <span className="font-mono text-[10px] text-muted-foreground bg-surface-container/40 px-2 py-0.5 rounded border border-border/30">
          {ledgerRecord.immutableHash}
        </span>
      </div>

      <div className="text-xs text-muted-foreground space-y-1 mt-2">
        <div>Decidido por: <strong className="text-foreground">{ledgerRecord.decidedByRole}</strong></div>
        <div>Cenário Vencedor: <strong className="text-primary">{ledgerRecord.winningScenario}</strong></div>
        <div>Agentes Participantes: <strong className="text-foreground">{ledgerRecord.participatingAgents.join(', ')}</strong></div>
      </div>
    </ExecutiveSurface>
  );
};
