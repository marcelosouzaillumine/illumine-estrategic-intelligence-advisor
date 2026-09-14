import { useState } from 'react';

export function useConsolidatedGroupAdapter(clientId: string) {
  const [loading, setLoading] = useState(false);
  const [groupData, setGroupData] = useState<any[]>([]);

  return {
    groupData,
    loading
  };
}
