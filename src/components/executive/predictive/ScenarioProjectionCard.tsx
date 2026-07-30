import React from 'react';
import { Layers } from 'lucide-react';
import { ExecutiveSurface } from '../../ui/executive-surface';
import { ExecutiveText } from '../../ui/executive-typography';

export interface ScenarioProjectionCardProps {
  readonly title: string;
  readonly impactText: string;
  readonly riskText: string;
}

export const ScenarioProjectionCard: React.FC<ScenarioProjectionCardProps> = ({ title, impactText, riskText }) => {
  return (
    <ExecutiveSurface className="p-3 bg-card border border-border rounded-lg shadow-sm">
      <div className="flex items-center gap-2 mb-1">
        <Layers className="w-3.5 h-3.5 text-primary" />
        <ExecutiveText variant="bodyStandard" className="font-semibold text-foreground">
          {title}
        </ExecutiveText>
      </div>
      <div className="flex items-center justify-between text-xs text-muted-foreground mt-1">
        <span>Impacto: <strong className="text-foreground">{impactText}</strong></span>
        <span>Risco: <strong className="text-foreground">{riskText}</strong></span>
      </div>
    </ExecutiveSurface>
  );
};
