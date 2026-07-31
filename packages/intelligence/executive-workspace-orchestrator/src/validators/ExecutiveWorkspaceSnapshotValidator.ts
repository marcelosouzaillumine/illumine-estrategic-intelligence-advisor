import { ExecutiveWorkspaceSnapshot } from '../models/ExecutiveWorkspaceSnapshot';

export class ExecutiveWorkspaceSnapshotValidator {
  validate(snapshot: ExecutiveWorkspaceSnapshot): boolean {
    if (!snapshot.executiveContext?.identity?.tenantId) {
      throw new Error("AR-GFC-EXP-012: WorkspaceSnapshot must be bound to a tenant");
    }
    
    if (!snapshot.situation) {
      throw new Error("AR-GFC-EXP-010: Snapshot Completeness requires an Executive Situation");
    }

    if (!snapshot.narrative) {
      throw new Error("AR-GFC-EXP-010: Snapshot Completeness requires an Executive Narrative");
    }

    if (snapshot.recommendations.length > 0 && !snapshot.recommendationConfidence) {
      throw new Error("AR-GFC-EXP-010: Snapshot Completeness requires Recommendation Confidence");
    }

    return true;
  }
}
