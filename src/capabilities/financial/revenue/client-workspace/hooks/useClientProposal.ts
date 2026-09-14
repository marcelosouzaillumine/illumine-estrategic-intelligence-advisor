import { useState, useEffect } from 'react';
import { useClientWorkspaceSession } from '../../../../../features/revenue/client-workspace/auth/useClientWorkspaceSession';
import { clientWorkspaceService, ClientWorkspaceViewModel } from '../../../../../features/revenue/client-workspace/services/clientWorkspace.service';

export const useClientProposal = (illumineId: string = 'illumine') => {
  const { session } = useClientWorkspaceSession();
  const [viewModel, setViewModel] = useState<ClientWorkspaceViewModel | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    const fetchProposal = async () => {
      if (!session) return;
      
      try {
        setLoading(true);
        setError(null);
        const data = await clientWorkspaceService.loadWorkspaceContext(illumineId, session);
        
        if (!isMounted) return;

        if (data) {
          setViewModel(data);
        } else {
          setError('Proposal is not available or has been revoked.');
        }
      } catch (err) {
        if (isMounted) {
          setError('Failed to load the secure workspace.');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchProposal();
    return () => { isMounted = false; };
  }, [session, illumineId]);

  return { viewModel, loading, error };
};
