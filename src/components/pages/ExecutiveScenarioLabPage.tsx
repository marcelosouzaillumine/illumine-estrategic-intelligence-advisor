import React from 'react';
import { PageHeader } from '../Common';
import { FlaskConical } from 'lucide-react';
import { ScenarioSimulationProvider } from '../../context/scenario-simulation/ScenarioSimulationProvider';
import { ScenarioSimulationPanel } from '../scenario-simulation/ScenarioSimulationPanel';
import { ExecutiveScenarioNavigator } from '../scenario-simulation/ExecutiveScenarioNavigator';
import { GovernanceProjectionTimeline } from '../scenario-simulation/GovernanceProjectionTimeline';
import { GovernanceForecastSurface } from '../scenario-simulation/GovernanceForecastSurface';
import { StrategicStressMap } from '../scenario-simulation/StrategicStressMap';
import { SimulationConfidenceCard } from '../scenario-simulation/SimulationConfidenceCard';
import { SimulationLineageViewer } from '../scenario-simulation/SimulationLineageViewer';

export function ExecutiveScenarioLabPage() {
  return (
    <ScenarioSimulationProvider>
      <div className="space-y-6">
        <PageHeader 
          title="Executive Scenario Lab" 
          subtitle="Simulação contrafactual e projeções executivas" 
          icon={<FlaskConical size={24} className="text-primary" />} 
        />
        
        <div className="grid grid-cols-1 gap-6">
          {/* Seletor do Cenário de Base */}
          <ScenarioSimulationPanel />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Esquerda: Decisões de Sandbox e Linha do Tempo de Projeção */}
            <div className="lg:col-span-2 space-y-6">
              <ExecutiveScenarioNavigator />
              <GovernanceProjectionTimeline />
            </div>

            {/* Direita: Diagnóstico e Linha de Auditoria */}
            <div className="space-y-6">
              <GovernanceForecastSurface />
              <StrategicStressMap />
              <SimulationLineageViewer />
            </div>
          </div>

          {/* Limitações Fiduciárias e Transparência */}
          <SimulationConfidenceCard />
        </div>
      </div>
    </ScenarioSimulationProvider>
  );
}

