import { ExecutiveDecisionContext, CouncilDecisionContract } from '@illumine/executive-contracts';
import { ExecutiveCFOAgent } from './ExecutiveCFOAgent';
import { ExecutiveCOOAgent } from './ExecutiveCOOAgent';
import { ExecutiveCROAgent } from './ExecutiveCROAgent';
import { ExecutiveCCOAgent } from './ExecutiveCCOAgent';
import { ExecutiveCEOAgent } from './ExecutiveCEOAgent';
import { ExecutiveConsensusEngine } from './ExecutiveConsensusEngine';
import { ExecutiveConflictResolver } from './ExecutiveConflictResolver';
import { ExecutiveVotingEngine } from './ExecutiveVotingEngine';

export class ExecutiveCouncil {
  public static deliberate(context: ExecutiveDecisionContext): CouncilDecisionContract {
    const cfoOp = ExecutiveCFOAgent.evaluate(context);
    const cooOp = ExecutiveCOOAgent.evaluate(context);
    const croOp = ExecutiveCROAgent.evaluate(context);
    const ccoOp = ExecutiveCCOAgent.evaluate(context);
    const ceoOp = ExecutiveCEOAgent.evaluate(context);

    const opinions = [cfoOp, cooOp, croOp, ccoOp, ceoOp];
    const consensus = ExecutiveConsensusEngine.calculateConsensus(opinions);
    const conflictReport = ExecutiveConflictResolver.resolveConflicts(opinions);
    const voting = ExecutiveVotingEngine.tallyVotes(opinions);

    return {
      councilDecisionId: `council-${context.companyId}-${Date.now()}`,
      companyId: context.companyId,
      timestamp: new Date().toISOString(),
      consensusScore: consensus.consensusScore,
      conflictLevel: consensus.conflictLevel,
      financialOpinion: cfoOp,
      operationalOpinion: cooOp,
      riskOpinion: croOp,
      commercialOpinion: ccoOp,
      strategicOpinion: ceoOp,
      finalCouncilRecommendation: conflictReport.resolvedRecommendation,
      votingSummary: {
        approveVotes: voting.approveVotes,
        approveWithReservationsVotes: voting.approveWithReservationsVotes,
        rejectVotes: voting.rejectVotes
      },
      unanimousAgreement: !conflictReport.hasConflict
    };
  }
}
