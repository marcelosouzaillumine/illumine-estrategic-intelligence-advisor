import { useState, useEffect } from 'react';
import { ExecutiveContext } from '../../context/executive-context.types';
import { ProviderFactory } from '../factory/provider.factory';
import { 
  ExecutiveInnovationHealthScore, 
  InnovationPortfolioData,
  OpportunityIntelligenceData,
  ExperimentManagementData, 
  DigitalTransformationData, 
  KnowledgeEvolutionData, 
  InnovationExecutiveSummaryData 
} from '../types/innovation-intelligence.types';

export function useInnovationHealthScore(context: ExecutiveContext) {
  const [data, setData] = useState<ExecutiveInnovationHealthScore | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      const result = await ProviderFactory.getInnovationProvider().getHealthScore(context);
      setData(result);
      setLoading(false);
    };
    fetch();
  }, [context]);

  return { data, loading };
}

export function useInnovationPortfolio(context: ExecutiveContext) {
  const [data, setData] = useState<InnovationPortfolioData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      const result = await ProviderFactory.getInnovationProvider().getPortfolio(context);
      setData(result);
      setLoading(false);
    };
    fetch();
  }, [context]);

  return { data, loading };
}

export function useOpportunityIntelligence(context: ExecutiveContext) {
  const [data, setData] = useState<OpportunityIntelligenceData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      const result = await ProviderFactory.getInnovationProvider().getOpportunityIntelligence(context);
      setData(result);
      setLoading(false);
    };
    fetch();
  }, [context]);

  return { data, loading };
}

export function useExperimentManagement(context: ExecutiveContext) {
  const [data, setData] = useState<ExperimentManagementData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      const result = await ProviderFactory.getInnovationProvider().getExperimentManagement(context);
      setData(result);
      setLoading(false);
    };
    fetch();
  }, [context]);

  return { data, loading };
}

export function useDigitalTransformation(context: ExecutiveContext) {
  const [data, setData] = useState<DigitalTransformationData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      const result = await ProviderFactory.getInnovationProvider().getDigitalTransformation(context);
      setData(result);
      setLoading(false);
    };
    fetch();
  }, [context]);

  return { data, loading };
}

export function useKnowledgeEvolution(context: ExecutiveContext) {
  const [data, setData] = useState<KnowledgeEvolutionData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      const result = await ProviderFactory.getInnovationProvider().getKnowledgeEvolution(context);
      setData(result);
      setLoading(false);
    };
    fetch();
  }, [context]);

  return { data, loading };
}

export function useInnovationExecutiveSummary(context: ExecutiveContext) {
  const [data, setData] = useState<InnovationExecutiveSummaryData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      const result = await ProviderFactory.getInnovationProvider().getExecutiveSummary(context);
      setData(result);
      setLoading(false);
    };
    fetch();
  }, [context]);

  return { data, loading };
}
