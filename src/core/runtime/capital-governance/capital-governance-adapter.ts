// src/core/runtime/capital-governance/capital-governance-adapter.ts
import { CapitalGovernanceDiagnostics } from './capital-governance-types';
import { calculateCapitalRetention } from './CapitalRetentionEngine';
import { calculateShareholderDistribution } from './ShareholderDistributionEngine';
import { calculateEquityPreservation } from './EquityPreservationEngine';
import { calculateInstitutionalCapitalization } from './InstitutionalCapitalizationEngine';
import { calculateGovernanceCapitalBehavior } from './GovernanceCapitalBehaviorEngine';
import { composeCapitalGovernanceNarrative } from './CapitalGovernanceNarrativeComposer';

export class CapitalGovernanceAdapter {
  static process(
    dlpaData: any[],
    netIncome: number,
    retainedEarnings: number,
    totalDistributed: number,
    startingEquity: number,
    endingEquity: number,
    capitalInjections: number
  ): { diagnostics: CapitalGovernanceDiagnostics; narrative: string } {
  
  if (!dlpaData || dlpaData.length === 0) {
    return {
      diagnostics: {
        isAvailable: false,
        retention: null,
        distribution: null,
        preservation: null,
        capitalization: null,
        behavior: null
      },
      narrative: 'DLPA/DMPL indisponível para análise institucional.'
    };
  }

  const retention = calculateCapitalRetention(netIncome, retainedEarnings);
  const distribution = calculateShareholderDistribution(netIncome, totalDistributed);
  const preservation = calculateEquityPreservation(startingEquity, endingEquity);
  const capitalization = calculateInstitutionalCapitalization(capitalInjections, startingEquity, netIncome);
  const behavior = calculateGovernanceCapitalBehavior(retention, distribution, preservation, capitalization);

  const diagnostics: CapitalGovernanceDiagnostics = {
    isAvailable: true,
    retention,
    distribution,
    preservation,
    capitalization,
    behavior
  };

  const narrative = composeCapitalGovernanceNarrative(diagnostics);

  return { diagnostics, narrative };
  }
}
