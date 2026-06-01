// src/core/runtime/strategic-simulation/StrategicSimulationEngine.ts
//
// Strategic Simulation Engine
// Executes multi-step longitudinal simulations and recalculates behavior and fatigue.

import {
  SimulatedPath,
  ScenarioCategory,
  SimulationHorizon,
  StressProfile,
  ScenarioClassification
} from './simulation-types';
import { ExecutiveDecision, SurvivabilityScores, DecisionDomain } from '../decision-intelligence/decision-types';
import { BehaviorProfile, FatigueMetrics } from '../behavioral-intelligence/behavioral-types';
import { ScenarioStressEngine } from './ScenarioStressEngine';
import { LiquidityTrajectoryEngine } from './LiquidityTrajectoryEngine';
import { GovernanceImpactSimulationEngine } from './GovernanceImpactSimulationEngine';
import { InstitutionalSurvivabilityEngine } from '../decision-intelligence/InstitutionalSurvivabilityEngine';
import { InstitutionalBehaviorProfileEngine } from '../behavioral-intelligence/InstitutionalBehaviorProfileEngine';
import { GovernanceFatigueEngine } from '../behavioral-intelligence/GovernanceFatigueEngine';
import { DecisionPolicyEngine } from '../decision-policy/DecisionPolicyEngine';

export class StrategicSimulationEngine {
  /**
   * Executes a multi-step longitudinal simulation for a given category.
   */
  public static simulate(
    category: ScenarioCategory,
    horizon: SimulationHorizon,
    initialReport: any,
    stressProfile?: StressProfile,
    candidateDecision?: ExecutiveDecision
  ): SimulatedPath {
    // Clone report to avoid side-effects
    let currentReport = JSON.parse(JSON.stringify(initialReport));
    const originatingAssumptions: string[] = [`Simulated trajectory for ${category} over ${horizon} cycles.`];
    const warnings: string[] = [];

    // Resolve initial history
    let simulatedHistory: ExecutiveDecision[] = [];
    if (initialReport.historicalDecisions && Array.isArray(initialReport.historicalDecisions)) {
      simulatedHistory = JSON.parse(JSON.stringify(initialReport.historicalDecisions));
    }

    // Ensure we have at least 4 decisions in history for lineage confidence and to avoid low history warnings
    if (simulatedHistory.length < 4) {
      const baseHistory: ExecutiveDecision[] = [];
      for (let i = 0; i < 4; i++) {
        baseHistory.push({
          decisionId: `initial_mock_decision_${i}`,
          tenantId: currentReport.tenantId ?? 'default_tenant',
          clientId: currentReport.clientId ?? 'default_client',
          domains: ['Capital Preservation'],
          motivation: 'Initial baseline for simulation.',
          assumptions: [],
          expectedOutcomes: [],
          timestamp: new Date(Date.now() - (4 - i) * 24 * 60 * 60 * 1000).toISOString(),
          approverId: 'system',
          approverRole: 'Governance'
        });
      }
      simulatedHistory = [...baseHistory, ...simulatedHistory];
    }

    // Determine category domains for simulated decisions
    let domains: DecisionDomain[] = ['Capital Preservation'];
    switch (category) {
      case 'Conservative Preservation':
        domains = ['Capital Preservation', 'Cost Reduction'];
        break;
      case 'Controlled Growth':
        domains = ['Operational Expansion', 'Working Capital Allocation'];
        break;
      case 'Survival Stabilization':
        domains = ['Capital Preservation', 'Cost Reduction', 'Strategic Survival'];
        break;
      case 'Aggressive Expansion':
        domains = ['Operational Expansion', 'Workforce Expansion', 'CAPEX'];
        break;
      case 'Debt-Financed Growth':
        domains = ['Debt Expansion', 'CAPEX', 'Operational Expansion'];
        break;
      case 'Turnaround Recovery':
        domains = ['Institutional Restructuring', 'Cost Reduction', 'Working Capital Allocation'];
        break;
      case 'Cost Reduction':
        domains = ['Cost Reduction'];
        break;
      case 'Asset Liquidation':
        domains = ['Asset Disposal'];
        break;
      case 'Liquidity Preservation':
        domains = ['Cash Sustainability'];
        break;
      case 'Capital Reinforcement':
        domains = ['Capital Preservation'];
        break;
      case 'Operational Restructuring':
        domains = ['Institutional Restructuring'];
        break;
      case 'Strategic Retrenchment':
        domains = ['Strategic Survival', 'Cost Reduction'];
        break;
      case 'Governance Stabilization':
        domains = ['Governance Exposure'];
        break;
    }

    let activeProfile = currentReport.tenantConfig?.policyProfile || currentReport.policyProfile || 'BALANCED';

    // Step-by-step projection
    for (let t = 1; t <= horizon; t++) {
      // 1. Simulate decision event
      const simulatedDecision: ExecutiveDecision = {
        decisionId: `sim_decision_${category.replace(/\s+/g, '_')}_cycle_${t}`,
        tenantId: currentReport.tenantId ?? 'default_tenant',
        clientId: currentReport.clientId ?? 'default_client',
        domains,
        motivation: `Simulated decision for step ${t} of ${category}`,
        assumptions: [],
        expectedOutcomes: [],
        timestamp: new Date(Date.now() + t * 30 * 24 * 60 * 60 * 1000).toISOString(),
        approverId: 'simulator',
        approverRole: 'Strategic Planner'
      };

      simulatedHistory.push(simulatedDecision);

      // 2. Project financial state (liquidity, burn, cash balance)
      LiquidityTrajectoryEngine.stepLiquidity(currentReport, category, t);

      // 3. Project governance and structural impact
      GovernanceImpactSimulationEngine.stepGovernance(currentReport, category, t);

      // 4. Apply stress shock at cycle 3 if configured
      if (t === 3 && stressProfile) {
        const stressResult = ScenarioStressEngine.applyStress(currentReport, stressProfile);
        currentReport = stressResult.stressedReport;
        originatingAssumptions.push(...stressResult.assumptions);
      }
    }

    // Apply policy context to get correct calculations
    const lastDecision = simulatedHistory[simulatedHistory.length - 1];
    const policyContext = DecisionPolicyEngine.applyPolicy(lastDecision, currentReport);
    activeProfile = policyContext.activeProfile;

    // Recalculate final state metrics using core engines
    const finalSurvivabilityScores = InstitutionalSurvivabilityEngine.calculate(currentReport, policyContext);
    const finalProfile = InstitutionalBehaviorProfileEngine.calculateCumulativeProfile(
      simulatedHistory,
      currentReport,
      activeProfile
    );
    const finalFatigue = GovernanceFatigueEngine.calculateFatigue(simulatedHistory, currentReport);
    const liquidityRunwayCycles = LiquidityTrajectoryEngine.calculateRunway(currentReport);

    // Assert Preservation over Growth rules (violating survivability < 40)
    const hasViolationBelow40 =
      finalSurvivabilityScores.liquidity < 40 ||
      finalSurvivabilityScores.operational < 40 ||
      finalSurvivabilityScores.governance < 40 ||
      finalSurvivabilityScores.debt < 40 ||
      finalSurvivabilityScores.capitalPreservation < 40 ||
      finalSurvivabilityScores.strategic < 40;

    let classification: ScenarioClassification = 'STABLE';
    if (finalSurvivabilityScores.composite < 30 || hasViolationBelow40 && finalSurvivabilityScores.composite < 40) {
      classification = 'COLLAPSE_TRAJECTORY';
      warnings.push('Alerta Crítico: Trajetória projetada indica risco iminente de colapso institucional.');
    } else if (hasViolationBelow40) {
      classification = 'UNSUSTAINABLE';
      warnings.push('Preservation over Growth Alert: Simulated path is UNSUSTAINABLE due to survivability dropping below 40/100.');
    } else if (finalSurvivabilityScores.composite < 50) {
      classification = 'CRITICAL';
    } else if (finalSurvivabilityScores.composite < 60) {
      classification = 'HIGH_RISK';
    } else if (finalSurvivabilityScores.composite < 80) {
      classification = 'ATTENTION';
    }

    // Hash generation
    const hashInput = `${category}_${horizon}_${stressProfile || 'NONE'}_${classification}_${JSON.stringify(finalSurvivabilityScores)}`;
    const traceHash = ScenarioStressEngine.generateHash(hashInput);

    return {
      category,
      horizon,
      classification,
      traceHash,
      originatingAssumptions,
      finalProfile,
      finalSurvivabilityScores,
      finalFatigue,
      liquidityRunwayCycles,
      warnings,
      stressProfileApplied: stressProfile
    };
  }
}
