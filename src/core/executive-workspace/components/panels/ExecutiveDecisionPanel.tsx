import React from 'react';
import { ExecutiveText, ExecutiveMetric } from '@/components/ui/executive-typography';
import { useTranslation } from 'react-i18next';
import { Target, TrendingUp, AlertTriangle, ShieldCheck } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface DecisionPanelData {
  expectedRoi: number;
  expectedArr: number;
  expectedMrr: number;
  cac: number;
  ltv: number;
  margin: number;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  probability: number;
  healthScore: number;
}

export function ExecutiveDecisionPanel({ data }: { data: DecisionPanelData }) {
  const { t } = useTranslation();

  return (
    <div className="bg-card rounded-2xl border border-border p-5 flex flex-col gap-6 shadow-sm">
      <div className="flex items-center gap-2">
        <Target size={16} className="text-primary" />
        <ExecutiveText variant="moduleTitle" className="text-base">{t('dealRoom.decisionPanel', 'Executive Decision Panel™')}</ExecutiveText>
      </div>

      {/* Hero Metrics */}
      <div className="flex flex-col gap-1">
        <ExecutiveText variant="caption" className="text-muted-foreground">{t('dealRoom.expectedArr', 'Expected ARR')}</ExecutiveText>
        <ExecutiveMetric variant="heroMetric" className="text-3xl font-display text-primary">
          {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(data.expectedArr)}
        </ExecutiveMetric>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <DecisionMetric labelKey="dealRoom.mrr" value={new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(data.expectedMrr)} />
        <DecisionMetric labelKey="dealRoom.roi" value={`${data.expectedRoi}%`} />
        <DecisionMetric labelKey="dealRoom.margin" value={`${data.margin}%`} />
        <DecisionMetric labelKey="dealRoom.probability" value={`${data.probability}%`} />
      </div>

      {/* Health & Risk */}
      <div className="pt-4 border-t border-border flex justify-between items-center">
        <div className="flex flex-col gap-1">
          <ExecutiveText variant="caption" className="text-muted-foreground">{t('dealRoom.healthScore', 'Health Score')}</ExecutiveText>
          <div className="flex items-center gap-2">
            <ShieldCheck size={16} className={data.healthScore >= 80 ? "text-success" : "text-warning"} />
            <ExecutiveText variant="label" className="text-lg font-bold">{data.healthScore}/100</ExecutiveText>
          </div>
        </div>
        <div className="flex flex-col gap-1 items-end">
          <ExecutiveText variant="caption" className="text-muted-foreground">{t('dealRoom.risk', 'Risk Level')}</ExecutiveText>
          <div className={cn(
            "flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold",
            data.riskLevel === 'LOW' ? "bg-success-soft text-success" :
            data.riskLevel === 'MEDIUM' ? "bg-warning-soft text-warning" : "bg-critical-soft text-critical"
          )}>
            <AlertTriangle size={12} />
            {data.riskLevel}
          </div>
        </div>
      </div>
    </div>
  );
}

function DecisionMetric({ labelKey, value }: { labelKey: string, value: string }) {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col gap-1">
      <ExecutiveText variant="caption" className="text-[10px] uppercase text-muted-foreground tracking-wider">{t(labelKey)}</ExecutiveText>
      <ExecutiveText variant="label" className="text-base font-semibold">{value}</ExecutiveText>
    </div>
  );
}
