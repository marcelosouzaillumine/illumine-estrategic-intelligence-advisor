import { useState, useEffect } from 'react';
import { ExecutiveContext } from '../../context/executive-context.types';
import { ProviderFactory } from '../factory/provider.factory';
import { 
  ExecutiveRiskHealthScore, 
  EnterpriseRiskOverviewData,
  RiskAppetiteData,
  ComplianceIntelligenceData, 
  ControlEffectivenessData, 
  AuditIntelligenceData, 
  EnterpriseResilienceData, 
  RiskExecutiveSummaryData 
} from '../types/risk-intelligence.types';

export function useRiskHealthScore(context: ExecutiveContext) {
  const [data, setData] = useState<ExecutiveRiskHealthScore | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      const result = await ProviderFactory.getRiskProvider().getHealthScore(context);
      setData(result);
      setLoading(false);
    };
    fetch();
  }, [context]);

  return { data, loading };
}

export function useRiskAppetite(context: ExecutiveContext) {
  const [data, setData] = useState<RiskAppetiteData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      const result = await ProviderFactory.getRiskProvider().getRiskAppetite(context);
      setData(result);
      setLoading(false);
    };
    fetch();
  }, [context]);

  return { data, loading };
}

export function useEnterpriseRiskOverview(context: ExecutiveContext) {
  const [data, setData] = useState<EnterpriseRiskOverviewData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      const result = await ProviderFactory.getRiskProvider().getEnterpriseRiskOverview(context);
      setData(result);
      setLoading(false);
    };
    fetch();
  }, [context]);

  return { data, loading };
}

export function useComplianceIntelligence(context: ExecutiveContext) {
  const [data, setData] = useState<ComplianceIntelligenceData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      const result = await ProviderFactory.getRiskProvider().getComplianceIntelligence(context);
      setData(result);
      setLoading(false);
    };
    fetch();
  }, [context]);

  return { data, loading };
}

export function useControlEffectiveness(context: ExecutiveContext) {
  const [data, setData] = useState<ControlEffectivenessData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      const result = await ProviderFactory.getRiskProvider().getControlEffectiveness(context);
      setData(result);
      setLoading(false);
    };
    fetch();
  }, [context]);

  return { data, loading };
}

export function useAuditIntelligence(context: ExecutiveContext) {
  const [data, setData] = useState<AuditIntelligenceData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      const result = await ProviderFactory.getRiskProvider().getAuditIntelligence(context);
      setData(result);
      setLoading(false);
    };
    fetch();
  }, [context]);

  return { data, loading };
}

export function useEnterpriseResilience(context: ExecutiveContext) {
  const [data, setData] = useState<EnterpriseResilienceData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      const result = await ProviderFactory.getRiskProvider().getEnterpriseResilience(context);
      setData(result);
      setLoading(false);
    };
    fetch();
  }, [context]);

  return { data, loading };
}

export function useRiskExecutiveSummary(context: ExecutiveContext) {
  const [data, setData] = useState<RiskExecutiveSummaryData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      const result = await ProviderFactory.getRiskProvider().getExecutiveSummary(context);
      setData(result);
      setLoading(false);
    };
    fetch();
  }, [context]);

  return { data, loading };
}
