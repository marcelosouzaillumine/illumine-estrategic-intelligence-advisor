import { useState, useEffect, useMemo } from 'react';

import { GovernanceDomainViewModel, GovernanceRule, RiskItem } from '../../../../../viewmodels/GovernanceDomainViewModel';

export interface UseGovernanceDomainParams {
  selectedClient: string;
}

export function useGovernanceDomain({ selectedClient }: UseGovernanceDomainParams) {
  const [loading, setLoading] = useState(true);
  const [rules, setRules] = useState<GovernanceRule[]>([]);
  const [risks, setRisks] = useState<RiskItem[]>([]);

  useEffect(() => {
    if (!selectedClient) return;
    setLoading(true);

    // TODO(Phase 7): Migrate Governance Rules and Risks to PostgreSQL
    // For Phase 6, we just return empty data and disable the loader.
    setRules([]);
    setRisks([]);
    setLoading(false);
  }, [selectedClient]);

  const maturityScore = useMemo(() => {
    return GovernanceDomainViewModel.calculateMaturityScore(rules);
  }, [rules]);

  const riskSummary = useMemo(() => {
    return GovernanceDomainViewModel.summarizeRisks(risks);
  }, [risks]);

  return {
    loading,
    rules,
    risks,
    maturityScore,
    riskSummary
  };
}
