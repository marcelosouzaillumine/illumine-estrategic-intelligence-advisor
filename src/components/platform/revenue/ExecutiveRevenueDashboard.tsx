import React from 'react';
import { ExecutiveSurface } from '../../ui/executive-surface';
import { ExecutiveBadge } from '../../ui/executive-badge';
import { ExecutiveCRMCard } from './ExecutiveCRMCard';
import { DollarSign, TrendingUp, Users, Award, ShieldCheck, HeartHandshake } from 'lucide-react';
import { ExecutiveLeadEngine } from '../../../../packages/platform/executive-revenue/src/ExecutiveLeadEngine';
import { ExecutiveValueDeliveryEngine } from '../../../../packages/platform/executive-revenue/src/ExecutiveValueDeliveryEngine';
import { ExecutivePartnerCenterEngine } from '../../../../packages/platform/executive-revenue/src/ExecutivePartnerCenterEngine';
import { ExecutiveRevenueObservabilityEngine } from '../../../../packages/platform/executive-revenue/src/ExecutiveRevenueObservabilityEngine';
import { useExecutiveFormatter } from '@/core/localization';

export interface ExecutiveRevenueDashboardProps {
  readonly companyId?: string;
}

export const ExecutiveRevenueDashboard: React.FC<ExecutiveRevenueDashboardProps> = ({
  companyId = 'empresa-demo'
}) => {
  const formatter = useExecutiveFormatter();
  const crm = ExecutiveLeadEngine.getActiveCRM();
  const cs = ExecutiveValueDeliveryEngine.getCustomerHealth('Grupo Industrial Alfa');
  const partner = ExecutivePartnerCenterEngine.getPartnerStatus('Strategic Advisory Partners');
  const ers = ExecutiveRevenueObservabilityEngine.calculateERSScore(companyId);

  return (
    <div className="w-full space-y-6">
      {/* 1. Platform Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-xl bg-background/80 border border-border/60 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight text-foreground">Executive Revenue System™</h1>
              <ExecutiveBadge variant="info" className="font-mono">ERS v1.0 / ERL v1.0 Governed</ExecutiveBadge>
            </div>
            <p className="text-xs text-muted-foreground">Command Center Comercial: Máquina escalável de aquisição, conversão, retenção e expansão de ARR/MRR.</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <ExecutiveBadge variant="warning" className="font-mono text-[10px]">BENCHMARK SIMULADO</ExecutiveBadge>
          <ExecutiveBadge variant="success" className="font-mono">MRR: {formatter.currency(ers.mrrValue)}</ExecutiveBadge>
          <ExecutiveBadge variant="info" className="font-mono">ARR: {formatter.currency(ers.arrValue)}</ExecutiveBadge>
        </div>

      </div>

      {/* 2. Pipeline CRM Card */}
      <ExecutiveCRMCard crm={crm} />

      {/* 3. Customer Success & Partner Portal Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ExecutiveSurface variant="default" padding="md" radius="lg">
          <div className="flex items-center gap-2 mb-3">
            <Users className="w-4 h-4 text-cyan-400" />
            <h3 className="font-semibold text-sm">Customer Success & Health Score</h3>
          </div>
          <div className="space-y-2 text-xs">
            <div className="p-2.5 rounded bg-background/50 border border-border/30 flex justify-between items-center">
              <span>Health Score ({cs.companyName})</span>
              <ExecutiveBadge variant="success">{cs.healthScore} / 100</ExecutiveBadge>
            </div>
            <div className="p-2.5 rounded bg-background/50 border border-border/30 flex justify-between items-center">
              <span>Engajamento & Risco de Churn</span>
              <span className="font-bold text-emerald-400">{cs.engagementLevel} ({formatter.percentage(cs.churnRiskPercent / 100, { maximumFractionDigits: 0 })} churn risk)</span>
            </div>
            <div className="p-2.5 rounded bg-background/50 border border-border/30 flex justify-between items-center">
              <span>Oportunidades de Expansão (Upsell)</span>
              <span className="font-bold text-emerald-400">{formatter.currency(cs.expansionOpportunityValue)}</span>
            </div>
          </div>
        </ExecutiveSurface>

        <ExecutiveSurface variant="default" padding="md" radius="lg">
          <div className="flex items-center gap-2 mb-3">
            <HeartHandshake className="w-4 h-4 text-purple-400" />
            <h3 className="font-semibold text-sm">Executive Partner Portal</h3>
          </div>
          <div className="space-y-2 text-xs">
            <div className="p-2.5 rounded bg-background/50 border border-border/30 flex justify-between items-center">
              <span>Parceiro ({partner.partnerName})</span>
              <ExecutiveBadge variant="info">{partner.tier} TIER</ExecutiveBadge>
            </div>
            <div className="p-2.5 rounded bg-background/50 border border-border/30 flex justify-between items-center">
              <span>Pipeline Compartilhado</span>
              <span className="font-bold text-purple-400">{formatter.currency(partner.activeSharedPipelineValue)}</span>
            </div>
            <div className="p-2.5 rounded bg-background/50 border border-border/30 flex justify-between items-center">
              <span>Comissões Acumuladas</span>
              <span className="font-bold text-purple-400">{formatter.currency(partner.accruedCommissionsValue)}</span>
            </div>
          </div>
        </ExecutiveSurface>
      </div>

      {/* 4. Audit Trail Status */}
      <ExecutiveSurface variant="default" padding="md" radius="lg">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Executive Revenue System active for {companyId}</span>
          </div>
          <span>Platform Experience Protocol Compliant</span>
        </div>
      </ExecutiveSurface>
    </div>
  );
};
