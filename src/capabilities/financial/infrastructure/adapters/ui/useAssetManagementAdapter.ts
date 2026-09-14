import { useState } from 'react';

export function useAssetManagementAdapter(clientId: string) {
  const [loading, setLoading] = useState(false);
  const [assets, setAssets] = useState<any[]>([]);

  return {
    assets,
    loading
  };
}
