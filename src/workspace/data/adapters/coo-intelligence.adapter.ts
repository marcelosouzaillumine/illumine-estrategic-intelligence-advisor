import { useState, useEffect } from 'react';
import { ExecutiveContext } from '../../context/executive-context.types';
import { ProviderFactory } from '../factory/provider.factory';
import { 
  ExecutiveOperationalHealthScore, 
  ProcessExecutionData, 
  LogisticsSupplyChainData, 
  ProcurementIntelligenceData, 
  OperationalExcellenceData, 
  OperationalExecutiveSummaryData 
} from '../types/operational-intelligence.types';

export function useOperationalHealthScore(context: ExecutiveContext) {
  const [data, setData] = useState<ExecutiveOperationalHealthScore | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true);
        const provider = ProviderFactory.getCooProvider('mock');
        const result = await provider.getHealthScore(context);
        setData(result);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [context]);

  return { data, loading, error };
}

export function useProcessExecution(context: ExecutiveContext) {
  const [data, setData] = useState<ProcessExecutionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true);
        const provider = ProviderFactory.getCooProvider('mock');
        const result = await provider.getProcessExecution(context);
        setData(result);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [context]);

  return { data, loading, error };
}

export function useLogisticsSupplyChain(context: ExecutiveContext) {
  const [data, setData] = useState<LogisticsSupplyChainData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true);
        const provider = ProviderFactory.getCooProvider('mock');
        const result = await provider.getLogisticsSupplyChain(context);
        setData(result);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [context]);

  return { data, loading, error };
}

export function useProcurementIntelligence(context: ExecutiveContext) {
  const [data, setData] = useState<ProcurementIntelligenceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true);
        const provider = ProviderFactory.getCooProvider('mock');
        const result = await provider.getProcurementIntelligence(context);
        setData(result);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [context]);

  return { data, loading, error };
}

export function useOperationalExcellence(context: ExecutiveContext) {
  const [data, setData] = useState<OperationalExcellenceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true);
        const provider = ProviderFactory.getCooProvider('mock');
        const result = await provider.getOperationalExcellence(context);
        setData(result);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [context]);

  return { data, loading, error };
}

export function useOperationalExecutiveSummary(context: ExecutiveContext) {
  const [data, setData] = useState<OperationalExecutiveSummaryData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true);
        const provider = ProviderFactory.getCooProvider('mock');
        const result = await provider.getExecutiveSummary(context);
        setData(result);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [context]);

  return { data, loading, error };
}
