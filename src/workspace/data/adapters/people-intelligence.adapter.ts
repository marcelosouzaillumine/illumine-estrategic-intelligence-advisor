import { useState, useEffect } from 'react';
import { ExecutiveContext } from '../../context/executive-context.types';
import { ProviderFactory } from '../factory/provider.factory';
import { 
  ExecutivePeopleHealthScore, 
  WorkforceIntelligenceData, 
  OrganizationalCultureData, 
  LeadershipIntelligenceData, 
  PeopleFinancialImpactData, 
  CapabilityDevelopmentData, 
  OrganizationalIntelligenceData, 
  WorkforceCapacityData, 
  PeopleExecutiveSummaryData 
} from '../types/people-intelligence.types';

export function usePeopleHealthScore(context: ExecutiveContext) {
  const [data, setData] = useState<ExecutivePeopleHealthScore | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      const result = await ProviderFactory.getPeopleProvider().getHealthScore(context);
      setData(result);
      setLoading(false);
    };
    fetch();
  }, [context]);

  return { data, loading };
}

export function useWorkforceIntelligence(context: ExecutiveContext) {
  const [data, setData] = useState<WorkforceIntelligenceData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      const result = await ProviderFactory.getPeopleProvider().getWorkforceIntelligence(context);
      setData(result);
      setLoading(false);
    };
    fetch();
  }, [context]);

  return { data, loading };
}

export function useOrganizationalCulture(context: ExecutiveContext) {
  const [data, setData] = useState<OrganizationalCultureData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      const result = await ProviderFactory.getPeopleProvider().getOrganizationalCulture(context);
      setData(result);
      setLoading(false);
    };
    fetch();
  }, [context]);

  return { data, loading };
}

export function useLeadershipIntelligence(context: ExecutiveContext) {
  const [data, setData] = useState<LeadershipIntelligenceData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      const result = await ProviderFactory.getPeopleProvider().getLeadershipIntelligence(context);
      setData(result);
      setLoading(false);
    };
    fetch();
  }, [context]);

  return { data, loading };
}

export function usePeopleFinancialImpact(context: ExecutiveContext) {
  const [data, setData] = useState<PeopleFinancialImpactData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      const result = await ProviderFactory.getPeopleProvider().getPeopleFinancialImpact(context);
      setData(result);
      setLoading(false);
    };
    fetch();
  }, [context]);

  return { data, loading };
}

export function useCapabilityDevelopment(context: ExecutiveContext) {
  const [data, setData] = useState<CapabilityDevelopmentData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      const result = await ProviderFactory.getPeopleProvider().getCapabilityDevelopment(context);
      setData(result);
      setLoading(false);
    };
    fetch();
  }, [context]);

  return { data, loading };
}

export function useOrganizationalIntelligence(context: ExecutiveContext) {
  const [data, setData] = useState<OrganizationalIntelligenceData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      const result = await ProviderFactory.getPeopleProvider().getOrganizationalIntelligence(context);
      setData(result);
      setLoading(false);
    };
    fetch();
  }, [context]);

  return { data, loading };
}

export function useWorkforceCapacity(context: ExecutiveContext) {
  const [data, setData] = useState<WorkforceCapacityData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      const result = await ProviderFactory.getPeopleProvider().getWorkforceCapacity(context);
      setData(result);
      setLoading(false);
    };
    fetch();
  }, [context]);

  return { data, loading };
}

export function usePeopleExecutiveSummary(context: ExecutiveContext) {
  const [data, setData] = useState<PeopleExecutiveSummaryData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      const result = await ProviderFactory.getPeopleProvider().getExecutiveSummary(context);
      setData(result);
      setLoading(false);
    };
    fetch();
  }, [context]);

  return { data, loading };
}
