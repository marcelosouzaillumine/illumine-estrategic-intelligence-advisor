import React from 'react';
import { Layers, AlertTriangle } from 'lucide-react';
import { ExecutiveSurface } from '../ui/executive-surface';
import { ExecutiveBadge } from '../ui/executive-badge';
import { ExecutiveText } from '../ui/executive-typography';
import { OrganizationalPatternContract } from '@illumine/executive-contracts';

export interface PatternDetectionCardProps {
  readonly pattern: OrganizationalPatternContract;
}

export const PatternDetectionCard: React.FC<PatternDetectionCardProps> = ({ pattern }) => {
  return (
    <ExecutiveSurface className="p-3 mb-3 bg-card border border-border rounded-lg shadow-sm">
      <div className="flex items-center justify-between gap-2 mb-1">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-primary" />
          <ExecutiveText variant="bodyStandard" className="font-semibold text-foreground">
            Padrão Institucional Identificado: {pattern.patternTitle}
          </ExecutiveText>
        </div>
        <ExecutiveBadge variant={pattern.severity === 'CRITICAL' ? 'critical' : 'warning'}>
          {pattern.domain}
        </ExecutiveBadge>
      </div>

      <p className="text-muted-foreground text-xs leading-relaxed mt-1">
        {pattern.description}
      </p>
    </ExecutiveSurface>
  );
};
