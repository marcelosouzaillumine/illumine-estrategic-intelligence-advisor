import { useState } from 'react';
import { useInstitutionalBenchmarkingAdapter } from '../../../adapters/ui/useInstitutionalBenchmarkingAdapter.ts';

export function useInstitutionalBenchmarkingViewModel({ clientId }: any) {
  const { benchmarkData, loading } = useInstitutionalBenchmarkingAdapter(clientId);
  const [activeTab, setActiveTab] = useState('overview');

  return {
    state: {
      benchmarkData,
      loading,
      activeTab
    },
    computed: {
      marketAdherencePct: 86.4
    },
    actions: {
      setActiveTab
    }
  };
}
