import { AgentOpinionContract } from '@illumine/executive-contracts';

export interface VotingSummary {
  readonly approveVotes: number;
  readonly approveWithReservationsVotes: number;
  readonly rejectVotes: number;
  readonly totalVotes: number;
  readonly isApproved: boolean;
}

export class ExecutiveVotingEngine {
  public static tallyVotes(opinions: readonly AgentOpinionContract[]): VotingSummary {
    const approveVotes = opinions.filter(o => o.votedDecision === 'APPROVE').length;
    const approveWithReservationsVotes = opinions.filter(o => o.votedDecision === 'APPROVE_WITH_RESERVATIONS').length;
    const rejectVotes = opinions.filter(o => o.votedDecision === 'REJECT').length;

    return {
      approveVotes,
      approveWithReservationsVotes,
      rejectVotes,
      totalVotes: opinions.length,
      isApproved: (approveVotes + approveWithReservationsVotes) > rejectVotes
    };
  }
}
