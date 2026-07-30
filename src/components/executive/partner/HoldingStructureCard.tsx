import React from 'react';
import { Layers } from 'lucide-react';
import { ExecutiveSurface } from '../../ui/executive-surface';
import { ExecutiveText } from '../../ui/executive-typography';
import { HoldingStructureContract } from '@illumine/executive-contracts';

export interface HoldingStructureCardProps {
  readonly holding: HoldingStructureContract;
}

export const HoldingStructureCard: React.FC<HoldingStructureCardProps> = ({ holding }) => {
  return (
    <ExecutiveSurface className="p-4 mb-4 bg-card border border-border rounded-lg shadow-sm">
      <div className="flex items-center gap-2 mb-2 pb-2 border-b border-border/50">
        <Layers className="w-4 h-4 text-primary" />
        <ExecutiveText variant="sectionTitle" className="font-semibold text-primary">
          Holding & Grupo Econômico — {holding.holdingName}
        </ExecutiveText>
      </div>
      <div className="flex items-center justify-between text-xs text-muted-foreground mt-1">
        <span>Empresas Controladas: <strong className="text-foreground">{holding.childCompanyIds.length} Unidades</strong></span>
        <span>Faturamento Consolidado: <strong className="text-success">R$ {holding.totalConsolidatedRevenue.toLocaleString('pt-BR')}</strong></span>
      </div>
    </ExecutiveSurface>
  );
};
