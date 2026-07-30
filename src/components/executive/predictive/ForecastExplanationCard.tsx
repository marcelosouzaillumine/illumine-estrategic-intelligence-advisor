import React from 'react';
import { HelpCircle } from 'lucide-react';
import { ExecutiveSurface } from '../../ui/executive-surface';
import { ExecutiveText } from '../../ui/executive-typography';

export interface ForecastExplanationCardProps {
  readonly explanationText: string;
}

export const ForecastExplanationCard: React.FC<ForecastExplanationCardProps> = ({ explanationText }) => {
  return (
    <ExecutiveSurface className="p-3 bg-card border border-border rounded-lg shadow-sm">
      <div className="flex items-center gap-2 mb-1">
        <HelpCircle className="w-3.5 h-3.5 text-primary" />
        <ExecutiveText variant="bodyStandard" className="font-semibold text-foreground">
          Explicabilidade do Modelo Preditivo
        </ExecutiveText>
      </div>
      <p className="text-muted-foreground text-xs leading-relaxed mt-1">
        {explanationText}
      </p>
    </ExecutiveSurface>
  );
};
