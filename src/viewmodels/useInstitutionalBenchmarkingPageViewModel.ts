import { useState } from 'react';
import { useInstitutionalBenchmarkingPageAdapter } from '../adapters/ui/useInstitutionalBenchmarkingPageAdapter.ts';

export function useInstitutionalBenchmarkingPageViewModel({ clientId }: any) {
  const { benchmarkingData, loading } = useInstitutionalBenchmarkingPageAdapter(clientId);
  const [activeTab, setActiveTab] = useState('benchmarking');

  return {
    state: { benchmarkingData, loading, activeTab },
    computed: { industryPercentileRank: 88.5 },
    actions: { setActiveTab }
  };
}
