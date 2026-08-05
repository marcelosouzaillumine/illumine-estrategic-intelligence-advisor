import { db } from '../../../../lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { Proposal, ProposalVersion, ProposalAuditLog } from '@domain/revenue';

export const proposalBuilderAdapter = {
  async getProposal(illumineId: string, proposalId: string): Promise<Proposal | null> {
    const docRef = doc(db, `revenue_platform/${illumineId}/proposals`, proposalId);
    const snap = await getDoc(docRef);
    if (!snap.exists()) return null;
    return snap.data() as Proposal;
  },

  async saveProposalVersion(illumineId: string, proposalId: string, version: ProposalVersion): Promise<void> {
    const versionRef = doc(db, `revenue_platform/${illumineId}/proposals/${proposalId}/versions`, version.id);
    await setDoc(versionRef, version);
  },

  async logAuditEvent(illumineId: string, proposalId: string, auditLog: ProposalAuditLog): Promise<void> {
    const logRef = doc(db, `revenue_platform/${illumineId}/proposals/${proposalId}/audit_logs`, auditLog.id);
    await setDoc(logRef, auditLog);
  }
};
