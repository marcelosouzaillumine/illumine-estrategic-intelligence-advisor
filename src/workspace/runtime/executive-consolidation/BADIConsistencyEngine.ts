import { BoardDecision } from '../executive-prioritization/BoardTop3DecisionEngine';

export class BADIConsistencyEngine {
  public static validate(badiScore: number, hasTension: boolean, boardTop3: BoardDecision[]): boolean {
    if (badiScore >= 75) {
      if (!hasTension || boardTop3.length === 0) {
        return false; // EFOS_EXECUTIVE_INCONSISTENCY
      }
    }
    return true; // EFOS_EXECUTIVE_CONSISTENT
  }
}
