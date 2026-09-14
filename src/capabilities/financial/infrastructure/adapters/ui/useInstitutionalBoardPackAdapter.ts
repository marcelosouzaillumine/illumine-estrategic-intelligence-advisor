import { useState } from 'react';

export function useInstitutionalBoardPackAdapter(clientId: string) {
  const [loading, setLoading] = useState(false);
  const [boardPacks, setBoardPacks] = useState<any[]>([]);

  return {
    boardPacks,
    loading
  };
}
