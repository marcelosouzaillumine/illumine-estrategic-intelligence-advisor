import React from 'react';
import { Loader2, Database } from 'lucide-react';
import { ExecutiveSurface } from '../../ui/executive-surface';
import { ExecutiveBadge } from '../../ui/executive-badge';

export type DFCDataSourceStatusProps = {
  hasRealData: boolean;
  loading: boolean;
};

export const DFCDataSourceStatus = ({ hasRealData, loading }: DFCDataSourceStatusProps) => {
  return (
    <ExecutiveSurface 
      variant="default"
      elevation="sm"
      radius="sm"
      padding="none"
      className="px-3 py-1.5 h-8 flex items-center gap-3"
    >
      {loading && <Loader2 size={14} className="animate-spin text-secondary" />}
      <Database size={14} className={hasRealData ? 'text-success' : 'text-executive-muted'} />
      <ExecutiveBadge variant={hasRealData ? 'success' : 'neutral'}>
        {hasRealData ? 'Dados Reais' : 'Amostra'}
      </ExecutiveBadge>
    </ExecutiveSurface>
  );
};
