import { useState, useEffect, useMemo } from 'react';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { GovernanceDomainViewModel, GovernanceRule, RiskItem } from '../../viewmodels/GovernanceDomainViewModel';

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

    const qRules = query(collection(db, 'governance_rules'), where('clientId', '==', selectedClient));
    const unsubscribeRules = onSnapshot(qRules, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() as any }));
      setRules(docs);
    });

    const qRisks = query(collection(db, 'governance_risks'), where('clientId', '==', selectedClient));
    const unsubscribeRisks = onSnapshot(qRisks, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() as any }));
      setRisks(docs);
      setLoading(false);
    });

    return () => {
      unsubscribeRules();
      unsubscribeRisks();
    };
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
