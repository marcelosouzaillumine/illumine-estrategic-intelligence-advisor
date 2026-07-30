import React from 'react';
import { AlertCircle } from 'lucide-react';
import { ExecutiveSurface } from '../../ui/executive-surface';
import { ExecutiveBadge } from '../../ui/executive-badge';
import { ExecutiveText } from '../../ui/executive-typography';

export interface ExecutiveConflictCardProps {
  readonly conflictLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  readonly explanation: string;
}

export const ExecutiveConflictCard: React.FC<ExecutiveConflictCardProps> = ({ conflictLevel, explanation }) => {
  return (
    <ExecutiveSurface className="p-3 bg-card border border-border rounded-lg shadow-sm">
      <div className="flex items-center justify-between gap-2 mb-1">
        <div className="flex items-center gap-2">
          <AlertCircle className="w-3.5 h-3.5 text-warning" />
          <ExecutiveText variant="bodyStandard" className="font-semibold text-foreground">
            Resolução de Divergências Colegiadas
          </ExecutiveText>
        </div>
        <ExecutiveBadge variant={conflictLevel === 'LOW' ? 'success' : 'warning'}>
          Conflito: {conflictLevel}
        </ExecutiveBadge>
      </div>
      <p className="text-muted-foreground text-xs leading-relaxed mt-1">
        {explanation}
      </p>
    </ExecutiveSurface>
  );
};
