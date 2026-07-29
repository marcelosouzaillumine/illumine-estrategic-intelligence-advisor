import { useState } from 'react';

export function useClientExecutiveWorkspaceViewModel(props?: any) {
  const [workspaceName] = useState<string>('Portal Executivo do Cliente');
  const [activeTenantId] = useState<string>('tnt-globex');

  return {
    state: { workspaceName, activeTenantId },
    computed: {},
    actions: {}
  };
}
