import { useState, useMemo } from 'react';
import { OperationalDomainViewModel, OperationalMetric } from '../../../../../viewmodels/OperationalDomainViewModel';

export interface UseOperationalDomainParams {
  clientId: string;
}

export function useOperationalDomain({ clientId }: UseOperationalDomainParams) {
  const [loading, setLoading] = useState(false);
  const [metrics, setMetrics] = useState<OperationalMetric[]>([
    { id: 'op-1', name: 'Eficiência de Compras', value: 94, target: 90, status: 'OPTIMAL' },
    { id: 'op-2', name: 'Giro de Imobilizado', value: 82, target: 85, status: 'WARNING' },
    { id: 'op-3', name: 'Conformidade de Controladoria', value: 98, target: 95, status: 'OPTIMAL' }
  ]);

  const healthIndex = useMemo(() => {
    return OperationalDomainViewModel.calculateHealthIndex(metrics);
  }, [metrics]);

  const summary = useMemo(() => {
    return OperationalDomainViewModel.summarizeAlerts(metrics);
  }, [metrics]);

  return {
    loading,
    metrics,
    healthIndex,
    summary
  };
}
