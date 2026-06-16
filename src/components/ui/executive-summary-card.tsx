import React from 'react';
import { ExecutiveSummarySection, ExecutiveSummarySectionProps } from './executive-summary-section';

/**
 * @deprecated Use `ExecutiveSummarySection` instead.
 * This component acts as a legacy wrapper to ensure backward compatibility.
 */
export function ExecutiveSummaryCard(props: ExecutiveSummarySectionProps) {
  return <ExecutiveSummarySection {...props} />;
}

// Re-export types that might have been imported from here
export type { ExecutiveSummaryMetric as ExecutiveSummaryCardMetric, ExecutiveSummaryDensity } from './executive-summary-section';
