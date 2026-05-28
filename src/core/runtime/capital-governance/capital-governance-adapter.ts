import { ConsolidatedCapitalGovernanceReport } from './capital-governance-types';
import { CapitalRetentionEngine } from './CapitalRetentionEngine';
import { ShareholderDistributionEngine } from './ShareholderDistributionEngine';
import { EquityPreservationEngine } from './EquityPreservationEngine';
import { GovernanceCapitalBehaviorEngine } from './GovernanceCapitalBehaviorEngine';
import { InstitutionalCapitalizationEngine } from './InstitutionalCapitalizationEngine';

export class CapitalGovernanceAdapter {
  public static process(
    rawData: any,
    netIncome: number,
    patrimonioLiquido: number,
    caixaEquivalentes: number,
    bpSummary: any
  ): ConsolidatedCapitalGovernanceReport {
    const dlpaData = rawData?.dlpaData;
    const hasDLPA = !!dlpaData && Array.isArray(dlpaData) && dlpaData.length > 0;

    if (!hasDLPA) {
      const blockMsg = 'DLPA/DMPL indisponível para análise institucional.';
      return {
        isAvailable: false,
        retention: {
          retainedEarnings: 0,
          netIncome: netIncome,
          retentionRate: null,
          retentionEfficiency: 'FALTA_DADO',
          reserveReinforcement: 0,
          narrative: blockMsg
        },
        distribution: {
          distributedDividends: 0,
          payoutRatio: null,
          distributionDiscipline: 'FALTA_DADO',
          corporateDrainRatio: null,
          narrative: blockMsg
        },
        preservation: {
          equityChange: 0,
          replenishmentIndex: null,
          equityErosionDetected: false,
          preservationStatus: 'FALTA_DADO',
          narrative: blockMsg
        },
        behavior: {
          shareholderLoansVolume: 0,
          capitalDisciplineRating: 'FALTA_DADO',
          isShareholderDrainingCompany: false,
          loansToNetIncomeRatio: null,
          narrative: blockMsg
        },
        capitalization: {
          capitalSocial: 0,
          lucrosRetidosAcumulados: 0,
          capitalizationIndex: null,
          maturityRating: 'FALTA_DADO',
          narrative: blockMsg
        },
        overallNarrative: blockMsg
      };
    }

    const doc = dlpaData[0];

    const retention = CapitalRetentionEngine.calculate(doc, netIncome);
    const distribution = ShareholderDistributionEngine.calculate(doc, netIncome, patrimonioLiquido, caixaEquivalentes);
    const preservation = EquityPreservationEngine.calculate(doc, netIncome, patrimonioLiquido);
    const behavior = GovernanceCapitalBehaviorEngine.calculate(doc, netIncome);
    const capitalization = InstitutionalCapitalizationEngine.calculate(doc, bpSummary);

    // Consolidated capital governance narrative
    let overallNarrative = `A governança do capital apresenta postura de distribuição ${distribution.distributionDiscipline.toLowerCase()} e preservação patrimonial classificada como ${preservation.preservationStatus.toLowerCase()}.`;
    if (retention.retentionRate !== null) {
      overallNarrative += ` A retenção de lucro operacional atinge ${(retention.retentionRate * 100).toFixed(1)}%.`;
    }
    if (behavior.isShareholderDrainingCompany) {
      overallNarrative += ' Atenção: há indícios de drenagem societária via movimentação de mútuo.';
    }

    return {
      isAvailable: true,
      retention,
      distribution,
      preservation,
      behavior,
      capitalization,
      overallNarrative
    };
  }
}
