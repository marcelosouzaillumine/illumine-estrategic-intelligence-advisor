import React from 'react';
import { DollarSign } from 'lucide-react';
import { ExecutiveSurface } from '../../ui/executive-surface';
import { ExecutiveText } from '../../ui/executive-typography';
import { RevenueSharingContract } from '@illumine/executive-contracts';
import { useExecutiveFormatter } from '@/core/localization';

export interface RevenueSplitLedgerCardProps {
  readonly revenueSplit: RevenueSharingContract;
}

export const RevenueSplitLedgerCard: React.FC<RevenueSplitLedgerCardProps> = ({ revenueSplit }) => {
  const formatter = useExecutiveFormatter();
  return (
    <ExecutiveSurface className="p-4 mb-4 bg-card border border-border rounded-lg shadow-sm">
      <div className="flex items-center gap-2 mb-2 pb-2 border-b border-border/50">
        <DollarSign className="w-4 h-4 text-success" />
        <ExecutiveText variant="sectionTitle" className="font-semibold text-primary">
          Revenue Sharing Ledger & Royalties Split
        </ExecutiveText>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs mt-2">
        <div>Receita Bruta: <strong className="text-foreground">{formatter.currency(revenueSplit.grossAmount)}</strong></div>
        <div>Royalty Plataforma (15%): <strong className="text-primary">{formatter.currency(revenueSplit.platformRoyaltyAmount)}</strong></div>
        <div>Comissão Partner (50%): <strong className="text-success">{formatter.currency(revenueSplit.partnerCommissionAmount)}</strong></div>
        <div>Advisor Share (25%): <strong className="text-foreground">{formatter.currency(revenueSplit.advisorShareAmount)}</strong></div>
      </div>
    </ExecutiveSurface>
  );
};
