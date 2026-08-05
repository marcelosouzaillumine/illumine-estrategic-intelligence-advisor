import { useState, useEffect } from 'react';
import { ExecutiveContext } from '../../context/executive-context.types';
import { ProviderFactory } from '../factory/provider.factory';
import { 
  ExecutiveGovernanceHealthScore, 
  StrategicAlignmentData, 
  DecisionGovernanceData, 
  BoardIntelligenceData, 
  GovernanceMaturityData, 
  GovernanceExecutiveSummaryData 
} from '../types/governance-intelligence.types';

export function useGovernanceHealthScore(context: ExecutiveContext) {
  const [data, setData] = useState<ExecutiveGovernanceHealthScore | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      const result = await ProviderFactory.getGovernanceProvider().getHealthScore(context);
      setData(result);
      setLoading(false);
    };
    fetch();
  }, [context]);

  return { data, loading };
}

export function useStrategicAlignment(context: ExecutiveContext) {
  const [data, setData] = useState<StrategicAlignmentData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      const result = await ProviderFactory.getGovernanceProvider().getStrategicAlignment(context);
      setData(result);
      setLoading(false);
    };
    fetch();
  }, [context]);

  return { data, loading };
}

export function useDecisionGovernance(context: ExecutiveContext) {
  const [data, setData] = useState<DecisionGovernanceData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      const result = await ProviderFactory.getGovernanceProvider().getDecisionGovernance(context);
      setData(result);
      setLoading(false);
    };
    fetch();
  }, [context]);

  return { data, loading };
}

export function useBoardIntelligence(context: ExecutiveContext) {
  const [data, setData] = useState<BoardIntelligenceData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      const result = await ProviderFactory.getGovernanceProvider().getBoardIntelligence(context);
      setData(result);
      setLoading(false);
    };
    fetch();
  }, [context]);

  return { data, loading };
}

export function useGovernanceMaturity(context: ExecutiveContext) {
  const [data, setData] = useState<GovernanceMaturityData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      const result = await ProviderFactory.getGovernanceProvider().getGovernanceMaturity(context);
      setData(result);
      setLoading(false);
    };
    fetch();
  }, [context]);

  return { data, loading };
}

export function useGovernanceExecutiveSummary(context: ExecutiveContext) {
  const [data, setData] = useState<GovernanceExecutiveSummaryData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      const result = await ProviderFactory.getGovernanceProvider().getExecutiveSummary(context);
      setData(result);
      setLoading(false);
    };
    fetch();
  }, [context]);

  return { data, loading };
}
