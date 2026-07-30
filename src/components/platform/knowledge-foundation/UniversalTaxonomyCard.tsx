import React from 'react';
import { Tag } from 'lucide-react';
import { ExecutiveSurface } from '../../ui/executive-surface';
import { ExecutiveText } from '../../ui/executive-typography';
import { UniversalTaxonomyContract } from '@illumine/executive-contracts';

export interface UniversalTaxonomyCardProps {
  readonly taxonomy: UniversalTaxonomyContract;
}

export const UniversalTaxonomyCard: React.FC<UniversalTaxonomyCardProps> = ({ taxonomy }) => {
  return (
    <ExecutiveSurface className="p-3 bg-card border border-border rounded-lg shadow-sm">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Tag className="w-3.5 h-3.5 text-primary" />
          <ExecutiveText variant="bodyStandard" className="font-semibold text-foreground">
            Taxonomia Universal ({taxonomy.categoryCode}) — {taxonomy.canonicalName}
          </ExecutiveText>
        </div>
        <span className="text-xs text-muted-foreground">Domínio: <strong className="text-foreground">{taxonomy.mappedDomain}</strong></span>
      </div>
    </ExecutiveSurface>
  );
};
