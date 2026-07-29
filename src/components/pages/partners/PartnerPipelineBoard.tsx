import React from 'react';
import { ExecutiveSurface } from '../../ui/executive-surface';
import { ExecutiveHeading } from '../../ui/executive-heading';

interface PartnerPipelineBoardProps {
  pipelineTotalValue: number;
  activeDealsCount: number;
}

export const PartnerPipelineBoard: React.FC<PartnerPipelineBoardProps> = ({
  pipelineTotalValue,
  activeDealsCount
}) => {
  const formatCurrency = (val: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

  return (
    <ExecutiveSurface className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <ExecutiveHeading as="h2" className="text-h2">
            Funil Comercial & Gestão de Parceiros
          </ExecutiveHeading>
          <p className="text-sm text-executive-secondary mt-1">
            Gestão de oportunidades, comissionamento e performance de canais
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 bg-surface-container/50 rounded-md border border-border">
          <div className="text-xs text-executive-secondary uppercase font-semibold">Valor Total em Pipeline</div>

          <div className="text-2xl font-bold text-foreground mt-1">{formatCurrency(pipelineTotalValue)}</div>
        </div>
        <div className="p-4 bg-surface-container/50 rounded-md border border-border">
          <div className="text-xs text-executive-secondary uppercase font-semibold">Oportunidades Ativas</div>

          <div className="text-2xl font-bold text-foreground mt-1">{activeDealsCount} Oportunidades</div>
        </div>
      </div>
    </ExecutiveSurface>
  );
};
