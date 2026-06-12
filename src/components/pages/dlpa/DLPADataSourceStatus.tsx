import React from 'react';
import { Loader2, Database } from 'lucide-react';
import { cn } from '../../../lib/utils';
import { ExecutiveSurface } from '../../ui/executive-surface';

export type DLPADataSourceStatusProps = {
  hasRealData: boolean;
  loading: boolean;
};

export const DLPADataSourceStatus = ({ hasRealData, loading }: DLPADataSourceStatusProps) => {
  return (
    <ExecutiveSurface 
      variant="default"
      elevation="sm"
      radius="sm"
      padding="none"
      className="px-3 py-1.5 h-8 flex items-center gap-3"
    >
      {loading && <Loader2 size={14} className="animate-spin text-secondary" />}
      <Database size={14} className={hasRealData ? 'text-success' : 'text-muted-foreground/30'} />
      <span className={cn('text-[10px] font-medium uppercase tracking-[0.2em]', hasRealData ? 'text-success' : 'text-muted-foreground/40')}>
        {hasRealData ? 'Dados Reais' : 'Amostra'}
      </span>
    </ExecutiveSurface>
  );
};
