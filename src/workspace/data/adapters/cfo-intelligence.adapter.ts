import { useState, useEffect } from 'react';
import { CfoIntelligenceProvider, CfoPerformanceData, CfoCashIntelligenceData, CfoPlanningData, CfoWorkingCapitalData } from '../types/cfo-intelligence.types';
import { ProviderFactory } from '../factory/provider.factory';
import { ExecutiveContext } from '../../context/executive-context.types';
import { resolveProviderForTenant } from '../runtime/intelligence-runtime.config';

function intelligenceProviderFactory(tenantId: string = 'default-tenant'): CfoIntelligenceProvider {
  const providerType = resolveProviderForTenant(tenantId);
  return ProviderFactory.getCfoProvider(providerType === 'firestore' ? 'enterprise' : 'mock');
}

export function useCfoPerformance(context: ExecutiveContext) {
  const [data, setData] = useState<CfoPerformanceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    
    // Dynamically resolve provider based on context (in the future, get tenantId from session)
    const tenantId = (context as any).tenantId || 'default-tenant';
    const cfoProvider = intelligenceProviderFactory(tenantId);

    cfoProvider.getPerformance(context)
      .then(res => {
        if (mounted) {
          setData(res);
          setLoading(false);
        }
      })
      .catch(err => {
        if (mounted) {
          setError(err);
          setLoading(false);
        }
      });
    return () => { mounted = false; };
  }, [context.period.month, context.period.year, context.scenario, context.currency]);

  return { data, loading, error };
}

export function useCfoCashIntelligence(context: ExecutiveContext) {
  const [data, setData] = useState<CfoCashIntelligenceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);

    const tenantId = (context as any).tenantId || 'default-tenant';
    const cfoProvider = intelligenceProviderFactory(tenantId);

    cfoProvider.getCashIntelligence(context)
      .then(res => {
        if (mounted) {
          setData(res);
          setLoading(false);
        }
      })
      .catch(err => {
        if (mounted) {
          setError(err);
          setLoading(false);
        }
      });
    return () => { mounted = false; };
  }, [context.period.month, context.period.year, context.scenario, context.currency]);

  return { data, loading, error };
}

export function useCfoPlanning(context: ExecutiveContext) {
  const [data, setData] = useState<CfoPlanningData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);

    const tenantId = (context as any).tenantId || 'default-tenant';
    const cfoProvider = intelligenceProviderFactory(tenantId);

    cfoProvider.getPlanning(context)
      .then(res => {
        if (mounted) {
          setData(res);
          setLoading(false);
        }
      })
      .catch(err => {
        if (mounted) {
          setError(err);
          setLoading(false);
        }
      });
    return () => { mounted = false; };
  }, [context.period.month, context.period.year, context.scenario, context.currency]);

  return { data, loading, error };
}

export function useCfoWorkingCapital(context: ExecutiveContext) {
  const [data, setData] = useState<CfoWorkingCapitalData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);

    const tenantId = (context as any).tenantId || 'default-tenant';
    const cfoProvider = intelligenceProviderFactory(tenantId);

    cfoProvider.getWorkingCapital(context)
      .then(res => {
        if (mounted) {
          setData(res);
          setLoading(false);
        }
      })
      .catch(err => {
        if (mounted) {
          setError(err);
          setLoading(false);
        }
      });
    return () => { mounted = false; };
  }, [context.period.month, context.period.year, context.scenario, context.currency]);

  return { data, loading, error };
}
