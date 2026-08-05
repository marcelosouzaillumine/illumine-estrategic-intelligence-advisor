export interface ProposalActor {
  actorType: 'ILLUMINE_USER' | 'ADVISOR' | 'PARTNER' | 'CUSTOMER' | 'SYSTEM';
  actorId: string;
}
