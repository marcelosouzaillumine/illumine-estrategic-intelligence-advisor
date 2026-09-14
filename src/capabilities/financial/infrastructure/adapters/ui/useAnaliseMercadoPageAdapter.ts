import { useState, useEffect } from 'react';
import { FirestoreSystemAssumptionsAdapter } from '../../../../../adapters/persistence/FirestoreSystemAssumptionsAdapter';

import { DATA } from '../../../../../data';

export function useAnaliseMercadoPageAdapter() {
  const [econData, setEconData] = useState<any[]>(DATA.premissas.economicas);

  useEffect(() => {
    return FirestoreSystemAssumptionsAdapter.listenToEconomicPremises(setEconData);
  }, []);

  return {
    econData
  };
}
