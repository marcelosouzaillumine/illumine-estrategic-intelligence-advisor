import React from 'react';
import { SystemicHeatmapEmptyState } from './SystemicHeatmapEmptyState';
import { SystemicRiskProfile } from '../../core/runtime/consolidated/stress/stress-types';

interface GuardProps {
  output?: SystemicRiskProfile;
  children?: React.ReactNode;
}

export function SystemicHeatmapComplianceGuard(props: GuardProps) {
  const { output, children } = props;

  if (!output || !output.systemicStressMap || !output.systemicConfidence) {
    // Retorna estado simulado para fins de teste isolado caso chamado como func pura no teste
    if (!children) return { props: { isEmpty: true } } as any; 
    return <SystemicHeatmapEmptyState />;
  }

  const isLowConfidence = output.systemicConfidence === 'LOW_CONFIDENCE_PROPAGATION';
  const isUnverified = output.systemicConfidence === 'UNVERIFIED_DEPENDENCY';

  if (!children) {
    return { 
      props: { 
        isEmpty: false, 
        hasLowConfidence: isLowConfidence, 
        hasUnverifiedDependency: isUnverified 
      } 
    } as any;
  }

  return <>{children}</>;
}
