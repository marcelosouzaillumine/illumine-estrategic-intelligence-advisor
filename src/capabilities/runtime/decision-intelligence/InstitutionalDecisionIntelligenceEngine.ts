// src/core/runtime/decision-intelligence/InstitutionalDecisionIntelligenceEngine.ts
//
// Institutional Decision Intelligence Engine (Orchestrator)
// Ref: docs/implementation_plan.md

import {
  ExecutiveDecision,
  DecisionValidationResult,
  SurvivabilityScores,
  DecisionCertification,
  DecisionSeverity
} from './decision-types';

import { DecisionComplianceEngine } from './DecisionComplianceEngine';
import { InstitutionalSurvivabilityEngine } from './InstitutionalSurvivabilityEngine';
import { DecisionCausalityEngine } from './DecisionCausalityEngine';
import { GovernanceTrajectoryEngine } from './GovernanceTrajectoryEngine';
import { InstitutionalDecisionLedger } from './InstitutionalDecisionLedger';
import { DecisionTradeoffEngine } from './DecisionTradeoffEngine';
import { StrategicStressEngine } from './StrategicStressEngine';
import { DecisionPolicyEngine } from '../../core/runtime/decision-policy/DecisionPolicyEngine';
import { InstitutionalBehavioralIntelligenceEngine } from '../behavioral-intelligence/InstitutionalBehavioralIntelligenceEngine';

export class InstitutionalDecisionIntelligenceEngine {
  /**
   * Evaluates an executive decision against the full institutional report context.
   * Performs survivability assessment, compliance validation, and trajectory memory tracking.
   */
  public static async evaluateDecision(
    decision: ExecutiveDecision,
    report: any
  ): Promise<DecisionValidationResult> {
    if (!decision) {
      throw new Error('VIOLAÇÃO DE GOVERNANÇA: Impossível processar decisão nula.');
    }

    const timestamp = new Date().toISOString();

    // 1. Apply Decision Policy Layer
    const policyContext = DecisionPolicyEngine.applyPolicy(decision, report);

    // 2. Calculate Survivability Scores under policy
    const survivabilityScores = InstitutionalSurvivabilityEngine.calculate(report, policyContext);

    // 3. Perform Compliance Validation under policy
    const complianceResult = DecisionComplianceEngine.validate(decision, report, survivabilityScores, policyContext);
    let { isValid, severity, violations, warnings } = complianceResult;

    // 4. Perform Causality Mapping & Propagation Analysis
    const causalityResult = DecisionCausalityEngine.analyze(decision);

    // 4. Retrieve Longitudinal Decisions from Ledger and check Governance Trajectory
    let historicalDecisions: ExecutiveDecision[] = [];
    try {
      historicalDecisions = await InstitutionalDecisionLedger.getDecisions(decision.tenantId, decision.clientId);
    } catch (e) {
      console.warn('[DecisionGovernanceEngine] Failed to retrieve ledger history:', e);
    }
    const trajectory = GovernanceTrajectoryEngine.analyzeTrajectory(historicalDecisions, report.scores?.governance ?? 70);

    // Integrate trajectory warning/severity modulation
    if (trajectory.recurringStressDetected || trajectory.trajectoryStatus === 'DEGRADING') {
      if (!warnings.includes('Aviso de Sobrevivência: Monitoramento recomendado para o domínio da decisão.')) {
        warnings.push('Aviso de Sobrevivência: Monitoramento recomendado para o domínio da decisão.');
      }
      if (severity === 'SAFE' || severity === 'ATTENTION') {
        severity = 'HIGH_RISK';
      }
    }

    // 4.5. Evaluate Behavioral & Predictive Intelligence (Longitudinal)
    let behavioralResult: any = null;
    let predictiveResult: any = null;

    try {
      behavioralResult = InstitutionalBehavioralIntelligenceEngine.evaluateBehavior(
        decision,
        report,
        historicalDecisions,
        policyContext?.activeProfile
      );

      if (behavioralResult) {
        // Merge behavioral warnings
        for (const w of behavioralResult.warnings) {
          if (!warnings.includes(w)) {
            warnings.push(w);
          }
        }

        // Elevate severity to UNSUSTAINABLE if CONSTITUTIONAL_DRIFT is active
        if (behavioralResult.driftSeverity === 'CONSTITUTIONAL_DRIFT') {
          violations.push(
            `BLOQUEIO COMPORTAMENTAL: Ruptura fiduciária longitudinal (CONSTITUTIONAL_DRIFT) confirmada. Operações de capital bloqueadas devido à recorrência persistente de desvios de governança.`
          );
          severity = 'UNSUSTAINABLE';
        }
      }
    } catch (err) {
      console.warn('[DecisionGovernanceEngine] Failed to evaluate behavioral governance:', err);
    }

    if (behavioralResult) {
      try {
        const { PredictiveGovernanceEngine } = await import('../predictive-intelligence/PredictiveGovernanceEngine');
        predictiveResult = PredictiveGovernanceEngine.evaluatePrediction(
          decision,
          report,
          historicalDecisions,
          policyContext?.activeProfile || 'BALANCED',
          behavioralResult
        );

        if (predictiveResult) {
          // Merge predictive warnings
          for (const w of predictiveResult.warnings) {
            const warningText = `Alerta Preditivo (${w.warningClass}): ${w.description}`;
            if (!warnings.includes(warningText)) {
              warnings.push(warningText);
            }
          }

          // Double-confirmation rule for predictive blocking
          const isPredictiveSeverityCritical =
            predictiveResult.predictiveSeverity === 'RUPTURE_RISK' ||
            predictiveResult.predictiveSeverity === 'SYSTEMIC_COLLAPSE_RISK';

          const isConfidenceSufficient =
            predictiveResult.predictiveConfidence === 'MEDIUM' ||
            predictiveResult.predictiveConfidence === 'HIGH';

          const aggressiveDomains = [
            'Dividend Distribution',
            'Debt Expansion',
            'Operational Expansion',
            'CAPEX',
            'Workforce Expansion',
            'Financing Strategy'
          ];
          const belongsToAggressiveDomain = decision.domains.some(d => aggressiveDomains.includes(d));
          const hasLineageSupport = historicalDecisions.length >= 4;

          const isSupportedByEvidence =
            predictiveResult.resilienceIndex < 50 ||
            predictiveResult.systemicFailureProbability > 50 ||
            predictiveResult.isRuptureApproaching ||
            predictiveResult.deteriorationMomentum.survivabilityMomentum < 0;

          if (
            isPredictiveSeverityCritical &&
            isConfidenceSufficient &&
            belongsToAggressiveDomain &&
            hasLineageSupport &&
            isSupportedByEvidence
          ) {
            violations.push(
              `BLOQUEIO PREDITIVO: Risco de ruptura/colapso fiduciário iminente (${predictiveResult.predictiveSeverity}) verificado sob confiança ${predictiveResult.predictiveConfidence}. Operações de capital/expansão bloqueadas por prudência preditiva.`
            );
            severity = 'UNSUSTAINABLE';
          }
        }
      } catch (err) {
        console.warn('[DecisionGovernanceEngine] Failed to evaluate predictive governance:', err);
      }
    }

    // Recalculate decision validity based on compliance + behavioral + predictive evaluation
    isValid = violations.length === 0 && severity !== 'UNSUSTAINABLE' && severity !== 'CONSTITUTIONAL_VIOLATION';

    // 5. Evaluate Strategic Shocks & Stress
    const stress = StrategicStressEngine.evaluateStress(decision, report);

    // 6. Map Tradeoffs
    const tradeoffs = DecisionTradeoffEngine.analyzeTradeoffs(decision, survivabilityScores);

    // 7. Calculate Fiduciary Decision Certification
    const hasConstitutionalViolation = violations.some(v => v.includes('VIOLAÇÃO CONSTITUCIONAL') || v.includes('BLOQUEIO DE SOBREVIVÊNCIA'));
    const fiduciaryCompatibility = Math.max(0, 100 - (violations.length * 20));
    const survivabilityIntegrity = survivabilityScores.composite;
    const governanceConsistency = Math.max(0, 100 - (trajectory.recurringStressDetected ? 30 : 0));
    const mathematicalSustainability = Math.max(0, 100 - Math.abs(stress.stressScoreDelta));
    const liquidityCompatibility = survivabilityScores.liquidity;
    const strategicCoherence = trajectory.trajectoryStatus === 'DEGRADING' ? 50 : 100;
    const constitutionalCompliance = hasConstitutionalViolation ? 0 : (violations.length > 0 ? 50 : 100);

    const minScore = Math.min(
      fiduciaryCompatibility,
      survivabilityIntegrity,
      governanceConsistency,
      mathematicalSustainability,
      liquidityCompatibility,
      strategicCoherence,
      constitutionalCompliance
    );

    let overallGrade: 'A' | 'B' | 'C' | 'D' | 'F' = 'F';
    if (minScore >= 95 && isValid) overallGrade = 'A';
    else if (minScore >= 80 && isValid) overallGrade = 'B';
    else if (minScore >= 70 && isValid) overallGrade = 'C';
    else if (minScore >= 60 && isValid) overallGrade = 'D';
    else overallGrade = 'F';

    const signature = `DEC-CERT-${decision.decisionId}-${minScore}-${overallGrade}-${timestamp}`;

    const certification: DecisionCertification = {
      fiduciaryCompatibility,
      survivabilityIntegrity,
      governanceConsistency,
      mathematicalSustainability,
      liquidityCompatibility,
      strategicCoherence,
      constitutionalCompliance,
      overallGrade,
      certifiedAt: timestamp,
      signature
    };

    // 8. If validated, persist in the dedicated Firestore decision ledger
    if (isValid) {
      const decisionWithHash = {
        ...decision,
        lineageHash: signature
      };
      try {
        await InstitutionalDecisionLedger.recordDecision(decisionWithHash);
      } catch (e) {
        console.error('[DecisionGovernanceEngine] Failed to save decision in ledger:', e);
      }
    }

    return {
      decisionId: decision.decisionId,
      isValid,
      severity,
      violations,
      warnings,
      survivabilityScores,
      certification,
      propagationPath: causalityResult.propagationPath,
      timestamp,
      policyProfile: policyContext.activeProfile,
      predictiveAssessment: predictiveResult
    };
  }
}
