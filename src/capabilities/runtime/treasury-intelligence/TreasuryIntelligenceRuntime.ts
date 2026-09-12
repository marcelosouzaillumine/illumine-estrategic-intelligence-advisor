// src/core/runtime/treasury-intelligence/TreasuryIntelligenceRuntime.ts

import { 
  TreasuryIntelligenceRuntimeOutput,
  TreasuryAllocationItem,
  TreasuryPriorityLevel
} from './types';
import { RuntimeSeverity } from '../shared/runtime-contracts';
import { LineageHash } from '../shared/lineage-types';
import { DistributionSustainabilityEngine } from './DistributionSustainabilityEngine';
import { ReinvestmentIntelligenceEngine } from './ReinvestmentIntelligenceEngine';
import { TreasuryResilienceEngine } from './TreasuryResilienceEngine';
import { CashPriorityEngine } from './CashPriorityEngine';
import { TreasuryStressEngine } from './TreasuryStressEngine';
import { TreasuryPreservationScoringEngine } from './TreasuryPreservationScoringEngine';
import { FiduciaryEfficiencyEngine } from './FiduciaryEfficiencyEngine';
import { TreasuryPriorityMatrixEngine } from './TreasuryPriorityMatrixEngine';
import { TreasuryGovernanceEngine } from './TreasuryGovernanceEngine';

export interface TreasuryRuntimeInput {
  allocations: { id: string; category: string; amount: number; priority: TreasuryPriorityLevel; strategicNecessityScore: number }[];
  netIncome: number;
  retainedEarnings: number;
  fco: number;
  fci: number;
  fcf: number;
  availableCash: number;
  prevCaixa: number;
  startingEquity: number;
  endingEquity: number;
  ebitda: number;
  thirdPartyFunding: number;
  equityFunding: number;
  receivables: number;
  inventory: number;
  payables: number;
  shortTermDebt: number;
  historicalCyclesCount: number;
  liquidityClassification: string;
  runwayStability: string;
  hasRuptureRisk: boolean;
  isArtificial: boolean;
  hasPredictiveDeterioration: boolean;
  normalizedMonthlyCashBurn: number;
}

export class TreasuryIntelligenceRuntime {
  /**
   * Sovereign Treasury & Capital Allocation Intelligence Runtime
   * orchestrates the evaluation, prioritization, and optimization of capital stewardship.
   */
  public static evaluate(input: TreasuryRuntimeInput): TreasuryIntelligenceRuntimeOutput {
    const auditTrail: string[] = ['Execution started at TreasuryGovernanceRuntime'];

    const {
      allocations,
      netIncome,
      retainedEarnings,
      fco,
      fci,
      fcf,
      availableCash,
      prevCaixa,
      startingEquity,
      endingEquity,
      ebitda,
      thirdPartyFunding,
      equityFunding,
      receivables,
      inventory,
      payables,
      shortTermDebt,
      historicalCyclesCount,
      liquidityClassification,
      runwayStability,
      hasRuptureRisk,
      isArtificial,
      hasPredictiveDeterioration,
      normalizedMonthlyCashBurn
    } = input;

    // 1. Generate Treasury Lineage Hash (Reproducible and independent)
    const hashInputs = [
      netIncome,
      retainedEarnings,
      fco,
      availableCash,
      startingEquity,
      endingEquity,
      ebitda,
      thirdPartyFunding,
      equityFunding,
      receivables,
      payables,
      shortTermDebt,
      historicalCyclesCount,
      liquidityClassification
    ];
    const treasuryLineageHash = this.generateLineageHash(hashInputs);
    auditTrail.push(`Treasury lineage hash generated: ${treasuryLineageHash}`);

    // 2. Evaluate Distribution Sustainability Engine
    const distribution = DistributionSustainabilityEngine.evaluate({
      netIncome,
      retainedEarnings,
      fco,
      liquidityClassification,
      runwayStability,
      hasRuptureRisk,
      isArtificial,
      hasPredictiveDeterioration,
      hasCapitalDependency: liquidityClassification === 'LIQUIDITY_DEPENDENT',
      hasRefinancingDependency: thirdPartyFunding > 0 && fco < 0,
      historicalCyclesCount,
      startingEquity
    });
    auditTrail.push(`Distribution sustainability evaluated. Eligible: ${distribution.eligible}`);

    // 3. Evaluate Reinvestment Intelligence Engine
    const totalExpansionAlloc = allocations
      .filter(a => a.priority === 8)
      .reduce((sum, a) => sum + a.amount, 0);

    const reinvestment = ReinvestmentIntelligenceEngine.evaluate({
      allocationsToExpansion: totalExpansionAlloc,
      ebitda,
      runwayMonths: fco < 0 ? Math.round((availableCash / (Math.abs(fco) / 12)) * 10) / 10 : 99.0,
      historicalCyclesCount
    });
    auditTrail.push(`Reinvestment governance evaluated. Quality: ${reinvestment.reinvestmentQuality}`);

    // 4. Evaluate Treasury Resilience Engine
    const resilience = TreasuryResilienceEngine.evaluate({
      availableCash,
      normalizedMonthlyCashBurn,
      fco,
      fcf,
      equityFunding,
      thirdPartyFunding,
      historicalCyclesCount
    });
    auditTrail.push(`Treasury resilience evaluated. reserveSustainabilityDays: ${resilience.reserveSustainabilityDays}`);

    // 5. Evaluate Cash Priority Engine (Adaptive prioritization)
    const cashPriority = CashPriorityEngine.evaluate({
      isSurvivabilityDegraded: hasRuptureRisk || fco < 0,
      runwayMonths: fco < 0 ? Math.round((availableCash / (Math.abs(fco) / 12)) * 10) / 10 : 99.0,
      hasRuptureRisk
    });
    auditTrail.push(`Cash priority escalation analyzed.`);

    // 6. Evaluate Treasury Stress Engine (Cumulative Shocks)
    const stressSimulations = TreasuryStressEngine.evaluate({
      availableCash,
      normalizedMonthlyCashBurn,
      receivables,
      inventory,
      payables,
      shortTermDebt
    });

    if (fco > 0 && fcf === 0) { // basic heuristic for contexto A
      console.log('TREASURY DEBUG', {
        resilienceDays: resilience.reserveSustainabilityDays,
        stressSeverity: stressSimulations.stressSeverity,
        availableCash,
        normalizedMonthlyCashBurn,
        shortTermDebt,
        payables,
        receivables
      });
    }
    auditTrail.push(`Treasury stress simulated. simulatedExhaustionProjected: ${stressSimulations.simulatedExhaustionProjected}`);

    // 7. Evaluate Capital Preservation Engine
    const capitalPreservation = TreasuryPreservationScoringEngine.evaluate({
      startingEquity,
      endingEquity,
      netIncome,
      availableCash,
      prevCaixa
    });
    auditTrail.push(`Capital preservation evaluated. Score: ${capitalPreservation.preservationScore}`);

    // 8. Evaluate Fiduciary Efficiency Engine (Survivability-Adjusted)
    // Base efficiency calculation (EBITDA margin / ROCE proxy)
    const baseEfficiencyScore = ebitda > 0 && availableCash > 0 ? Math.min((ebitda / availableCash) * 100, 100) : 50;
    const isLiquidityFragile = liquidityClassification === 'CONTINUITY_RISK' || liquidityClassification === 'LIQUIDITY_DEPENDENT' || liquidityClassification === 'ARTIFICIAL_LIQUIDITY';
    const isTreasuryExhausted = resilience.reserveSustainabilityDays < 180;

    const fiduciaryEfficiency = FiduciaryEfficiencyEngine.evaluate({
      baseEfficiencyScore,
      runwayMonths: fco < 0 ? Math.round((availableCash / (Math.abs(fco) / 12)) * 10) / 10 : 99.0,
      resilienceScore: capitalPreservation.preservationScore,
      isSurvivabilityDegraded: hasRuptureRisk || fco < 0,
      isLiquidityFragile,
      isTreasuryExhausted,
      idleCashRatio: endingEquity > 0 ? availableCash / endingEquity : 0,
      costOfDebtRatio: ebitda > 0 ? (availableCash * 0.05) / ebitda : 0 // proxy interest
    });
    auditTrail.push(`Fiduciary efficiency evaluated. Adjusted Score: ${fiduciaryEfficiency.survivabilityAdjustedEfficiency}`);

    // 9. Evaluate Treasury Priority Matrix Engine (Cascading Restrictions)
    const priorityMatrix = TreasuryPriorityMatrixEngine.evaluate({
      isSurvivabilityDegraded: hasRuptureRisk || fco < 0,
      isRunwayCritical: resilience.reserveSustainabilityDays < 180 && normalizedMonthlyCashBurn > 0,
      isFalseStability: liquidityClassification === 'FALSE_STABILITY' || runwayStability === 'FALSE_STABILITY',
      hasPredictiveRupture: hasPredictiveDeterioration,
      allocations
    });
    auditTrail.push(`Priority matrix generated. ActiveCascadeBlock: ${priorityMatrix.activeCascadeBlock}`);

    // 10. Evaluate Treasury Governance Engine
    const totalGrowthAlloc = allocations
      .filter(a => a.priority === 8)
      .reduce((sum, a) => sum + a.amount, 0);
    const totalDistAlloc = allocations
      .filter(a => a.priority === 9)
      .reduce((sum, a) => sum + a.amount, 0);

    const governance = TreasuryGovernanceEngine.evaluate({
      runwayMonths: fco < 0 ? Math.round((availableCash / (Math.abs(fco) / 12)) * 10) / 10 : 99.0,
      isSurvivabilityDegraded: hasRuptureRisk || fco < 0,
      isPLEroded: netIncome < 0,
      fco,
      availableCash,
      isArtificial,
      allocationsToGrowth: totalGrowthAlloc,
      allocationsToDistribution: totalDistAlloc,
      allocationsToExpansion: totalExpansionAlloc
    });
    auditTrail.push(`Treasury governance evaluated. Valid: ${governance.isValid}`);

    // 11. Determine Treasury Severity (Constitutional Hierarchy)
    let severity: RuntimeSeverity = 'STABLE';
    if (resilience.reserveSustainabilityDays < 60 || hasRuptureRisk || governance.governanceMaturity === 'DANGEROUS') {
      severity = 'RESTRICTED';
    } else if (resilience.reserveSustainabilityDays < 180 || stressSimulations.stressSeverity === 'CRITICAL') {
      severity = 'CRITICAL';
    } else if (resilience.reserveSustainabilityDays < 360 || !governance.isValid) {
      severity = 'HIGH';
    } else if (distribution.isBlocked || fiduciaryEfficiency.survivabilityAdjustedEfficiency < 45) {
      severity = 'ELEVATED';
    } else if (resilience.reserveSustainabilityDays < 720 || governance.governanceMaturity === 'DEVIATING') {
      severity = 'MODERATE';
    } else {
      severity = 'STABLE';
    }
    auditTrail.push(`Treasury severity derived: ${severity}`);

    // 12. Fiduciary Disclosures Doctrine
    const fiduciaryDisclosures: string[] = [];
    if (isArtificial || liquidityClassification === 'ARTIFICIAL_LIQUIDITY') {
      fiduciaryDisclosures.push(
        'DISCLOSURE_LIQUIDITY_DEPENDENCY: Liquidez sustentada por fontes externas de financiamento/capital societário, gerando dependência contínua.'
      );
    }
    if (resilience.reserveSustainabilityDays < 360 && normalizedMonthlyCashBurn > 0) {
      fiduciaryDisclosures.push(
        `DISCLOSURE_RUNWAY_FRAGILITY: Horizonte de sobrevivência de caixa inferior a 12 meses (${resilience.reserveSustainabilityDays.toFixed(0)} dias). Preservação de reservas prioritária.`
      );
    }
    if (priorityMatrix.activeCascadeBlock) {
      fiduciaryDisclosures.push(
        'DISCLOSURE_ALLOCATION_LIMITATIONS: Restrição fiduciária ativa impede alocações secundárias em crescimento e distribuição societária.'
      );
    }
    if (reinvestment.reinvestmentQuality === 'LOW' || reinvestment.reinvestmentQuality === 'FRAGILE') {
      fiduciaryDisclosures.push(
        'DISCLOSURE_REINVESTMENT_UNCERTAINTY: Retorno operacional esperado é inconsistente ou incapaz de cobrir o custo de capital sob estresse.'
      );
    }
    if (hasRuptureRisk || severity === 'RESTRICTED') {
      fiduciaryDisclosures.push(
        'DISCLOSURE_SURVIVABILITY_CONSTRAINTS: Risco elevado de ruptura financeira impõe bloqueio compulsório imediato de dividendos e Capex discricionário.'
      );
    }
    if (stressSimulations.stressSeverity === 'CRITICAL') {
      fiduciaryDisclosures.push(
        'DISCLOSURE_STRESS_ASSUMPTIONS: A simulação de estresse cumulativo projeta exaustão acelerada de reservas sob choques combinados de recebíveis e margem.'
      );
    }

    auditTrail.push(`Fiduciary disclosures mapped: ${fiduciaryDisclosures.length}`);

    // Apply Fail-Closed Continuity Behavior
    if (severity === 'RESTRICTED' || severity === 'CRITICAL') {
      // Degrade priorities further
      priorityMatrix.priorities.forEach(p => {
        if (p.priority >= 3) {
          p.status = 'FROZEN';
        }
      });
      priorityMatrix.activeCascadeBlock = true;
    }

    return {
      runtimeMetadata: {
        generatedAt: new Date().toISOString(),
        runtimeVersion: '2.0.0',
        contractVersion: 'RC_1_13A',
        tenantId: 'SYSTEM',
        cycleReference: 'CURRENT'
      },
      lineage: {
        lineageHash: treasuryLineageHash as LineageHash,
        parentHashes: []
      },
      disclosures: fiduciaryDisclosures.map((msg, idx) => ({
        disclosureId: `TREASURY_DISC_${idx}`,
        disclosureType: 'LIMITATION',
        severity: severity,
        sourceRuntime: 'TreasuryGovernanceRuntime',
        restrictionLevel: 'HARD',
        message: msg
      })),
      compliance: {
        integrityStatus: 'INTACT',
        complianceStatus: 'COMPLIANT',
        complianceBlockers: []
      },
      explainability: {
        structuralDrivers: [],
        propagationChains: [],
        evidence: [],
        confidenceDecomposition: {},
        lineageReferences: [],
        level: 'DETERMINISTIC'
      },
      isAvailable: true,
      severity,
      governanceVerdict: governance.verdict,
      priorityMatrix,
      distributionSustainability: distribution,
      reinvestmentIntelligence: reinvestment,
      fiduciaryEfficiency,
      treasuryResilience: resilience,
      cashPriority,
      stressSimulations,
      capitalPreservation
    };
  }

  private static generateLineageHash(inputs: any[]): string {
    const rawStr = inputs.map(i => String(i)).join('|');
    let hash = 0;
    for (let i = 0; i < rawStr.length; i++) {
      const char = rawStr.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash |= 0;
    }
    return 'lineage_treasury_' + Math.abs(hash).toString(16);
  }
}
