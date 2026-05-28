import React from 'react';
import { PageHeader } from '../Common';
import { FlaskConical } from 'lucide-react';
import { ScenarioSimulationProvider } from '../../context/scenario-simulation/ScenarioSimulationProvider';
import { ScenarioSimulationPanel } from '../scenario-simulation/ScenarioSimulationPanel';
import { GovernanceForecastSurface } from '../scenario-simulation/GovernanceForecastSurface';
import { StrategicStressMap } from '../scenario-simulation/StrategicStressMap';
import { GovernanceProjectionTimeline } from '../scenario-simulation/GovernanceProjectionTimeline';
import { PropagationTimelineViewer } from '../scenario-simulation/PropagationTimelineViewer';
import { MultiEntityContagionSurface } from '../scenario-simulation/MultiEntityContagionSurface';
import { SimulationConfidenceCard } from '../scenario-simulation/SimulationConfidenceCard';
import { HistoricalBasisExplorer } from '../scenario-simulation/HistoricalBasisExplorer';
import { SimulationLineageViewer } from '../scenario-simulation/SimulationLineageViewer';
import { ForecastDependencyPanel } from '../scenario-simulation/ForecastDependencyPanel';

export function ScenarioLabPage() {
  return (
    <ScenarioSimulationProvider>
      <div className="space-y-6">
        <PageHeader 
          title="Laboratório de Cenários Preditivos" 
          subtitle="Simulação contrafactual e testes de estresse (Sandbox)" 
          icon={<FlaskConical size={24} className="text-primary" />} 
        />
        
        <div className="grid grid-cols-1 gap-6">
          {/* Painel Central de Seleção */}
          <ScenarioSimulationPanel />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Esquerda: Previsões e Mapa de Estresse */}
            <div className="lg:col-span-2 space-y-6">
              <GovernanceForecastSurface />
              <StrategicStressMap />
              <GovernanceProjectionTimeline />
            </div>

            {/* Direita: Dependências e Auditoria */}
            <div className="space-y-6">
              <ForecastDependencyPanel />
              <SimulationLineageViewer />
            </div>
          </div>

          {/* Seção de Contágio Multi-Entidade */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <MultiEntityContagionSurface />
            <PropagationTimelineViewer />
          </div>

          {/* Histórico e Transparência */}
          <HistoricalBasisExplorer />
          <SimulationConfidenceCard />
        </div>
      </div>
    </ScenarioSimulationProvider>
  );
}

