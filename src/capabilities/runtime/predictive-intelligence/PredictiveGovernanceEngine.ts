// src/core/runtime/predictive-intelligence/PredictiveGovernanceEngine.ts
//
// Predictive Governance Engine (Orchestrator & Simulator)
// Coordinates all predictive evaluations and simulates future governance scenarios.

import { ExecutiveDecision, SurvivabilityScores } from '../decision-intelligence/decision-types';
import { DecisionPolicyProfile } from '../../../core/runtime/decision-policy/policy-types';
import { BehavioralAssessmentResult } from '../behavioral-intelligence/behavioral-types';
import {
  PredictiveAssessmentResult,
  PredictiveSeverity,
  PredictiveConfidence,
  EarlyWarningSignal
} from './predictive-types';

import { DeteriorationMomentumEngine } from './DeteriorationMomentumEngine';
import { BehavioralAccelerationEngine } from './BehavioralAccelerationEngine';
import { SurvivabilityProjectionEngine } from './SurvivabilityProjectionEngine';
import { TrajectoryForecastEngine } from './TrajectoryForecastEngine';
import { InstitutionalResilienceEngine } from './InstitutionalResilienceEngine';
import { RecoveryViabilityEngine } from './RecoveryViabilityEngine';
import { StrategicCollapseRiskEngine } from './StrategicCollapseRiskEngine';
import { GovernanceRuptureEngine } from './GovernanceRuptureEngine';
import { InstitutionalEarlyWarningEngine } from './InstitutionalEarlyWarningEngine';
import { InstitutionalBehaviorProfileEngine } from '../behavioral-intelligence/InstitutionalBehaviorProfileEngine';
import { GovernanceFatigueEngine } from '../behavioral-intelligence/GovernanceFatigueEngine';

export interface SimulationResult {
  stepsSimulated: number;
  scenario: string;
  finalProfile: any;
  finalSurvivabilityScores: SurvivabilityScores;
}

export class PredictiveGovernanceEngine {
  /**
   * Performs the central predictive intelligence and early warning evaluation.
   */
  public static evaluatePrediction(
    decision: ExecutiveDecision,
    report: any,
    history: ExecutiveDecision[],
    activeProfile: DecisionPolicyProfile,
    behavioralResult: BehavioralAssessmentResult
  ): PredictiveAssessmentResult {
    const historyCount = history ? history.length : 0;

    // 1. Short History Refinement Rule:
    // If fewer than 4 historical decisions are available, return INSUFFICIENT_PREDICTIVE_HISTORY
    if (historyCount < 4) {
      return {
        predictiveSeverity: 'INSUFFICIENT_PREDICTIVE_HISTORY',
        predictiveConfidence: 'LOW',
        warnings: [],
        trajectoryForecast: [],
        deteriorationMomentum: {
          liquidityMomentum: 0,
          governanceStabilityMomentum: 0,
          fatigueEscalationMomentum: 0,
          strategicVolatilityMomentum: 0,
          driftAccelerationMomentum: 0,
          survivabilityMomentum: 0
        },
        resilienceIndex: 50,
        recoveryViabilityIndex: 50,
        falseRecoveryRisk: false,
        isRuptureApproaching: false,
        systemicFailureProbability: 0,
        timestamp: new Date().toISOString()
      };
    }

    // 2. Resolve sub-engine calculations
    const momentum = DeteriorationMomentumEngine.calculateMomentum(history, report, activeProfile);
    const acceleration = BehavioralAccelerationEngine.calculateAcceleration(history, report);
    
    // Construct current survivability scores from report context
    const currentScores: SurvivabilityScores = {
      liquidity: report?.scores?.financial ?? 70,
      operational: report?.scores?.operational ?? 70,
      governance: report?.scores?.governance ?? 70,
      debt: report?.scores?.financial ?? 70,
      capitalPreservation: report?.scores?.structural ?? 70,
      strategic: report?.scores?.composite ?? 70,
      composite: report?.scores?.composite ?? 70
    };

    const projection = SurvivabilityProjectionEngine.projectSurvivability(currentScores, momentum, 5);
    const forecast = TrajectoryForecastEngine.forecastTrajectory(currentScores, momentum, history, 5);
    const resilience = InstitutionalResilienceEngine.evaluateResilience(history, report, behavioralResult.profile, behavioralResult.fatigue);
    const recovery = RecoveryViabilityEngine.assessRecovery(history, report, behavioralResult.profile, resilience, behavioralResult.fatigue);
    const collapse = StrategicCollapseRiskEngine.evaluateCollapseRisk(history, report, behavioralResult.profile, projection);
    const rupture = GovernanceRuptureEngine.evaluateRupture(projection, resilience, collapse, behavioralResult.driftSeverity);
    
    const warnings = InstitutionalEarlyWarningEngine.generateWarnings(
      behavioralResult.profile,
      behavioralResult.fatigue,
      behavioralResult.scores.executiveConsistency,
      behavioralResult.driftSeverity,
      momentum,
      acceleration,
      projection,
      resilience,
      recovery,
      collapse,
      rupture
    );

    // 3. Resolve final PredictiveSeverity & Confidence
    let predictiveSeverity: PredictiveSeverity = 'STABLE';
    if (rupture.isRuptureApproaching) {
      predictiveSeverity = rupture.ruptureTimeHorizon === 'IMINENTE' ? 'RUPTURE_RISK' : 'HIGH_RISK';
    } else if (collapse.systemicFailureProbability > 65) {
      predictiveSeverity = 'SYSTEMIC_COLLAPSE_RISK';
    } else if (collapse.systemicFailureProbability > 45 || driftPropertyWarning(behavioralResult.driftSeverity)) {
      predictiveSeverity = 'CRITICAL';
    } else if (warnings.length > 0) {
      predictiveSeverity = 'ATTENTION';
    }

    const predictiveConfidence: PredictiveConfidence = historyCount >= 10 ? 'HIGH' : 'MEDIUM';

    return {
      predictiveSeverity,
      predictiveConfidence,
      warnings,
      trajectoryForecast: forecast,
      deteriorationMomentum: {
        liquidityMomentum: momentum.liquidityMomentum,
        governanceStabilityMomentum: momentum.governanceStabilityMomentum,
        fatigueEscalationMomentum: momentum.fatigueEscalationMomentum,
        strategicVolatilityMomentum: momentum.strategicVolatilityMomentum,
        driftAccelerationMomentum: momentum.driftAccelerationMomentum,
        survivabilityMomentum: momentum.survivabilityMomentum
      },
      resilienceIndex: resilience.resilienceIndex,
      recoveryViabilityIndex: recovery.viabilityIndex,
      falseRecoveryRisk: recovery.falseRecoveryRisk,
      isRuptureApproaching: rupture.isRuptureApproaching,
      systemicFailureProbability: collapse.systemicFailureProbability,
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Simulates N future steps under various strategic scenarios.
   * Horizon supports 3 (tactical), 5 (standard), 8-10 (stress test) steps.
   */
  public static simulateScenario(
    history: ExecutiveDecision[],
    report: any,
    activeProfile: DecisionPolicyProfile,
    scenario: 'AGGRESSIVE_EXPANSION' | 'LIQUIDITY_DETERIORATION' | 'EMERGENCY_RESTRUCTURING' | 'SUSTAINED_FATIGUE' | 'STRATEGIC_VOLATILITY' | 'RECOVERY_STABILIZATION',
    steps: number = 5
  ): SimulationResult {
    // Validate steps input
    const validSteps = steps === 3 || steps === 5 || steps === 8 || steps === 10 ? steps : 5;

    // Create a copy of the history
    const simHistory = [...history];
    const dummyReport = JSON.parse(JSON.stringify(report || {}));

    for (let t = 1; t <= validSteps; t++) {
      let domains: any[] = [];
      let motivation = '';

      switch (scenario) {
        case 'AGGRESSIVE_EXPANSION':
          domains = ['Operational Expansion', 'CAPEX'];
          motivation = 'Expansão agressiva planejada na simulação.';
          dummyReport.ocf = -1000; // expansion exhausts cash flow
          if (dummyReport.cashFlowReport?.operational) {
            dummyReport.cashFlowReport.operational.fco = -1000;
          }
          break;
        case 'LIQUIDITY_DETERIORATION':
          domains = ['Dividend Distribution'];
          motivation = 'Retirada sistemática de lucros na simulação.';
          dummyReport.ocf = -1000; // Force negative cash flow
          if (dummyReport.cashFlowReport?.operational) {
            dummyReport.cashFlowReport.operational.fco = -1000;
          }
          break;
        case 'EMERGENCY_RESTRUCTURING':
          domains = ['Cost Reduction'];
          motivation = 'Corte de despesas de sobrevivência corporativa.';
          break;
        case 'SUSTAINED_FATIGUE':
          // Alternating cost cuts and capex
          domains = t % 2 === 0 ? ['Cost Reduction'] : ['CAPEX'];
          motivation = 'Alternância forçada para simular fadiga.';
          break;
        case 'STRATEGIC_VOLATILITY':
          domains = t % 3 === 0 ? ['Dividend Distribution'] : t % 3 === 1 ? ['Cost Reduction'] : ['Operational Expansion'];
          motivation = 'Mudança rápida de foco estratégico.';
          break;
        case 'RECOVERY_STABILIZATION':
          domains = ['Capital Preservation'];
          motivation = 'Preservação de recursos e desalavancagem.';
          dummyReport.ocf = 1200; // Positive cash flow recovery
          if (dummyReport.cashFlowReport?.operational) {
            dummyReport.cashFlowReport.operational.fco = 1200;
          }
          break;
      }

      const mockDecision: ExecutiveDecision = {
        decisionId: `SIM-DEC-${t}-${Date.now()}`,
        tenantId: simHistory[0]?.tenantId ?? 'SIM-TENANT',
        clientId: simHistory[0]?.clientId ?? 'SIM-CLIENT',
        domains,
        value: 1000,
        motivation,
        assumptions: ['Simulação de contexto preditivo'],
        expectedOutcomes: ['Resultado simulado'],
        timestamp: new Date(Date.now() + t * 24 * 60 * 60 * 1000).toISOString(),
        approverId: 'USR-SIM',
        approverRole: 'CEO'
      };

      simHistory.push(mockDecision);
    }

    // Recalculate behavior profiles and mock final scores
    const finalProfile = InstitutionalBehaviorProfileEngine.calculateCumulativeProfile(simHistory, dummyReport, activeProfile);
    const finalFatigue = GovernanceFatigueEngine.calculateFatigue(simHistory, dummyReport);

    const finalSurvivabilityScores: SurvivabilityScores = {
      liquidity: finalProfile.prudence,
      operational: finalProfile.survivabilityDiscipline,
      governance: finalProfile.governanceConsistency,
      debt: finalProfile.capitalPreservationDiscipline,
      capitalPreservation: finalProfile.capitalPreservationDiscipline,
      strategic: 100 - finalFatigue.compositeFatigue,
      composite: Math.round(
        (finalProfile.prudence +
          finalProfile.survivabilityDiscipline +
          finalProfile.governanceConsistency +
          finalProfile.capitalPreservationDiscipline +
          (100 - finalFatigue.compositeFatigue)) / 5
      )
    };

    return {
      stepsSimulated: validSteps,
      scenario,
      finalProfile,
      finalSurvivabilityScores
    };
  }
}

function driftPropertyWarning(severity: any): boolean {
  return severity === 'CRITICAL_DRIFT' || severity === 'CONSTITUTIONAL_DRIFT';
}
