import { useState, useEffect } from 'react';
import { InvestigationLink } from '../../../../../types/investigation/InvestigationLink';
import { InvestigationLinkFactory } from '../../../../../core/investigation/InvestigationLinkFactory';

export function useInvestigationLink(tenantId: string, nodeId: string, originSurface: string): InvestigationLink | null {
  const [link, setLink] = useState<InvestigationLink | null>(null);

  useEffect(() => {
    let active = true;

    async function load() {
      if (!nodeId || !tenantId) return;
      try {
        const generatedLink = await InvestigationLinkFactory.createFromNodeId(tenantId, nodeId, originSurface);
        if (active && generatedLink) {
          setLink(generatedLink);
        }
      } catch (err) {
        // Fail-closed na ausência do nó
        if (active) setLink(null);
      }
    }

    load();

    return () => {
      active = false;
    };
  }, [tenantId, nodeId, originSurface]);

  return link;
}
