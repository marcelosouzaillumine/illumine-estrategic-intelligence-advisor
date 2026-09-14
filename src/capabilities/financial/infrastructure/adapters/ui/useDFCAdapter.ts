import { useState, useMemo } from 'react';
import { useAllFinancialData } from '../../../../../hooks/useFinancialData';
import { FiduciaryRuntimeAdapter } from '../../../../../services/FiduciaryRuntimeAdapter';

export function useDFCAdapter(clientId: string) {
  const { dbData: allHistoryData, loading: loadingHistory, refetch: refetchHistory } = useAllFinancialData(clientId);

  return {
    allHistoryData,
    loadingHistory,
    refetchHistory
  };
}
