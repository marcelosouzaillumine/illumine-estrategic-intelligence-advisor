// src/core/runtime/causal-intelligence/InstitutionalCausalIntelligenceRuntime.ts

import { CausalIntelligenceReport, CausalFactor, PressureVector, CausalGraph } from './types';
import { CashIntelligenceRuntimeOutput } from '../cash-intelligence/CashIntelligenceTypes';
import { InstitutionalPressurePropagationEngine } from './InstitutionalPressurePropagationEngine';
import { LiquidityRootCauseEngine } from './LiquidityRootCauseEngine';
import { SurvivabilityDependencyGraph } from './SurvivabilityDependencyGraph';
import { OperationalStressCascadeEngine } from './OperationalStressCascadeEngine';
import { InstitutionalFragilityCorrelationEngine } from './InstitutionalFragilityCorrelationEngine';
import { HistoricalCycleData } from '../../../runtime/institutional-memory/types';
import { sha256 } from '../../../../platform/crypto/sha256';

export class InstitutionalCausalIntelligenceRuntime {
  public static evaluate(
    cashReport: CashIntelligenceRuntimeOutput,
    dreNetIncome: number,
    dreEbitda: number,
    fco: number,
    workingCapitalVariation: number,
    receivables: number,
    inventory: number,
    availableCash: number,
    thirdPartyFunding: number,
    allHistData: any[],
    historicalCycles: HistoricalCycleData[],
    filterYear: number
  ): CausalIntelligenceReport {
    const auditTrail: string[] = ['Causal Governance execution started.'];

    const yearsAvailable = [...new Set(allHistData.map((d: any) => Number(d.year)))];
    const cyclesCount = yearsAvailable.length;

    // Check if DFC is available in the current year
    const isDfcAvailable = allHistData.some((d: any) => 
      Number(d.year) === filterYear && 
      ((d.type || '').toLowerCase() === 'dfc' || (d.docType || '').toLowerCase() === 'dfc')
    );

    // Generate Lineage inputs
    const inputsToHash = [
      dreNetIncome,
      dreEbitda,
      fco,
      workingCapitalVariation,
      receivables,
      inventory,
      availableCash,
      thirdPartyFunding,
      filterYear,
      cyclesCount,
      isDfcAvailable,
      cashReport.lineageHash || ''
    ];
    const lineagePayload = JSON.stringify(inputsToHash);
    const lineageHash = sha256(lineagePayload);
    auditTrail.push(`Lineage hash generated: ${lineageHash}`);

    // --- Fail-closed propagation Rule 1: Cash report is BLOCKED ---
    if (!cashReport.isAvailable || cashReport.confidenceLevel === 'BLOCKED') {
      auditTrail.push('Causal analysis BLOCKED due to blocked cash sustainability report.');
      return {
        isAvailable: false,
        confidenceLevel: 'BLOCKED',
        rootCauses: [],
        pressurePropagation: [],
        dependencyGraph: { nodes: [{ id: 'BLOCKED', label: 'Análise Causal Bloqueada', type: 'SYMPTOM', severity: 'CRITICAL' }], edges: [] },
        stressCascadePath: ['Cadeia causal interrompida devido a quebra de consistência contábil.'],
        fragilityCorrelations: ['Divergência crítica detectada na camada de reconciliação primária.'],
        causalOpinion: 'Parecer causal retido devido a inconsistências críticas nas demonstrações contábeis primárias.',
        lineageHash,
        auditTrail
      };
    }

    // --- Fail-closed propagation Rule 2: Minimum historical cycles ---
    if (cyclesCount <= 1) {
      auditTrail.push('Causal analysis BLOCKED due to insufficient history (1 cycle).');
      return {
        isAvailable: false,
        confidenceLevel: 'BLOCKED',
        rootCauses: [],
        pressurePropagation: [],
        dependencyGraph: { nodes: [{ id: 'BLOCKED', label: 'Histórico Insuficiente', type: 'SYMPTOM', severity: 'CRITICAL' }], edges: [] },
        stressCascadePath: ['Mapeamento causal exige histórico de pelo menos 2 ciclos.'],
        fragilityCorrelations: ['Necessidade de profundidade temporal para calibrar correlações.'],
        causalOpinion: 'A ausência de série histórica (apenas 1 ciclo disponível) impede qualquer inferência sobre trajetórias de estresse ou causas estruturais.',
        lineageHash,
        auditTrail
      };
    }

    let confidenceLevel: 'HIGH' | 'MODERATE' | 'LOW' | 'RESTRICTED' = 'HIGH';
    if (cyclesCount === 2) {
      confidenceLevel = 'LOW'; // restricted analysis
      auditTrail.push('Causal analysis RESTRICTED due to limited history (2 cycles).');
    }

    // 1. Evaluate Pressure Propagation
    const pressurePropagation = InstitutionalPressurePropagationEngine.evaluate(
      fco,
      workingCapitalVariation,
      receivables,
      inventory,
      availableCash,
      thirdPartyFunding,
      dreNetIncome
    );

    // 2. Evaluate Root Causes
    const rootCauses = LiquidityRootCauseEngine.evaluate(
      cashReport,
      dreNetIncome,
      dreEbitda,
      fco,
      workingCapitalVariation,
      receivables,
      inventory,
      availableCash,
      thirdPartyFunding,
      allHistData,
      historicalCycles,
      filterYear,
      isDfcAvailable
    );

    // 3. Build Graph
    const dependencyGraph = SurvivabilityDependencyGraph.build(rootCauses, fco, isDfcAvailable);

    // 4. Build Cascade Path
    const stressCascadePath = OperationalStressCascadeEngine.evaluate(rootCauses, fco, isDfcAvailable);

    // 5. Build Fragility Correlations
    const fragilityCorrelations = InstitutionalFragilityCorrelationEngine.evaluate(
      cashReport,
      fco,
      thirdPartyFunding,
      receivables,
      inventory
    );

    // 6. Build Causal Opinion under Language Discipline
    let causalOpinion = 'Detected causal pressure indicates stable operational capital flow with structured self-financing.';
    
    if (confidenceLevel === 'LOW') {
      causalOpinion = 'Restricted causal inference due to missing DFC or limited temporal series. Structural evidence indicates potential pressure points.';
    } else if (!isDfcAvailable) {
      causalOpinion = 'Restricted causal inference due to missing DFC. Structural evidence indicates probable root-cause vectors in balance sheet variation, but definitive verification requires cash flow statements.';
    } else if (fco < 0) {
      const activeFactors = rootCauses.map(r => r.label).join(', ');
      causalOpinion = `Fiduciary causal signal detects structural pressure vectors associated with: ${activeFactors || 'queima de caixa operacional'}. Structural evidence indicates stress cascading towards available liquidity reserves.`;
    }

    // Enforce language rules:
    causalOpinion = causalOpinion
      .replace(/a causa e/gi, 'detectado sinal de pressão em')
      .replace(/a causa é/gi, 'detectado sinal de pressão em')
      .replace(/isso prova/gi, 'evidências estruturais indicam')
      .replace(/a empresa faliu porque|a empresa falhou porque/gi, 'vetor de estresse operacional severo associado a');

    return {
      isAvailable: true,
      confidenceLevel: cyclesCount === 2 ? 'LOW' : isDfcAvailable ? 'HIGH' : 'MODERATE',
      rootCauses,
      pressurePropagation,
      dependencyGraph,
      stressCascadePath,
      fragilityCorrelations,
      causalOpinion,
      lineageHash,
      auditTrail
    };
  }
}
