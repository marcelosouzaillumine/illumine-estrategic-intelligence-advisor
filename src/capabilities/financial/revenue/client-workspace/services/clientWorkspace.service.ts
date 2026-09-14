import { ProposalVersion, ProposalAuditLog, ProposalEventType } from '@domain/revenue';
import { SupportedLocale } from '../../../../../core/routing/internationalRoutes';
import { clientWorkspaceAdapter } from '../../../../../features/revenue/client-workspace/adapters/clientWorkspace.firestore.adapter';
import { ClientWorkspaceSession } from '../../../../../features/revenue/client-workspace/services/clientWorkspaceAuth.service';

const generateId = () => Math.random().toString(36).substring(2, 15);

// The safe intermediary model protecting the UI from Domain/Firestore changes
export interface ClientWorkspaceViewModel {
  companyName: string;
  locale: SupportedLocale;
  sections: any[]; // Array of ProposalSectionData mapped for SectionRenderer
  executiveInsights?: any[]; // Prepared for future AI integration
}

export const clientWorkspaceService = {
  
  async loadWorkspaceContext(illumineId: string, session: ClientWorkspaceSession): Promise<ClientWorkspaceViewModel | null> {
    // For now, assuming session contains the current versionId or we fetch the default published one.
    // In a real scenario, the Proposal document tracks `currentPublishedVersionId`.
    const versionId = 'v1'; // Mocking the published version ID resolution
    
    const version = await clientWorkspaceAdapter.getPublishedProposalVersion(illumineId, session.proposalId, versionId);
    
    if (!version) {
      return null; // Proposal not found or not published
    }

    // Register Audit Event for visualization
    await this.registerProposalView(illumineId, session.proposalId, version.id, session.id);

    // Map Domain -> ViewModel mapping to SectionRenderer topology
    return {
      companyName: 'Client Enterprise Inc.',
      locale: session.locale,
      executiveInsights: [],
      sections: [
        // @ts-ignore
        { type: 'WELCOME', payload: version.contentSnapshot.executiveMessage },
        { type: 'CONTEXT', payload: { origin: 'ASSESSMENT' } },
        { type: 'REALITY', payload: version.contentSnapshot.sections.find(s => s.type === 'CHALLENGE') },
        { type: 'SOLUTION', payload: version.contentSnapshot.sections.find(s => s.type === 'SOLUTION') },
        { type: 'JOURNEY', payload: version.implementationPlan },
        { type: 'INVESTMENT', payload: version.pricingSnapshot },
        { type: 'NEXT_STEP', payload: null }
      ]
    };
  },

  async registerProposalView(illumineId: string, proposalId: string, versionId: string, sessionId: string): Promise<void> {
    const auditLog: ProposalAuditLog = {
      id: generateId(),
      proposalId,
      versionId,
      eventType: ProposalEventType.ProposalViewed, // Assuming this enum exists based on domain rules
      actor: { actorType: 'CUSTOMER', actorId: sessionId },
      timestamp: new Date().toISOString()
    };
    
    await clientWorkspaceAdapter.logCustomerAuditEvent(illumineId, proposalId, auditLog);
  }
};
