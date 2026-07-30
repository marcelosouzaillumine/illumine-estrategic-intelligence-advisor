import React from 'react';
import { ShieldCheck } from 'lucide-react';
import { ExecutiveSurface } from '../../ui/executive-surface';
import { ExecutiveText } from '../../ui/executive-typography';

export interface PredictionEvidenceCardProps {
  readonly evidenceChainText: string;
}

export const PredictionEvidenceCard: React.FC<PredictionEvidenceCardProps> = ({ evidenceChainText }) => {
  return (
    <ExecutiveSurface className="p-3 bg-card border border-border rounded-lg shadow-sm">
      <div className="flex items-center gap-2 mb-1">
        <ShieldCheck className="w-3.5 h-3.5 text-success" />
        <ExecutiveText variant="bodyStandard" className="font-semibold text-foreground">
          Cadeia de Evidências Preditivas & Lineage
        </ExecutiveText>
      </div>
      <p className="text-muted-foreground text-xs leading-relaxed mt-1">
        {evidenceChainText}
      </p>
    </ExecutiveSurface>
  );
};
