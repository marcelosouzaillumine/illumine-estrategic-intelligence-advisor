import { useState } from 'react';

export function useConsolidatedGroupAdminAdapter() {
  const [loading, setLoading] = useState(false);
  const [groupEntities, setGroupEntities] = useState<any[]>([]);

  return { groupEntities, loading };
}
