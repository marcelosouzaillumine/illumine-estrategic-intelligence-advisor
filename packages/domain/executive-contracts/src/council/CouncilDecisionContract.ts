import { AgentOpinionContract } from './AgentOpinionContract';

export interface CouncilDecisionContract {
  readonly councilDecisionId: string;
  readonly companyId: string;
  readonly timestamp: string;
  readonly consensusScore: number;
  readonly conflictLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  readonly financialOpinion: AgentOpinionContract;
  readonly operationalOpinion: AgentOpinionContract;
  readonly riskOpinion: AgentOpinionContract;
  readonly commercialOpinion: AgentOpinionContract;
  readonly strategicOpinion: AgentOpinionContract;
  readonly finalCouncilRecommendation: string;
  readonly votingSummary: {
    readonly approveVotes: number;
    readonly approveWithReservationsVotes: number;
    readonly rejectVotes: number;
  };
  readonly unanimousAgreement: boolean;
}
