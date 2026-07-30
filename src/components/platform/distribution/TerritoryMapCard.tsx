import React from 'react';
import { MapPin } from 'lucide-react';
import { ExecutiveSurface } from '../../ui/executive-surface';
import { ExecutiveText } from '../../ui/executive-typography';
import { TerritoryContract } from '@illumine/executive-contracts';

export interface TerritoryMapCardProps {
  readonly territory: TerritoryContract;
}

export const TerritoryMapCard: React.FC<TerritoryMapCardProps> = ({ territory }) => {
  return (
    <ExecutiveSurface className="p-3 bg-card border border-border rounded-lg shadow-sm">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <MapPin className="w-3.5 h-3.5 text-primary" />
          <ExecutiveText variant="bodyStandard" className="font-semibold text-foreground">
            Exclusividade Territorial ({territory.stateOrProvince} - {territory.city})
          </ExecutiveText>
        </div>
        <span className="text-xs text-muted-foreground">Setor: <strong className="text-foreground">{territory.industrySector}</strong></span>
      </div>
    </ExecutiveSurface>
  );
};
