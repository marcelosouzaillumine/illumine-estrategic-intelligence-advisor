import { db } from '../../../../../lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { Proposal, ProposalVersion, ProposalAuditLog } from '@domain/revenue';
import { blockedFirestoreWrite } from '../../../../../lib/blockedFirestoreWrite';

export const clientWorkspaceAdapter = {
  async getPublishedProposalVersion(illumineId: string, proposalId: string, versionId: string): Promise<ProposalVersion | null> {
    const versionRef = doc(db, `revenue_platform/${illumineId}/proposals/${proposalId}/versions`, versionId);
    const snap = await getDoc(versionRef);
    
    if (!snap.exists()) return null;
    
    const version = snap.data() as ProposalVersion;
    
    // Publication Boundary Guard
    // @ts-ignore
    if (version.status !== 'PUBLISHED') {
      return null;
    }
    
    return version;
  },

  async logCustomerAuditEvent(illumineId: string, proposalId: string, auditLog: ProposalAuditLog): Promise<void> {
    const logRef = doc(db, `revenue_platform/${illumineId}/proposals/${proposalId}/audit_logs`, auditLog.id);
    blockedFirestoreWrite(); // setDoc(logRef, auditLog);
  }
};
