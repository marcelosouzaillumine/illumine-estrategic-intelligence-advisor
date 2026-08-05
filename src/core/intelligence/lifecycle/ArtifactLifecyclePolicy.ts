import { ArtifactLifecycleTransition } from './ArtifactLifecycleTransition';
import { ArtifactLifecycle } from '../artifacts/IntelligenceArtifactRegistry';

export class ArtifactLifecyclePolicy {
  private transitions: ArtifactLifecycleTransition[] = [
    { from: "created", to: "detected", requiredConditions: [], autoTransitionAllowed: true },
    { from: "detected", to: "validated", requiredConditions: ["HAS_EVIDENCE"], autoTransitionAllowed: true },
    { from: "validated", to: "approved", requiredConditions: ["HUMAN_APPROVAL"], autoTransitionAllowed: false },
    { from: "approved", to: "executed", requiredConditions: ["EXECUTION_REFERENCE"], autoTransitionAllowed: false },
    { from: "executed", to: "measured", requiredConditions: ["OUTCOME_DATA"], autoTransitionAllowed: false },
    { from: "measured", to: "learned", requiredConditions: ["IMPACT_ASSESSED"], autoTransitionAllowed: true }
  ];

  canTransition(from: ArtifactLifecycle | "created", to: ArtifactLifecycle, conditionsMet: string[]): boolean {
    const transition = this.transitions.find(t => t.from === from && t.to === to);
    if (!transition) return false;
    
    return transition.requiredConditions.every(cond => conditionsMet.includes(cond));
  }
}
