// src/core/runtime/decision-policy/InstitutionalMaterialityEngine.ts
//
// Institutional Materiality Engine

import { ExecutiveDecision } from '../../../capabilities/runtime/decision-intelligence/decision-types';
import { MaterialityAssessment } from './policy-types';

export class InstitutionalMaterialityEngine {
  /**
   * Calculates the materiality baseline value.
   * Matches the approved formula: greatest of 1% OCF, 1% abs(Net Income), 0.5% Net Revenue, or absolute R$ 1,000.
   */
  public static calculateMaterialityBase(report: any): number {
    const ocf = Math.abs(report?.cashFlowReport?.operational?.fco ?? report?.ocf ?? 0);
    const netIncome = Math.abs(report?.metrics?.netIncome ?? report?.netIncome ?? 0);
    const netRevenue = Math.abs(report?.metrics?.netRevenue ?? report?.netRevenue ?? report?.revenue ?? 0);

    const ocfPart = 0.01 * ocf;
    const netIncomePart = 0.01 * netIncome;
    const netRevenuePart = 0.005 * netRevenue;
    const absoluteMin = 1000;

    return Math.max(ocfPart, netIncomePart, netRevenuePart, absoluteMin);
  }

  /**
   * Assesses a decision's materiality across the 9 required dimensions.
   */
  public static evaluateMateriality(
    decision: ExecutiveDecision,
    report: any
  ): MaterialityAssessment {
    const materialityBase = this.calculateMaterialityBase(report);
    const value = decision.value ?? 0;
    const { domains } = decision;

    // 1. Financial Magnitude (based on size of decision relative to materialityBase)
    const financialMagnitude = value > 0 
      ? Math.min(100, Math.round((value / materialityBase) * 20)) 
      : 10;

    // 2. Liquidity Impact (high if OCF is negative or low and decision consumes liquidity)
    const ocf = report?.cashFlowReport?.operational?.fco ?? report?.ocf ?? 0;
    let liquidityImpact = 20;
    if (domains.includes('Dividend Distribution') || domains.includes('CAPEX') || domains.includes('Operational Expansion')) {
      liquidityImpact = ocf < 0 ? 80 : 40;
    }

    // 3. Patrimonial Exposure (high for CAPEX or asset disposal)
    let patrimonialExposure = 20;
    if (domains.includes('CAPEX') || domains.includes('Asset Disposal') || domains.includes('Capital Preservation')) {
      patrimonialExposure = value > materialityBase * 5 ? 70 : 40;
    }

    // 4. Operational Dependency (costs/headcount)
    let operationalDependency = 20;
    if (domains.includes('Workforce Expansion') || domains.includes('Operational Expansion') || domains.includes('Cost Reduction')) {
      operationalDependency = 60;
    }

    // 5. Governance Exposure (role and approval level)
    let governanceExposure = 30;
    if (decision.approverRole?.toLowerCase().includes('director') || decision.approverRole?.toLowerCase().includes('cfo') || decision.approverRole?.toLowerCase().includes('ceo')) {
      governanceExposure = 60;
    }

    // 6. Survivability Impact (overall report scores)
    const compositeScore = report?.scores?.composite ?? report?.scores?.financial ?? 70;
    const survivabilityImpact = Math.max(10, 100 - compositeScore);

    // 7. Strategic Importance (based on domains and description)
    let strategicImportance = 30;
    if (domains.length >= 3 || decision.motivation.toLowerCase().includes('estratégia') || decision.motivation.toLowerCase().includes('reestruturação')) {
      strategicImportance = 80;
    }

    // 8. Recurrence Frequency (placeholder for default, updated dynamically in orchestrator via history length)
    const recurrenceFrequency = 20;

    // 9. Systemic Propagation Potential (cross statement effects)
    let systemicPropagation = 20;
    if (domains.includes('Debt Expansion') || domains.includes('Financing Strategy')) {
      systemicPropagation = 70;
    }

    const avgScore = Math.round(
      (financialMagnitude +
        liquidityImpact +
        patrimonialExposure +
        operationalDependency +
        governanceExposure +
        survivabilityImpact +
        strategicImportance +
        recurrenceFrequency +
        systemicPropagation) /
        9
    );

    // Decision is material if its composite score >= 35 OR its explicit value exceeds the materiality base
    const isMaterial = avgScore >= 35 || (value > 0 && value >= materialityBase);

    return {
      isMaterial,
      compositeScore: avgScore,
      materialityBase,
      dimensions: {
        financialMagnitude,
        liquidityImpact,
        patrimonialExposure,
        operationalDependency,
        governanceExposure,
        survivabilityImpact,
        strategicImportance,
        recurrenceFrequency,
        systemicPropagation
      }
    };
  }
}
