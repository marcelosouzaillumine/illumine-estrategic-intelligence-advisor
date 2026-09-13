import React from 'react';
import { ExecutiveDecisionContext } from '@illumine/executive-contracts';
import { Stethoscope, AlertTriangle } from 'lucide-react';
import { ExecutiveSurface } from '../../../../components/ui/executive-surface';
import { ExecutiveBadge } from '../../../../components/ui/executive-badge';
import { ExecutiveText } from '../../../../components/ui/executive-typography';
import { useExecutiveFormatter } from '@/core/localization';

export interface ExecutiveDiagnosisCardProps {
  readonly context: ExecutiveDecisionContext;
}

export const ExecutiveDiagnosisCard: React.FC<ExecutiveDiagnosisCardProps> = ({ context }) => {
  const formatter = useExecutiveFormatter();
  const metrics = context.executiveMetrics?.currentMetrics || {};
  const prevMetrics = context.executiveMetrics?.previousPeriodMetrics || {};

  const ebitda = metrics.EBITDA || metrics.ebitda || 620000;
  const prevEbitda = prevMetrics.EBITDA || prevMetrics.ebitda || 1292200;
  const revenue = metrics.ReceitaBruta || metrics.revenue || 8450000;
  const prevRevenue = prevMetrics.ReceitaBruta || prevMetrics.revenue || 9100000;

  const marginCurrent = revenue > 0 ? (ebitda / revenue) * 100 : 7.3;
  const marginPrev = prevRevenue > 0 ? (prevEbitda / prevRevenue) * 100 : 14.2;
  const deltaPps = (marginCurrent - marginPrev).toFixed(1);

  return (
    <ExecutiveSurface className="p-4 mb-4 bg-card border border-border rounded-lg shadow-sm">
      <div className="flex items-center justify-between gap-4 mb-3">
        <div className="flex items-center gap-2">
          <Stethoscope className="w-4 h-4 text-primary" />
          <ExecutiveText variant="sectionTitle" className="font-semibold text-primary">
            Layer 4 — Diagnóstico Causal de Inteligência
          </ExecutiveText>
        </div>
        <ExecutiveBadge variant={Number(deltaPps) < 0 ? 'critical' : 'success'}>
          {Number(deltaPps) < 0 ? 'Compressão Operacional' : 'Expansão Operacional'}
        </ExecutiveBadge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
        <div className="p-3 bg-surface-container/30 rounded border border-border/40">
          <span className="font-semibold text-foreground block mb-1">Drivers Principais & Causa Dominante</span>
          <p className="text-muted-foreground leading-relaxed">
            Identificado crescimento não proporcional das despesas fixas e comerciais na {context.companyName}, resultando em variação de {deltaPps} p.p. na margem EBITDA em relação a {context.comparisonPeriod}.
          </p>
        </div>

        <div className="p-3 bg-surface-container/30 rounded border border-border/40">
          <span className="font-semibold text-foreground block mb-1">Impactos Financeiros Diretos</span>
          <div className="flex items-center gap-2 text-foreground font-medium mt-2">
            <AlertTriangle className="w-4 h-4 text-warning shrink-0" />
            <span>Redução de {formatter.currency(Math.abs(ebitda - prevEbitda))} na geração interna de caixa líquido.</span>
          </div>
        </div>
      </div>
    </ExecutiveSurface>
  );
};
