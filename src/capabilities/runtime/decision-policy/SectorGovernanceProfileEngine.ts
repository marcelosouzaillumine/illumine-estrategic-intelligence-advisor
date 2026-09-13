// src/core/runtime/decision-policy/SectorGovernanceProfileEngine.ts
//
// Sector Governance Profile Engine

import { DecisionPolicyProfile } from './policy-types';

export class SectorGovernanceProfileEngine {
  /**
   * Analyzes sector characteristics from report business identity to determine profile suggestions and restrictions.
   */
  public static analyzeSector(report: any): {
    isStrictLiquidityRequired: boolean;
    allowDistribution: boolean;
    suggestedProfile?: DecisionPolicyProfile;
  } {
    const businessIdentity = report?.businessIdentity || report?.clientIdentity || {};
    const sector = (businessIdentity.setor || report?.sector || '').toLowerCase().trim();
    const model = (businessIdentity.modeloDeNegocio || '').toLowerCase().trim();

    let isStrictLiquidityRequired = false;
    let allowDistribution = true;
    let suggestedProfile: DecisionPolicyProfile | undefined;

    // 1. Healthcare / Hospitals
    if (sector.includes('hospital') || sector.includes('saúde') || sector.includes('saude') || model.includes('saúde')) {
      isStrictLiquidityRequired = true;
      allowDistribution = true; // Hospitals can distribute, but with high oversight
      suggestedProfile = 'HOSPITAL';
    }
    // 2. Nonprofits
    else if (sector.includes('nonprofit') || sector.includes('ong') || sector.includes('associação') || sector.includes('associacao') || sector.includes('sem fins lucrativos') || sector.includes('filantrop')) {
      isStrictLiquidityRequired = true;
      allowDistribution = false; // Nonprofits cannot distribute dividends
      suggestedProfile = 'NONPROFIT';
    }
    // 3. Industrials
    else if (sector.includes('indústria') || sector.includes('industria') || sector.includes('manufatura') || model.includes('industrial')) {
      suggestedProfile = 'INDUSTRIAL';
    }
    // 4. Financial Institutions
    else if (sector.includes('financeiro') || sector.includes('banco') || sector.includes('cooperativa de crédito') || sector.includes('fintech') || model.includes('financeiro')) {
      isStrictLiquidityRequired = true;
      suggestedProfile = 'FINANCIAL_INSTITUTION';
    }

    return {
      isStrictLiquidityRequired,
      allowDistribution,
      suggestedProfile
    };
  }
}
