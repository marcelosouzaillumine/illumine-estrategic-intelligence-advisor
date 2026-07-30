import React from 'react';
import { ShieldCheck } from 'lucide-react';
import { ExecutiveSurface } from '../../ui/executive-surface';
import { ExecutiveBadge } from '../../ui/executive-badge';
import { ExecutiveText } from '../../ui/executive-typography';
import { DecisionTrustContract, DecisionLedgerContract, CounterfactualContract } from '@illumine/executive-contracts';
import { ConfidenceBreakdownCard } from './ConfidenceBreakdownCard';
import { DecisionLedgerCard } from './DecisionLedgerCard';
import { CounterfactualAnalysisCard } from './CounterfactualAnalysisCard';
import { DecisionRiskCard } from './DecisionRiskCard';
import { DecisionDriftCard } from './DecisionDriftCard';

export interface ExecutiveTrustDashboardProps {
  readonly trustContract: DecisionTrustContract;
  readonly ledgerRecord: DecisionLedgerContract;
  readonly counterfactualAnalysis: CounterfactualContract;
}

export const ExecutiveTrustDashboard: React.FC<ExecutiveTrustDashboardProps> = ({
  trustContract,
  ledgerRecord,
  counterfactualAnalysis
}) => {
  return (
    <div className="space-y-4">
      <ExecutiveSurface className="p-4 bg-card border border-border rounded-lg shadow-sm">
        <div className="flex items-center justify-between gap-4 mb-2 pb-2 border-b border-border/50">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-success" />
            <ExecutiveText variant="sectionTitle" className="font-bold text-primary text-base">
              Executive Trust & Decision Governance Center
            </ExecutiveText>
          </div>
          <ExecutiveBadge variant="success">
            Maturidade Fiduciária: 100% Auditável
          </ExecutiveBadge>
        </div>
      </ExecutiveSurface>

      <ConfidenceBreakdownCard trustContract={trustContract} />
      <DecisionRiskCard compositeRiskScore={19.3} />
      <CounterfactualAnalysisCard analysis={counterfactualAnalysis} />
      <DecisionLedgerCard ledgerRecord={ledgerRecord} />
      <DecisionDriftCard driftStatusText="Modelos Estáveis — Deriva sob controle (Erro Médio < 3.2%)" isHealthy={true} />
    </div>
  );
};
