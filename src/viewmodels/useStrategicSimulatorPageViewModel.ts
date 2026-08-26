import { useState } from 'react';
import { useStrategicSimulatorPageAdapter } from '../adapters/ui/useStrategicSimulatorPageAdapter.ts';
import { InstitutionalDecisionOS } from '../../packages/intelligence/executive-intelligence-layer/src/orchestration/InstitutionalDecisionOS';
import { DashboardStateBuilder } from '../../packages/intelligence/executive-intelligence-layer/src/presentation/DashboardStateBuilder';

export function useStrategicSimulatorPageViewModel({ clientId }: any) {
  const { simulatorData, loading } = useStrategicSimulatorPageAdapter(clientId);
  const [activeTab, setActiveTab] = useState('strategicsimulator');

  const capability: any = {
    status: 'UNAVAILABLE',
    reason: 'INDICATORS_DATA_SOURCE_NOT_MIGRATED'
  };

  const boardPackage = InstitutionalDecisionOS.runSession(
    { 
      id: 'q-sim', 
      text: 'Avaliação de Cenários', 
      questionType: 'UNKNOWN', 
      askedBy: 'System', 
      askedAt: new Date(),
      decisionContext: { currentState: 'Sessão Automática', constraints: [], strategicMoment: 'N/A' },
      businessProblem: 'N/A', decisionToEnable: 'N/A', strategicHypothesis: 'N/A', financialImpact: 'N/A',
      timeHorizon: 'N/A', decisionMaker: 'System', decisionCriteria: [], successDefinition: 'N/A',
      nonNegotiables: [], stakeholders: []
    },
    { assets: 1000000, liabilities: 500000, equity: 500000, liquidity: 1.5, ebitda: 0, revenue: 0 }
  );
  
  const presentationModel = DashboardStateBuilder.buildFromBoardPackage(boardPackage);

  return {
    state: { capability, simulatorData, loading, activeTab, presentationModel },
    computed: { simulatedEbitdaMarginPct: 22.4 },
    actions: { setActiveTab }
  };
}
