import { useState, useEffect } from 'react';
import { FirestoreAssetsAdapter } from '../../../../../adapters/persistence/FirestoreAssetsAdapter';


export function useAssetManagementPageAdapter(clientId: string) {
  const [assets, setAssets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!clientId) return;
    setLoading(true);
    const unsubscribe = FirestoreAssetsAdapter.listenToAssetsByClient(clientId, (docs) => {
      setAssets(docs);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [clientId]);

  return {
    assets,
    loading
  };
}
