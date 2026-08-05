import { Proposal, ProposalVersion, ProposalAuditLog, ProposalEventType } from '@domain/revenue';
import { proposalBuilderAdapter } from '../adapters/proposalBuilder.firestore.adapter';

const generateId = () => Math.random().toString(36).substring(2, 15);

export const proposalBuilderService = {
  async loadProposalAndVersion(illumineId: string, proposalId: string): Promise<{ proposal: Proposal | null, version: ProposalVersion | null }> {
    const proposal = await proposalBuilderAdapter.getProposal(illumineId, proposalId);
    if (!proposal) return { proposal: null, version: null };
    return { proposal, version: null };
  },

  async saveDraft(illumineId: string, proposalId: string, version: ProposalVersion, actorId: string): Promise<void> {
    await proposalBuilderAdapter.saveProposalVersion(illumineId, proposalId, version);
    
    const auditLog: ProposalAuditLog = {
      id: generateId(),
      proposalId,
      versionId: version.id,
      eventType: ProposalEventType.ProposalEdited,
      actor: { actorType: 'ILLUMINE_USER', actorId },
      timestamp: new Date().toISOString()
    };
    
    await proposalBuilderAdapter.logAuditEvent(illumineId, proposalId, auditLog);
  }
};
