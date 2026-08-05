import React from 'react';
import { ExecutiveSurface } from '../../ui/executive-surface';
import { ExecutiveBadge } from '../../ui/executive-badge';
import { DollarSign, Briefcase } from 'lucide-react';
import { ExecutiveCRMContract } from '@illumine/executive-contracts';
import { useExecutiveFormatter } from '@/core/localization';

export interface ExecutiveCRMCardProps {
  readonly crm: ExecutiveCRMContract;
}

export const ExecutiveCRMCard: React.FC<ExecutiveCRMCardProps> = ({ crm }) => {
  const formatter = useExecutiveFormatter();
  return (
    <ExecutiveSurface variant="default" padding="md" radius="lg" className="border border-border/40 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Briefcase className="w-5 h-5 text-emerald-400" />
          <h3 className="font-semibold text-sm">Pipeline Comercial Executive CRM</h3>
        </div>
        <ExecutiveBadge variant="success">Pipeline: {formatter.currency(crm.totalPipelineValue)}</ExecutiveBadge>
      </div>

      <div className="space-y-2 text-xs">
        {crm.opportunities.map((opp) => (
          <div key={opp.opportunityId} className="p-2.5 rounded bg-background/50 border border-border/30 flex justify-between items-center">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-foreground">{opp.companyName}</span>
                <ExecutiveBadge variant="info">{opp.stage}</ExecutiveBadge>
              </div>
              <p className="text-[11px] text-muted-foreground">Owner: {opp.assignedOwner} | Próxima Ação: {opp.nextRequiredAction}</p>
            </div>
            <div className="text-right font-mono">
              <span className="font-bold text-emerald-400">{formatter.currency(opp.expectedValue)}</span>
              <span className="text-[10px] text-muted-foreground block">Prob: {formatter.percentage(opp.winProbabilityPercent / 100, { maximumFractionDigits: 0 })}</span>
            </div>
          </div>
        ))}
      </div>
    </ExecutiveSurface>
  );
};
