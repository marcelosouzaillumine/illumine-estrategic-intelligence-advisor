import React from 'react';
import { Layers } from 'lucide-react';
import { ExecutiveSurface } from '../../ui/executive-surface';
import { ExecutiveText } from '../../ui/executive-typography';
import { HoldingStructureContract } from '@illumine/executive-contracts';
import { useTranslation } from "react-i18next";
import { useExecutiveFormatter } from '../../../core/localization';

export interface HoldingStructureCardProps {
  readonly holding: HoldingStructureContract;
}

export const HoldingStructureCard: React.FC<HoldingStructureCardProps> = ({ holding }) => {
  // @ts-ignore
  const { t } = useTranslation('partners');
  const formatter = useExecutiveFormatter();

  return (
    <ExecutiveSurface className="p-4 mb-4 bg-card border border-border rounded-lg shadow-sm">
      <div className="flex items-center gap-2 mb-2 pb-2 border-b border-border/50">
        <Layers className="w-4 h-4 text-primary" />
        <ExecutiveText variant="sectionTitle" className="font-semibold text-primary">
          {t('holding.title', { name: holding.holdingName })}
        </ExecutiveText>
      </div>
      <div className="flex items-center justify-between text-xs text-muted-foreground mt-1">
        <span>{t('holding.controlledCompanies')} <strong className="text-foreground">{t('holding.units', { count: holding.childCompanyIds.length })}</strong></span>
        <span>{t('holding.consolidatedRevenue')} <strong className="text-success">{formatter.currency(holding.totalConsolidatedRevenue)}</strong></span>
      </div>
    </ExecutiveSurface>
  );
};
