import React from 'react';
import { FileText } from 'lucide-react';
import { ExecutiveSurface } from '../../ui/executive-surface';
import { ExecutiveText } from '../../ui/executive-typography';

export interface ExecutiveCouncilSummaryProps {
  readonly summaryText: string;
}

export const ExecutiveCouncilSummary: React.FC<ExecutiveCouncilSummaryProps> = ({ summaryText }) => {
  return (
    <ExecutiveSurface className="p-3 bg-card border border-border rounded-lg shadow-sm">
      <div className="flex items-center gap-2 mb-1">
        <FileText className="w-3.5 h-3.5 text-primary" />
        <ExecutiveText variant="bodyStandard" className="font-semibold text-foreground">
          Ata de Deliberação do Conselho
        </ExecutiveText>
      </div>
      <p className="text-muted-foreground text-xs leading-relaxed mt-1">
        {summaryText}
      </p>
    </ExecutiveSurface>
  );
};
