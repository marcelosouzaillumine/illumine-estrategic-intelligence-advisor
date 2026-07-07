import { useState, useEffect } from 'react';
import { InstitutionalBenchmarkEngine, BenchmarkExecutionRecord } from '../../../../services/FiduciaryRuntimeAdapter';

export function useInstitutionalBenchmarkingViewModel() {
  const [execution, setExecution] = useState<BenchmarkExecutionRecord | null>(null);
  const [sector, setSector] = useState('VAREJO');

  useEffect(() => {
    const result = InstitutionalBenchmarkEngine.runComparativeAnalysis(sector, 'TIER_3_100M_500M');
    setExecution(result);
  }, [sector]);

  return {
    execution,
    sector,
    setSector
  };
}
