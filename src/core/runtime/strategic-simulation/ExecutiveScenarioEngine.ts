// src/core/runtime/strategic-simulation/ExecutiveScenarioEngine.ts
//
// Executive Scenario Engine
// Orchestrator. Simulates the candidate pathway and compares it side-by-side with baselines.

import {
  ComparisonReport,
  SimulatedPath,
  ScenarioCategory,
  SimulationHorizon,
  StressProfile
} from './simulation-types';
import { ExecutiveDecision } from '../decision-intelligence/decision-types';
import { StrategicSimulationEngine } from './StrategicSimulationEngine';
import { InstitutionalOptimizationEngine } from './InstitutionalOptimizationEngine';
import { StrategicPathComparisonEngine } from './StrategicPathComparisonEngine';

export class ExecutiveScenarioEngine {
  /**
   * Evaluates a candidate executive decision under a specified horizon and stress profile.
   * Compares the decision side-by-side against automatic baselines:
   * 1. Conservative Preservation
   * 2. Controlled Growth
   * 3. Survival Stabilization
   */
  public static simulateAndCompare(
    decision: ExecutiveDecision,
    report: any,
    horizon: SimulationHorizon = 5,
    stressProfile: StressProfile = 'SEVERE'
  ): ComparisonReport {
    // Determine category based on decision domain or fallback
    let candidateCategory: ScenarioCategory = 'Controlled Growth';
    const domains = decision.domains;

    if (domains.includes('Cost Reduction') || domains.includes('Strategic Survival')) {
      candidateCategory = 'Conservative Preservation';
    } else if (domains.includes('Dividend Distribution') || domains.includes('Debt Expansion')) {
      candidateCategory = 'Debt-Financed Growth';
    } else if (domains.includes('CAPEX') || domains.includes('Operational Expansion')) {
      candidateCategory = 'Aggressive Expansion';
    }

    // 1. Simulate candidate path
    const candidatePath = StrategicSimulationEngine.simulate(
      candidateCategory,
      horizon,
      report,
      stressProfile,
      decision
    );

    // 2. Automatically generate the three comparison baseline paths
    const conservativePreservation = StrategicSimulationEngine.simulate(
      'Conservative Preservation',
      horizon,
      report,
      stressProfile
    );

    const controlledGrowth = StrategicSimulationEngine.simulate(
      'Controlled Growth',
      horizon,
      report,
      stressProfile
    );

    const survivalStabilization = StrategicSimulationEngine.simulate(
      'Survival Stabilization',
      horizon,
      report,
      stressProfile
    );

    // 3. Optimize and rank using the Fiduciary Optimization Engine
    const optimizationResult = InstitutionalOptimizationEngine.selectOptimalPath(
      candidatePath,
      [conservativePreservation, controlledGrowth, survivalStabilization]
    );

    // 4. Calculate uncertainty boundaries of the recommended strategy
    const recommendedPathInstance = [
      candidatePath,
      conservativePreservation,
      controlledGrowth,
      survivalStabilization
    ].find(p => p.category === optimizationResult.optimalCategory) || survivalStabilization;

    const uncertainty = StrategicPathComparisonEngine.calculateUncertainty(recommendedPathInstance);

    // 5. Formulate Advisory Notes
    const advisoryNotes: string[] = [];

    advisoryNotes.push(
      `Análise Preditiva de Cenário: Estresse do perfil ${stressProfile} aplicado no ciclo 3.`
    );

    if (candidatePath.classification === 'UNSUSTAINABLE' || candidatePath.classification === 'COLLAPSE_TRAJECTORY') {
      advisoryNotes.push(
        `AVISO FIDUCIÁRIO: O cenário candidato (${candidatePath.category}) viola limites mínimos de sobrevivência (< 40/100) e foi considerado INELIGÍVEL para recomendação.`
      );
    } else {
      advisoryNotes.push(
        `O cenário candidato (${candidatePath.category}) apresenta conformidade com as restrições fiduciárias.`
      );
    }

    advisoryNotes.push(
      `Estratégia Recomendada: A simulação indica que a rota ideal é "${optimizationResult.optimalCategory}" para preservar a liquidez e estabilizar a governança institucional.`
    );

    // Assert trace hashes and lineage compatibility
    advisoryNotes.push(
      `Rastreabilidade da Decisão: Código de rastreamento fiduciário do cenário recomendado: ${recommendedPathInstance.traceHash}`
    );

    return {
      candidatePath,
      baselines: {
        conservativePreservation,
        controlledGrowth,
        survivalStabilization
      },
      recommendedPath: optimizationResult.optimalCategory,
      uncertaintyBoundaries: uncertainty,
      advisoryNotes,
      timestamp: new Date().toISOString()
    };
  }
}
