import { ExecutiveFinancialState } from '../contracts/ExecutiveFinancialState';
import { ExecutiveDiagnosis } from '../contracts/ExecutiveDiagnosis';
import { InstitutionalMemoryAdvisor } from '../learning/InstitutionalMemoryAdvisor';
import { ExecutivePolicyEngine } from '../policy/ExecutivePolicyEngine';
import { DecisionIntentGuard } from '../governance/DecisionIntentGuard';
import { ExecutiveDiagnosisBuilder } from '../diagnostics/ExecutiveDiagnosisBuilder';
import { ExecutiveRecommendationEngine } from '../diagnostics/ExecutiveRecommendationEngine';
import { LearningEvent } from '../learning/LearningEvent';

export class DecisionPipeline {
  /**
   * Decide a política, bloqueia infrações e compila o Diagnóstico Institucional.
   */
  public static run(
    state: ExecutiveFinancialState,
    proposedIntent: string | undefined,
    learningHistory: LearningEvent[],
    evidenceHash: string
  ): ExecutiveDiagnosis {
    
    // 1. Institutional Memory Advisor
    const memoryAlerts = InstitutionalMemoryAdvisor.consult(state, learningHistory);

    // 2. Executive Policy Engine
    const policy = ExecutivePolicyEngine.evaluate(state);

    // 3. Decision Intent Guard (with Policy and Intent)
    const intentResult = DecisionIntentGuard.validate(proposedIntent || '', policy);

    // 4. Executive Diagnosis Builder (also consumes Priority Engine internally)
    const diagnosis = ExecutiveDiagnosisBuilder.build(state, policy, intentResult, memoryAlerts, evidenceHash);

    // 5. Executive Recommendation Engine
    diagnosis.recommendations = ExecutiveRecommendationEngine.generate(diagnosis);

    return diagnosis;
  }
}
