import { useState, useEffect } from 'react';
import { CeoStrategicPerformanceData, CeoGrowthData, CeoRiskOverviewData, CeoExecutiveSummaryData } from '../types/ceo-intelligence.types';
import { ProviderFactory } from '../factory/provider.factory';
import { ExecutiveContext } from '../../context/executive-context.types';

export function useCeoStrategicPerformance(context: ExecutiveContext) {
  const [data, setData] = useState<CeoStrategicPerformanceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    const provider = ProviderFactory.getCeoProvider('mock'); // Hardcoded mock for now
    provider.getStrategicPerformance(context)
      .then(res => { if (mounted) { setData(res); setLoading(false); } })
      .catch(err => { if (mounted) { setError(err); setLoading(false); } });
    return () => { mounted = false; };
  }, [context.period.month, context.period.year, context.scenario, context.currency]);

  return { data, loading, error };
}

export function useCeoGrowthIntelligence(context: ExecutiveContext) {
  const [data, setData] = useState<CeoGrowthData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    const provider = ProviderFactory.getCeoProvider('mock');
    provider.getGrowthIntelligence(context)
      .then(res => { if (mounted) { setData(res); setLoading(false); } })
      .catch(err => { if (mounted) { setError(err); setLoading(false); } });
    return () => { mounted = false; };
  }, [context.period.month, context.period.year, context.scenario, context.currency]);

  return { data, loading, error };
}

export function useCeoRiskOverview(context: ExecutiveContext) {
  const [data, setData] = useState<CeoRiskOverviewData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    const provider = ProviderFactory.getCeoProvider('mock');
    provider.getRiskOverview(context)
      .then(res => { if (mounted) { setData(res); setLoading(false); } })
      .catch(err => { if (mounted) { setError(err); setLoading(false); } });
    return () => { mounted = false; };
  }, [context.period.month, context.period.year, context.scenario, context.currency]);

  return { data, loading, error };
}

export function useCeoExecutiveSummary(context: ExecutiveContext) {
  const [data, setData] = useState<CeoExecutiveSummaryData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    const provider = ProviderFactory.getCeoProvider('mock');
    provider.getExecutiveSummary(context)
      .then(res => { if (mounted) { setData(res); setLoading(false); } })
      .catch(err => { if (mounted) { setError(err); setLoading(false); } });
    return () => { mounted = false; };
  }, [context.period.month, context.period.year, context.scenario, context.currency]);

  return { data, loading, error };
}
