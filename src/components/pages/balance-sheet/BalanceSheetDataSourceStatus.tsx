import React from 'react';
import { Loader2, Database } from 'lucide-react';
import { cn } from '../../../lib/utils';
import { ExecutiveSurface } from '../../ui/executive-surface';

export type BalanceSheetDataSourceStatusProps = {
  hasRealData: boolean;
  loading: boolean;
};

export const BalanceSheetDataSourceStatus = ({ hasRealData, loading }: BalanceSheetDataSourceStatusProps) => {
  return (
    <ExecutiveSurface 
      variant="default"
      elevation="sm"
      radius="md"
      className="px-4 py-2 flex items-center gap-3"
    >
      {loading && <Loader2 size={14} className="animate-spin text-secondary" />}
      <Database size={14} className={hasRealData ? 'text-success' : 'text-muted-foreground/30'} />
      <span className={cn('text-[10px] font-medium uppercase tracking-[0.2em]', hasRealData ? 'text-success' : 'text-muted-foreground/40')}>
        {hasRealData ? 'Dados Reais' : 'Amostra'}
      </span>
    </ExecutiveSurface>
  );
};
