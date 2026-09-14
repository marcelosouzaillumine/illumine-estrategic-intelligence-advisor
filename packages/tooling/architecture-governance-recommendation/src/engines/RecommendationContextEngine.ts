import { RecommendationContext } from '../models/RecommendationContext';

export class RecommendationContextEngine {
  buildContext(capabilityId: string, history: any): RecommendationContext {
    return {
      capabilityId,
      architectureState: history.currentStateId || '',
      memoryReferences: history.memoryReferences || [],
      decisionHistory: history.decisionHistory || [],
      certificationHistory: history.certificationHistory || [],
      exposureAssessment: history.exposureAssessment || [],
      evolutionTrajectory: history.evolutionTrajectory || [],
      constraints: history.constraints || []
    };
  }
}
