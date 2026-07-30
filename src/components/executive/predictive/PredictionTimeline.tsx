import React from 'react';
import { Clock } from 'lucide-react';
import { ExecutiveSurface } from '../../ui/executive-surface';
import { ExecutiveText } from '../../ui/executive-typography';
import { ForecastHorizonDays } from '@illumine/executive-contracts';

export interface PredictionTimelineProps {
  readonly horizons: readonly ForecastHorizonDays[];
}

export const PredictionTimeline: React.FC<PredictionTimelineProps> = ({ horizons }) => {
  return (
    <ExecutiveSurface className="p-3 bg-card border border-border rounded-lg shadow-sm">
      <div className="flex items-center gap-2 mb-2">
        <Clock className="w-3.5 h-3.5 text-primary" />
        <ExecutiveText variant="bodyStandard" className="font-semibold text-foreground">
          Horizontes Temporais de Previsão
        </ExecutiveText>
      </div>
      <div className="flex items-center gap-2 text-xs">
        {horizons.map((h) => (
          <span key={h} className="px-2 py-1 bg-surface-container/30 rounded border border-border/30 font-medium">
            {h} dias
          </span>
        ))}
      </div>
    </ExecutiveSurface>
  );
};
