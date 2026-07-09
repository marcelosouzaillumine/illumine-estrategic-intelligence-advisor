import { useState, useEffect } from 'react';
import { FirestoreCashFlowAdapter } from '../persistence/FirestoreCashFlowAdapter';


export function useAnaliseFinanceiraPageAdapter(selectedClient: string) {
  const [cashFlowData, setCashFlowData] = useState<any[]>([]);
  const [loadingCashFlow, setLoadingCashFlow] = useState(false);

  useEffect(() => {
    async function fetchCashFlow() {
      if (!selectedClient) return;
      setLoadingCashFlow(true);
      try {
        const cashFlows = await FirestoreCashFlowAdapter.getAllCashFlowsByClient(selectedClient);
        setCashFlowData(cashFlows);
      } catch (err) {
        console.error('Error fetching cash flows in capital intelligence:', err);
      } finally {
        setLoadingCashFlow(false);
      }
    }
    fetchCashFlow();
  }, [selectedClient]);

  return {
    cashFlowData,
    loadingCashFlow,
  };
}
