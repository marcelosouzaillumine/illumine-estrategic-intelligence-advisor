import React from 'react';
import { cn } from '@/lib/utils';
import { ExecutiveSurface } from '../../../../components/ui/executive-surface';
import { ExecutiveText } from '../../../../components/ui/executive-typography';
import { ExecutiveHistoricalLegend, ExecutiveHistoricalLegendItem } from '../../../../components/ui/executive-historical-legend';
import { ExecutiveHistoricalInsightCard, ExecutiveHistoricalInsightCardProps } from '../../../../components/ui/executive-historical-insight-card';
import { ExecutiveAnalyticalHighlightsCardProps, ExecutiveAnalyticalHighlightsCard } from '../../../../components/ui/executive-analytical-highlights';

export interface ExecutiveHistoricalEvolutionCardProps {
  title: React.ReactNode;
  description?: React.ReactNode;
  legendItems?: ExecutiveHistoricalLegendItem[];
  insight?: ExecutiveHistoricalInsightCardProps;
  highlights?: ExecutiveAnalyticalHighlightsCardProps;
  children: React.ReactNode; // This should be the ExecutiveChart
  className?: string;
  chartHeight?: number | string;
}

/**
 * Phase 6: Canonical Historical Component
 * Encapsulates: Header, External Legend, Chart, Narrative Insight, and Analytical Highlights.
 */
export function ExecutiveHistoricalEvolutionCard({
  title,
  description,
  legendItems,
  insight,
  highlights,
  children,
  className,
}: ExecutiveHistoricalEvolutionCardProps) {
  return (
    <ExecutiveSurface padding="lg" radius="md" className={cn("flex flex-col gap-6", className)}>
      
      {/* Header and Legend Area */}
      <div className="flex flex-col gap-3 md:flex-row md:justify-between md:items-start">
        <div className="flex flex-col gap-1.5 flex-1">
          <h3 className="font-semibold text-lg tracking-tight leading-none text-foreground">{title}</h3>
          {description && (
            <ExecutiveText variant="moduleSubtitle">
              {description}
            </ExecutiveText>
          )}
        </div>
        
        {/* Phase 1: Legend positioned OUTSIDE the canvas */}
        {legendItems && legendItems.length > 0 && (
          <div className="md:text-right flex-shrink-0">
            <ExecutiveHistoricalLegend items={legendItems} className="justify-start md:justify-end py-0" />
          </div>
        )}
      </div>

      {/* Chart Canvas Area */}
      <div className="w-full">
        {children}
      </div>

      {/* Post-Chart Intelligence Area */}
      {(insight || highlights) && (
        <div className="flex flex-col gap-4 mt-2 pt-6 border-t border-border/40">
          
          {/* Phase 5 & 7: Highlights Grid */}
          {highlights && (
            <ExecutiveAnalyticalHighlightsCard {...highlights} />
          )}

          {/* Phase 4: Executive Narrative */}
          {insight && (
            <ExecutiveHistoricalInsightCard {...insight} />
          )}

        </div>
      )}

    </ExecutiveSurface>
  );
}
