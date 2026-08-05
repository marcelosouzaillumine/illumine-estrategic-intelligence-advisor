import { ArtifactLifecycle } from '../artifacts/IntelligenceArtifactRegistry';

export interface ArtifactLifecycleTransition {
  from: ArtifactLifecycle | "created";
  to: ArtifactLifecycle;
  requiredConditions: string[]; // e.g., ["EVIDENCE_REQUIRED", "HUMAN_APPROVAL_REQUIRED"]
  autoTransitionAllowed: boolean; // if false, needs manual action
}
