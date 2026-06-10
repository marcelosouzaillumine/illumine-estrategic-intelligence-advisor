import React from 'react';
import { Loader2, Database } from 'lucide-react';
import { cn } from '../../../lib/utils';

export type BalanceSheetDataSourceStatusProps = {
  hasRealData: boolean;
  loading: boolean;
};

export const BalanceSheetDataSourceStatus = ({ hasRealData, loading }: BalanceSheetDataSourceStatusProps) => {
  return (
    <div className="bg-card border border-border/50 shadow-sm rounded-md px-4 py-2 flex items-center gap-3 shadow-sm">
      {loading && <Loader2 size={14} className="animate-spin text-secondary" />}
      <Database size={14} className={hasRealData ? 'text-success' : 'text-muted-foreground/30'} />
      <span className={cn('text-[10px] font-medium uppercase tracking-[0.2em]', hasRealData ? 'text-success' : 'text-muted-foreground/40')}>
        {hasRealData ? 'Dados Reais' : 'Amostra'}
      </span>
    </div>
  );
};
