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
import { useLanguage } from '../../contexts/LanguageContext';

export function ExecutiveScenarioLabPage() {
  const { t } = useLanguage();
  return (
    <ScenarioSimulationProvider>
      <div className="max-w-[1440px] mx-auto px-6 lg:px-10 space-y-12 pb-32 animate-executive-fade">
        <PageHeader 
          title={t('scenario.title')} 
          subtitle={t('scenario.subtitle')} 
          icon={FlaskConical} 
          transparent
        />
        
        <div className="space-y-8">
          {/* Seletor do Cenário de Base */}
          <ScenarioSimulationPanel />

          {/* Grid Principal: Sandbox e Linha do tempo (Esquerda) vs Confiança e Trilha (Direita) */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Esquerda: Decisões de Sandbox e Linha do Tempo de Projeção */}
            <div className="lg:col-span-2 space-y-8">
              <ExecutiveScenarioNavigator />
              <GovernanceProjectionTimeline />
            </div>

            {/* Direita: Diagnóstico de Confiança e Linha de Auditoria */}
            <div className="space-y-8">
              <SimulationConfidenceCard />
              <SimulationLineageViewer />
            </div>
          </div>

          {/* Diagnóstico de Forecast (100% de largura para dar espaço de leitura premium) */}
          <GovernanceForecastSurface />

          {/* Classificação de Estresse (100% de largura para os 4 níveis brilharem) */}
          <StrategicStressMap />
        </div>
      </div>
    </ScenarioSimulationProvider>
  );
}

