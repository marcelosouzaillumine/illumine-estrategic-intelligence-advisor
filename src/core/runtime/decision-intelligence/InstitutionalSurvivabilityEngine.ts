// src/core/runtime/decision-intelligence/InstitutionalSurvivabilityEngine.ts
//
// Institutional Decision Survivability Engine
// Ref: docs/implementation_plan.md

import { SurvivabilityScores } from './decision-types';
import { PolicyContext } from '../decision-policy/policy-types';

export class InstitutionalSurvivabilityEngine {
  /**
   * Computes survivability scores based on the current executive report and optional decision policy context.
   */
  public static calculate(report: any, policyContext?: PolicyContext): SurvivabilityScores {
    // Extract base metrics from report context
    const financialScore = report.scores?.financial ?? 70;
    const operationalScore = report.scores?.operational ?? 70;
    const governanceScore = report.scores?.governance ?? 70;
    const structuralScore = report.scores?.structural ?? 70;
    
    // Resolve profile-specific modifiers
    const profile = policyContext?.activeProfile ?? 'BALANCED';
    
    let liquidityPenalty = 30;
    let operationalPenalty = 25;
    let governanceDestructivePenalty = 40;
    let governanceFragilePenalty = 20;
    let debtPenalty = 30;

    if (profile === 'TURNAROUND') {
      liquidityPenalty = 15; // Higher liquidity tolerance
      operationalPenalty = 15;
      debtPenalty = 15;      // Higher debt tolerance for restructuring
    } else if (profile === 'HYPER_GROWTH') {
      liquidityPenalty = 20;
      debtPenalty = 20;
    } else if (profile === 'NONPROFIT') {
      liquidityPenalty = 40; // Very strict liquidity bounds
      governanceDestructivePenalty = 50;
    } else if (profile === 'HOSPITAL') {
      liquidityPenalty = 35; // Strict
    }

    // 1. Liquidity Survivability (OCF and cash flow influence)
    const ocf = report.cashFlowReport?.operational?.fco ?? report.ocf ?? 1000;
    let liquidity = financialScore;
    if (ocf < 0) {
      liquidity = Math.max(10, liquidity - liquidityPenalty);
    }
    
    // 2. Operational Survivability (operational score and ebitda influence)
    const ebitda = report.metrics?.ebitda ?? report.ebitda ?? 1000;
    let operational = operationalScore;
    if (ebitda < 0) {
      operational = Math.max(10, operational - operationalPenalty);
    }

    // EQE / EQS Integration Calibration
    const eqsScore = 
      report.earningsQualityScore ??
      report.eqs ??
      report.inferences?.['LegacyDFCAdapter']?.metrics?.fiduciary?.earningsQuality?.score ??
      report.inferences?.['LegacyDFCAdapter']?.inference?.metrics?.fiduciary?.earningsQuality?.score ??
      report.cashFlowReport?.earningsQuality?.score ??
      null;

    if (eqsScore !== null && eqsScore < 50) {
      // Calibrated triggers: negative FCO real, runway < 6, shareholder dependency > 25%, EBITDA margin < 0
      const fcoReal = report.inferences?.['LegacyDFCAdapter']?.metrics?.fiduciary?.fcoOperacionalReal ?? 
                      report.inferences?.['LegacyDFCAdapter']?.inference?.metrics?.fiduciary?.fcoOperacionalReal ?? 
                      report.fcoOperacionalReal ?? null;
      const runway = report.inferences?.['LegacyDFCAdapter']?.metrics?.fiduciary?.runway ?? 
                     report.inferences?.['LegacyDFCAdapter']?.inference?.metrics?.fiduciary?.runway ?? 
                     report.runway ?? null;
      const shareholderDependency = report.inferences?.['LegacyDFCAdapter']?.metrics?.fiduciary?.intensidadePartesRelacionadas ?? 
                                    report.inferences?.['LegacyDFCAdapter']?.inference?.metrics?.fiduciary?.intensidadePartesRelacionadas ?? 
                                    null;
      
      const isFcoRealNegative = fcoReal !== null && fcoReal < 0;
      const isRunwayCompressed = runway !== null && runway < 6;
      const isShareholderDepHigh = shareholderDependency !== null && shareholderDependency > 0.25;
      const isEbitdaNegative = ebitda < 0;

      if (isFcoRealNegative || isRunwayCompressed || isShareholderDepHigh || isEbitdaNegative) {
        operational = Math.max(10, operational - 15);
      }
    }
    
    // 3. Governance Survivability (maturity level, behavior flags)
    let governance = governanceScore;
    const matLabel = report.capitalGovernanceReport?.behavior?.governanceMaturity ?? 'MATURA';
    if (matLabel === 'DESTRUTIVA' || matLabel === 'FRÁGIL') {
      governance = Math.max(15, governance - governanceDestructivePenalty);
    } else if (matLabel === 'FRAGILIZADA' || matLabel === 'EM_ESTRUTURAÇÃO') {
      governance = Math.max(30, governance - governanceFragilePenalty);
    }
    
    // 4. Debt Survivability (leverage rating and structural score)
    let debt = structuralScore;
    const isLeveraged = report.capitalGovernanceReport?.behavior?.overallNarrative?.toLowerCase().includes('alavanca') || false;
    if (isLeveraged) {
      debt = Math.max(20, debt - debtPenalty);
    }
    
    // 5. Capital Preservation Survivability (retained earnings, preservation status)
    let capitalPreservation = structuralScore;
    const preservationStatus = report.capitalGovernanceReport?.preservation?.preservationStatus ?? 'PRESERVAÇÃO_SAUDÁVEL';
    if (preservationStatus === 'FRAGILIDADE_PATRIMONIAL') {
      capitalPreservation = Math.max(10, capitalPreservation - 50);
    } else if (preservationStatus === 'EROSÃO_RELEVANTE') {
      capitalPreservation = Math.max(25, capitalPreservation - 30);
    } else if (preservationStatus === 'EROSÃO_MODERADA') {
      capitalPreservation = Math.max(45, capitalPreservation - 15);
    }
    
    // 6. Strategic Survivability (confidence and context)
    let strategic = report.scores?.composite ?? 70;
    const confidence = report.compliance?.confidenceLevel ?? 'HIGH_CONFIDENCE';
    if (confidence === 'LOW_CONFIDENCE') {
      strategic = Math.max(20, strategic - 30);
    } else if (confidence === 'MEDIUM_CONFIDENCE') {
      strategic = Math.max(40, strategic - 15);
    }

    // Resolve Composite Score Weightings dynamically
    let wLiq = 0.25;
    let wOps = 0.20;
    let wGov = 0.15;
    let wDebt = 0.15;
    let wCap = 0.15;
    let wStrat = 0.10;

    if (profile === 'NONPROFIT' || profile === 'HOSPITAL') {
      wLiq = 0.35; // Strict liquidity priority
      wOps = 0.15;
      wGov = 0.20; // High governance focus
      wDebt = 0.10;
      wCap = 0.10;
      wStrat = 0.10;
    } else if (profile === 'HYPER_GROWTH') {
      wLiq = 0.15; // Growth focus accepts liquidity buffers reduction
      wOps = 0.25;
      wGov = 0.10;
      wDebt = 0.20;
      wCap = 0.15;
      wStrat = 0.15;
    } else if (profile === 'TURNAROUND') {
      wLiq = 0.30;
      wOps = 0.20;
      wGov = 0.10;
      wDebt = 0.15;
      wCap = 0.15;
      wStrat = 0.10;
    }

    const composite = Math.round(
      (liquidity * wLiq) +
      (operational * wOps) +
      (governance * wGov) +
      (debt * wDebt) +
      (capitalPreservation * wCap) +
      (strategic * wStrat)
    );

    return {
      liquidity: Math.round(liquidity),
      operational: Math.round(operational),
      governance: Math.round(governance),
      debt: Math.round(debt),
      capitalPreservation: Math.round(capitalPreservation),
      strategic: Math.round(strategic),
      composite
    };
  }
}
