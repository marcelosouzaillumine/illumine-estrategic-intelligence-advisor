import { useState, useEffect } from 'react';
import { runInstitutionalAnalysis } from '../runtime';
import { InstitutionalContext, RuntimeOutput } from '../runtime/types';

interface UseInstitutionalRuntimeProps {
  engineType?: string; // Optional: specify a single engine to run, otherwise runs full default sequence
  input: any;
}

export function useInstitutionalRuntime({ engineType, input }: UseInstitutionalRuntimeProps) {
  const [runtimeOutput, setRuntimeOutput] = useState<RuntimeOutput | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function executeRuntime() {
      setLoading(true);
      try {
        const context: InstitutionalContext = {
          input,
          normalizedData: {},
          inferences: {},
          globalConfidence: 'LOW',
          violations: [],
          executedEngines: [],
          executionStatus: 'PENDING'
        };

        const result = await runInstitutionalAnalysis(input as import('../runtime/types').RuntimeInput, engineType);
        
        if (isMounted) {
          setRuntimeOutput(result);
        }
      } catch (error) {
        console.error('Failed to run institutional analysis', error);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    if (input) {
      executeRuntime();
    }

    return () => {
      isMounted = false;
    };
  }, [JSON.stringify(input), engineType]);

  return { runtimeOutput, loading };
}
