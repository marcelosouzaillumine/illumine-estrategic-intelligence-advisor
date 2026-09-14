import { useState, useCallback } from 'react';
import { Proposal, ProposalVersion, ProposalStatus } from '@domain/revenue';

export const useProposalBuilder = (initialProposalId?: string) => {
  const [proposal, setProposal] = useState<Proposal | null>(null);
  const [currentVersion, setCurrentVersion] = useState<ProposalVersion | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const saveDraft = useCallback(async () => {
    setIsSaving(true);
    // Call service to persist to Firestore
    setIsSaving(false);
  }, [currentVersion]);

  const submitForReview = useCallback(async () => {
    // Transition status to InternalReview
  }, []);

  return {
    proposal,
    currentVersion,
    isSaving,
    saveDraft,
    submitForReview
  };
};
