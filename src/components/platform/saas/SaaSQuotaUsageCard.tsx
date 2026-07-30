import React from 'react';
import { PieChart } from 'lucide-react';
import { ExecutiveSurface } from '../../ui/executive-surface';
import { ExecutiveText } from '../../ui/executive-typography';
import { SaaSQuotaContract } from '@illumine/executive-contracts';

export interface SaaSQuotaUsageCardProps {
  readonly quota: SaaSQuotaContract;
}

export const SaaSQuotaUsageCard: React.FC<SaaSQuotaUsageCardProps> = ({ quota }) => {
  return (
    <ExecutiveSurface className="p-4 mb-4 bg-card border border-border rounded-lg shadow-sm">
      <div className="flex items-center gap-2 mb-2 pb-2 border-b border-border/50">
        <PieChart className="w-4 h-4 text-primary" />
        <ExecutiveText variant="sectionTitle" className="font-semibold text-primary">
          Uso de Quotas SaaS & Limites Operacionais
        </ExecutiveText>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs mt-2">
        <div>Empresas: <strong className="text-foreground">{quota.currentCompanies} / {quota.maxCompanies}</strong></div>
        <div>Usuários: <strong className="text-foreground">{quota.currentUserCount} / {quota.maxUsers}</strong></div>
        <div>Advisors: <strong className="text-foreground">{quota.currentAdvisorCount} / {quota.maxAdvisors}</strong></div>
        <div>Chamadas IA: <strong className="text-primary">{quota.currentMonthlyAICalls} / {quota.maxMonthlyAICalls}</strong></div>
      </div>
    </ExecutiveSurface>
  );
};
