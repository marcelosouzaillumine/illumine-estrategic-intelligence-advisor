import React from 'react';
import { ExecutiveDecisionContext } from '@illumine/executive-contracts';
import { Compass, CheckCircle2 } from 'lucide-react';
import { ExecutiveSurface } from '../../../../components/ui/executive-surface';
import { ExecutiveBadge } from '../../../../components/ui/executive-badge';
import { ExecutiveText } from '../../../../components/ui/executive-typography';

export interface ExecutiveIntentCardProps {
  readonly context: ExecutiveDecisionContext;
}

export const ExecutiveIntentCard: React.FC<ExecutiveIntentCardProps> = ({ context }) => {
  const metrics = context.executiveMetrics?.currentMetrics || {};
  const ebitda = metrics.EBITDA || metrics.ebitda || 620000;
  const revenue = metrics.ReceitaBruta || metrics.revenue || 8450000;
  const margin = revenue > 0 ? (ebitda / revenue) * 100 : 7.3;

  const decisionTarget = margin < 10.0
    ? 'Aprovação de Plano Emergencial de Recuperação de Margem Operacional'
    : margin < 15.0
    ? 'Homologação de Reestruturação do Capital de Giro e Liquidez'
    : 'Aprovação de Expansão e Distribuição Sustentável de Dividendos';

  return (
    <ExecutiveSurface className="p-4 mb-4 bg-card border border-border rounded-lg shadow-sm">
      <div className="flex items-center justify-between gap-4 mb-2">
        <div className="flex items-center gap-2">
          <Compass className="w-4 h-4 text-primary" />
          <ExecutiveText variant="sectionTitle" className="font-semibold text-primary">
            Layer 2 — Intenção Executiva (Decisão Suportada)
          </ExecutiveText>
        </div>
        <ExecutiveBadge variant="info">Decisão Ativa</ExecutiveBadge>
      </div>

      <div className="flex items-start gap-3 p-3 bg-surface-container/30 rounded border border-border/40 text-xs">
        <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 shrink-0" />
        <div>
          <ExecutiveText variant="bodyStandard" className="font-semibold text-foreground">
            {decisionTarget}
          </ExecutiveText>
          <ExecutiveText variant="caption" className="text-muted-foreground mt-0.5 block">
            Suporta a tomada de decisão da diretoria da {context.companyName} no exercício {context.period} com foco em previsibilidade e alinhamento fiduciário.
          </ExecutiveText>
        </div>
      </div>
    </ExecutiveSurface>
  );
};
