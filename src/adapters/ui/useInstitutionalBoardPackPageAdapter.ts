import { useState } from 'react';

export function useInstitutionalBoardPackPageAdapter(clientId: string) {
  const [loading, setLoading] = useState(false);
  const [boardPackData, setBoardPackData] = useState<any>({});

  return { boardPackData, loading };
}
