import { useState } from 'react';

export function useExecutiveAppBaseAdapter() {
  const [loading, setLoading] = useState(false);
  const [appState, setAppState] = useState<any>({});

  return { appState, loading };
}
