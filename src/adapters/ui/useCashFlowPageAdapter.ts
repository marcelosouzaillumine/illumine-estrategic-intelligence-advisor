import { useState, useEffect } from 'react';
import { FirestoreAuthAdapter } from '../persistence/FirestoreAuthAdapter';
import { persistenceContainer } from '../../infrastructure/container/persistenceContainer';

import { GovernedRepositoryWrapper } from '../../core/security/governed-repository';
import { DataAccessContext } from '../../core/security/data-access-context';
import { FiduciaryRuntimeAdapter, ExecutiveIntelligenceReport } from '../../services/FiduciaryRuntimeAdapter';
import { generateCashFlow } from '../../services/cashFlowService';

export function useCashFlowPageAdapter(selectedClient: string, clients: any[]) {
  const [filterClient, setFilterClient] = useState(selectedClient);
  const [dbFluxo, setDbFluxo] = useState<any>(null);
  const [executiveReport, setExecutiveReport] = useState<ExecutiveIntelligenceReport | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    setFilterClient(selectedClient);
  }, [selectedClient]);

  const buildContext = (action: 'VIEW_FINANCIALS' | 'CREATE_SNAPSHOT' = 'VIEW_FINANCIALS', cleanId: string): DataAccessContext => {
    const currentUserId = FirestoreAuthAdapter.getCurrentUserId() || 'guest';
    return {
      actorId: currentUserId,
      tenantId: cleanId, // legacyTenantId
      role: 'CFO', // Mock
      permissions: ['VIEW_FINANCIALS', 'CREATE_SNAPSHOT'],
      entityScope: {
        tenantId: cleanId,
        requestedEntityScope: 'ENTITY',
        entityId: cleanId,
        allowedEntityIds: [cleanId],
        allowedGroupIds: [],
        consolidatedScope: false
      },
      requestedAction: action,
      resourceType: 'CashFlow',
      resourceTenantId: cleanId,
      visibilityPolicy: 'INTERNAL',
      auditRequirement: action === 'CREATE_SNAPSHOT'
    };
  };

  const refreshData = async () => {
    if (!filterClient) {
      setDbFluxo(null);
      return;
    }
    const cleanId = filterClient.trim();
    const currentUserId = FirestoreAuthAdapter.getCurrentUserId() || 'guest';
    
    const context = buildContext('VIEW_FINANCIALS', cleanId);

    try {
      const cashFlows = await GovernedRepositoryWrapper.execute(context, async () => await persistenceContainer.cashFlow.getCashFlowsByClient(cleanId));
      if (cashFlows && cashFlows.length > 0) {
        const data = cashFlows[0];
        setDbFluxo(data);
        const clientObj = clients?.find((c: any) => c.id === cleanId);
        const input = {
          clientProfile: clientObj,
          cashFlowData: [data],
          rawFinancialData: { segmentoEmpresa: clientObj?.segmento || 'Default' },
          historicalCyclesCount: 1,
          isMockData: false
        };
        const report = FiduciaryRuntimeAdapter.generateExecutiveReport(input);
        setExecutiveReport(report);
      } else {
        setDbFluxo(null);
        setExecutiveReport(null);
      }
    } catch (err) {
      console.error('Error refreshing data:', err);
    }
  };

  useEffect(() => {
    refreshData();
  }, [filterClient]);

  const handleGenerate = async () => {
    if (!filterClient) return;
    setIsGenerating(true);
    const cleanId = filterClient.trim();
    const context = buildContext('CREATE_SNAPSHOT', cleanId);
    try {
      const data = await generateCashFlow(context, cleanId);
      await refreshData();
      alert(`Fluxo de caixa gerado com sucesso! (${data.Fluxo_Diario.length} dias projetados)`);
    } catch (error: any) {
      console.error('Erro ao gerar fluxo:', error);
      alert('Erro ao gerar fluxo de caixa: ' + (error.message || error));
    } finally {
      setIsGenerating(false);
    }
  };

  return {
    filterClient,
    setFilterClient,
    dbFluxo,
    executiveReport,
    isGenerating,
    handleGenerate,
  };
}
