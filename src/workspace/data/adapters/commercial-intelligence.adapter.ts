import { useState, useEffect } from 'react';
import { ExecutiveContext } from '../../context/executive-context.types';
import { ProviderFactory } from '../factory/provider.factory';
import { 
  CommercialPerformanceData, 
  PipelineIntelligenceData, 
  CustomerIntelligenceData, 
  MarketOpportunityData, 
  CommercialExecutiveSummaryData,
  CommercialHealthScore
} from '../types/commercial-intelligence.types';

export function useCommercialPerformance(context: ExecutiveContext) {
  const [data, setData] = useState<CommercialPerformanceData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const provider = ProviderFactory.getCommercialProvider();
    provider.getPerformance(context).then(res => {
      setData(res);
      setLoading(false);
    });
  }, [context]);

  return { data, loading };
}

export function usePipelineIntelligence(context: ExecutiveContext) {
  const [data, setData] = useState<PipelineIntelligenceData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const provider = ProviderFactory.getCommercialProvider();
    provider.getPipelineIntelligence(context).then(res => {
      setData(res);
      setLoading(false);
    });
  }, [context]);

  return { data, loading };
}

export function useCustomerIntelligence(context: ExecutiveContext) {
  const [data, setData] = useState<CustomerIntelligenceData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const provider = ProviderFactory.getCommercialProvider();
    provider.getCustomerIntelligence(context).then(res => {
      setData(res);
      setLoading(false);
    });
  }, [context]);

  return { data, loading };
}

export function useMarketOpportunities(context: ExecutiveContext) {
  const [data, setData] = useState<MarketOpportunityData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const provider = ProviderFactory.getCommercialProvider();
    provider.getMarketOpportunities(context).then(res => {
      setData(res);
      setLoading(false);
    });
  }, [context]);

  return { data, loading };
}

export function useCommercialExecutiveSummary(context: ExecutiveContext) {
  const [data, setData] = useState<CommercialExecutiveSummaryData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const provider = ProviderFactory.getCommercialProvider();
    provider.getExecutiveSummary(context).then(res => {
      setData(res);
      setLoading(false);
    });
  }, [context]);

  return { data, loading };
}

export function useCommercialHealthScore(context: ExecutiveContext) {
  const [data, setData] = useState<CommercialHealthScore | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const provider = ProviderFactory.getCommercialProvider();
    provider.getHealthScore(context).then(res => {
      setData(res);
      setLoading(false);
    });
  }, [context]);

  return { data, loading };
}
