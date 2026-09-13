// src/core/runtime/operating-pressure/InstitutionalPressureRuntime.ts

import { sha256 } from '../../../platform/crypto/sha256';
import { PressureRuntimeInput, InstitutionalPressureRuntimeOutput, OperatingPressureSeverity } from './operating-pressure-types';
import { PressureAccumulationEngine } from './PressureAccumulationEngine';
import { OperationalFatigueEngine } from './OperationalFatigueEngine';
import { LiquidityCompressionEngine } from './LiquidityCompressionEngine';
import { TreasuryErosionEngine } from './TreasuryErosionEngine';
import { FundingFragilityEngine } from './FundingFragilityEngine';
import { PressurePropagationEngine } from './PressurePropagationEngine';
import { OperatingPressureThesisEngine } from './OperatingPressureThesisEngine';
import { OperatingPressureExplainabilityEngine } from './OperatingPressureExplainabilityEngine';
import { PressureNarrativeComposer } from './PressureNarrativeComposer';
import { LongitudinalPressureMemoryEngine } from './LongitudinalPressureMemoryEngine';

export class InstitutionalPressureRuntime {
  public static evaluate(input: PressureRuntimeInput): InstitutionalPressureRuntimeOutput {
    if (!input || !input.currentCycle) {
      return this.emptyOutput();
    }

    // 1. Run Engines
    const accumulation = PressureAccumulationEngine.evaluate(input);
    const fatigue = OperationalFatigueEngine.evaluate(input);
    const compression = LiquidityCompressionEngine.evaluate(input);
    const erosion = TreasuryErosionEngine.evaluate(input);
    const fragility = FundingFragilityEngine.evaluate(input);

    const scores = {
      accumulation: accumulation.accumulationScore,
      fatigue: fatigue.fatigueScore,
      compression: compression.compressionScore,
      erosion: erosion.erosionScore,
      fragility: fragility.fragilityScore
    };

    // 2. Weighted Score Calculation
    // weights: fatigue 25%, accumulation 20%, compression 20%, erosion 20%, fragility 15%
    const pressureScore = Math.min(
      Math.max(
        scores.fatigue * 0.25 +
        scores.accumulation * 0.20 +
        scores.compression * 0.20 +
        scores.erosion * 0.20 +
        scores.fragility * 0.15,
        0
      ),
      100
    );

    // 3. Severity Assignment
    let overallPressureLevel: OperatingPressureSeverity = 'STABLE';
    if (pressureScore > 85) {
      overallPressureLevel = 'ACUTE';
    } else if (pressureScore > 70) {
      overallPressureLevel = 'CRITICAL';
    } else if (pressureScore > 50) {
      overallPressureLevel = 'ELEVATED';
    } else if (pressureScore > 25) {
      overallPressureLevel = 'MODERATE';
    }

    // 4. Generate Lineage Hash (using crypto to ensure fiduciarity)
    const currentCycleRef = String(input.currentCycle.revenue || 'no-rev') + '-' + String(input.currentCycle.availableCash || 'no-cash');
    const signalsToHash = {
      scores,
      tenantId: input.tenantId || 'default-tenant',
      cycleReference: currentCycleRef
    };
    const pressureHash = sha256(JSON.stringify(signalsToHash));

    // 5. Propagation & Thesis
    const propagation = PressurePropagationEngine.evaluate(input, scores);
    const thesisScores = { ...scores, overall: pressureScore };
    const thesis = OperatingPressureThesisEngine.evaluate(input, thesisScores);

    // 6. Explainability
    const explainability = OperatingPressureExplainabilityEngine.evaluate(
      input,
      thesisScores,
      propagation.propagationChain,
      pressureHash
    );

    // 7. Narratives & Disclosures
    const fiduciaryDisclosures = PressureNarrativeComposer.composeDisclosures(overallPressureLevel, thesisScores);
    const auditTrail = [
      `[${new Date().toISOString()}] Evaluated Institutional Operating Pressure score: ${pressureScore.toFixed(1)}/100`,
      `[${new Date().toISOString()}] Generated lineage hash: ${pressureHash}`
    ];

    // 8. Longitudinal Persistence (Fiduciary serialization limit enforced: no narratives stored)
    const recurrenceCount = input.historicalCycles
      ? input.historicalCycles.filter((h: any) => h.overallPressureLevel === 'ACUTE' || h.pressureScore > 85).length
      : 0;

    LongitudinalPressureMemoryEngine.persistPressure({
      pressureSignals: {
        accumulationScore: scores.accumulation,
        fatigueScore: scores.fatigue,
        compressionScore: scores.compression,
        erosionScore: scores.erosion,
        fragilityScore: scores.fragility,
        overallScore: pressureScore
      },
      evidenceLineage: {
        revenue: input.currentCycle.revenue,
        ebitda: input.currentCycle.ebitda,
        availableCash: input.currentCycle.availableCash,
        ocf: input.currentCycle.ocf,
        shortTermDebt: input.currentCycle.shortTermDebt,
        totalDebt: input.currentCycle.totalDebt
      },
      recurrenceCount,
      pressureHash,
      tenantId: input.tenantId || 'default-tenant',
      cycleReference: currentCycleRef
    });

    return {
      isAvailable: true,
      overallPressureLevel,
      pressureScore,
      pressureAccumulation: accumulation,
      operationalFatigue: fatigue,
      liquidityCompression: compression,
      treasuryErosion: erosion,
      fundingFragility: fragility,
      propagation,
      thesis,
      explainability,
      pressureLineageHash: pressureHash,
      fiduciaryDisclosures,
      auditTrail
    };
  }

  private static emptyOutput(): InstitutionalPressureRuntimeOutput {
    return {
      isAvailable: false,
      overallPressureLevel: 'STABLE',
      pressureScore: 0,
      pressureAccumulation: { accumulationScore: 0, persistenceTrend: 'STABLE', accumulatedFactors: [] },
      operationalFatigue: { fatigueScore: 0, fatigueLevel: 'LOW', operatingAbsorptionRatio: 0, warnings: [] },
      liquidityCompression: { compressionScore: 0, deteriorationVelocity: 0, compressionState: 'NORMAL', strainFactors: [] },
      treasuryErosion: { erosionScore: 0, drainVelocity: 0, erosionState: 'STABLE', warnings: [] },
      fundingFragility: { fragilityScore: 0, fundingDependency: 'NONE', rolloverPressureRatio: 0, rolloverRiskLevel: 'LOW', warnings: [] },
      propagation: { propagationLevel: 'LOW', propagationChain: [], activePathways: [] },
      thesis: {
        thesisSummary: 'Dados insuficientes para composição de tese de pressão operacional.',
        pressureProfile: 'Não disponível.',
        operationalFatigueProfile: 'Não disponível.',
        liquidityStrainProfile: 'Não disponível.',
        treasuryErosionProfile: 'Não disponível.',
        institutionalOperatingStrain: 'Não disponível.'
      },
      explainability: {
        pressureLineage: '',
        structuralRationale: '',
        strainDecomposition: [],
        propagationExplanation: '',
        confidenceDecomposition: ''
      },
      pressureLineageHash: '',
      fiduciaryDisclosures: [],
      auditTrail: []
    };
  }
}
