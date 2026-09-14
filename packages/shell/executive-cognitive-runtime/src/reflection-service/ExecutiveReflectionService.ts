import { ExecutiveDecisionPackage } from '../contracts/ExecutiveDecisionPackage';
import { ExecutiveReflectionResult, ReflectionSeverity } from '../contracts/ExecutiveReflectionResult';

export class ExecutiveReflectionService {
  reflect(pkg: ExecutiveDecisionPackage): ExecutiveDecisionPackage {
    const reflection: ExecutiveReflectionResult = {
      assumptionsChallenged: [],
      conflictingEvidence: [],
      ignoredRisks: [],
      optimismBiasDetected: false,
      recommendationWeaknesses: [],
      confidenceAdjustment: 0,
      severity: ReflectionSeverity.NONE
    };
    return { ...pkg, state: 'REFLECTED', reflection };
  }
}

