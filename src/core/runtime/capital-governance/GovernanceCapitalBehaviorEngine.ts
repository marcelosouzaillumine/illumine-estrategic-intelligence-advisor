// src/core/runtime/capital-governance/GovernanceCapitalBehaviorEngine.ts
import { GovernanceCapitalBehaviorMetrics, CapitalRetentionMetrics, ShareholderDistributionMetrics, EquityPreservationMetrics, InstitutionalCapitalizationMetrics } from './capital-governance-types';

export function calculateGovernanceCapitalBehavior(
  retention: CapitalRetentionMetrics,
  distribution: ShareholderDistributionMetrics,
  preservation: EquityPreservationMetrics,
  capitalization: InstitutionalCapitalizationMetrics
): GovernanceCapitalBehaviorMetrics {
  
  let capitalReinforcementIndex = 0;
  
  // Basic heuristic for reinforcement:
  // Preserved equity gives a big boost
  if (preservation.preservationStatus === 'PRESERVADO') capitalReinforcementIndex += 50;
  if (retention.retentionStatus === 'ALTA_RETENÇÃO' || retention.retentionStatus === 'RETENÇÃO_MODERADA') capitalReinforcementIndex += 30;
  if (distribution.distributionPressure === 'BAIXA') capitalReinforcementIndex += 20;

  if (preservation.preservationStatus === 'DRENADO') capitalReinforcementIndex -= 40;
  if (distribution.distributionPressure === 'CRÍTICA') capitalReinforcementIndex -= 30;
  
  capitalReinforcementIndex = Math.max(0, Math.min(100, capitalReinforcementIndex));

  let governanceMaturity: 'MATURA' | 'EM_DESENVOLVIMENTO' | 'FRÁGIL' | 'DESTRUTIVA' = 'EM_DESENVOLVIMENTO';

  if (capitalReinforcementIndex >= 80) {
    governanceMaturity = 'MATURA';
  } else if (capitalReinforcementIndex >= 50) {
    governanceMaturity = 'EM_DESENVOLVIMENTO';
  } else if (capitalReinforcementIndex >= 30) {
    governanceMaturity = 'FRÁGIL';
  } else {
    governanceMaturity = 'DESTRUTIVA';
  }

  return {
    capitalReinforcementIndex,
    governanceMaturity
  };
}
