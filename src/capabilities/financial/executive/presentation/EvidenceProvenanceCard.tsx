import React from 'react';
import { Database, ShieldCheck } from 'lucide-react';
import { ExecutiveSurface } from '../../../../components/ui/executive-surface';
import { ExecutiveBadge } from '../../../../components/ui/executive-badge';
import { ExecutiveText } from '../../../../components/ui/executive-typography';
import { DataLineageTrace } from '@illumine/executive-contracts';

export interface EvidenceProvenanceCardProps {
  readonly trace: DataLineageTrace;
}

export const EvidenceProvenanceCard: React.FC<EvidenceProvenanceCardProps> = ({ trace }) => {
  return (
    <ExecutiveSurface className="p-3 mb-3 bg-card border border-border rounded-lg shadow-sm">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Database className="w-3.5 h-3.5 text-primary" />
          <ExecutiveText variant="bodyStandard" className="font-semibold text-foreground">
            Origem Fiduciária (Provenance Trace)
          </ExecutiveText>
        </div>
        <ExecutiveBadge variant="neutral" className="flex items-center gap-1 text-[10px]">
          <ShieldCheck className="w-3 h-3 text-success" />
          <span>Fonte: {trace.dataSourceName}</span>
        </ExecutiveBadge>
      </div>
      <ExecutiveText variant="caption" className="text-muted-foreground mt-1 block text-xs">
        Transformação contábil: {trace.transformationName} (Data: {trace.timestamp})
      </ExecutiveText>
    </ExecutiveSurface>
  );
};
