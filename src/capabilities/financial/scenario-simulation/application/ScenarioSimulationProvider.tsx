import React, { createContext, useContext, useState, useEffect } from 'react';
import { useTenancy } from '../../../../context/TenancyProvider';
import {
  SimulationScenarioType,
  SimulationTimeHorizon,
  SimulationInput,
  SimulationOutput,
  SandboxConfig,
  SandboxResult
} from '../../../runtime/scenario-simulation/types';
import { ScenarioMacroProjectionEngine } from '../../../runtime/scenario-simulation/ScenarioMacroProjectionEngine';
import { GovernanceForecastEngine, ForecastOutput } from '../../../runtime/scenario-simulation/GovernanceForecastEngine';
import { PropagationSimulationEngine } from '../../../runtime/scenario-simulation/PropagationSimulationEngine';
import { StrategicDecisionSandbox } from '../../../runtime/scenario-simulation/StrategicDecisionSandbox';

interface ScenarioSimulationContextType {
  activeScenarioType: SimulationScenarioType;
  activeHorizon: SimulationTimeHorizon;
  simulationInput: SimulationInput | null;
  simulationOutput: SimulationOutput | null;
  forecastOutput: ForecastOutput | null;
  sandboxResult: SandboxResult | null;
  sandboxActions: SandboxConfig[];
  historyCyclesToUse: number; // to test INSUFFICIENT_HISTORY
  isRunning: boolean;
  error: string | null;
  setScenarioType: (type: SimulationScenarioType) => void;
  setHorizon: (horizon: SimulationTimeHorizon) => void;
  setHistoryCyclesToUse: (count: number) => void;
  runSimulation: () => void;
  applySandboxAction: (action: SandboxConfig) => void;
  removeSandboxAction: (actionType: string) => void;
  clearSandbox: () => void;
}

const ScenarioSimulationContext = createContext<ScenarioSimulationContextType>({
  activeScenarioType: 'LIQUIDITY_STRESS',
  activeHorizon: '90_DAYS',
  simulationInput: null,
  simulationOutput: null,
  forecastOutput: null,
  sandboxResult: null,
  sandboxActions: [],
  historyCyclesToUse: 4,
  isRunning: false,
  error: null,
  setScenarioType: () => {},
  setHorizon: () => {},
  setHistoryCyclesToUse: () => {},
  runSimulation: () => {},
  applySandboxAction: () => {},
  removeSandboxAction: () => {},
  clearSandbox: () => {}
});

export const useScenarioSimulation = () => useContext(ScenarioSimulationContext);

export const ScenarioSimulationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { context } = useTenancy();
  const [activeScenarioType, setScenarioType] = useState<SimulationScenarioType>('LIQUIDITY_STRESS');
  const [activeHorizon, setHorizon] = useState<SimulationTimeHorizon>('90_DAYS');
  const [historyCyclesToUse, setHistoryCyclesToUse] = useState<number>(4); // default > 3
  const [sandboxActions, setSandboxActions] = useState<SandboxConfig[]>([]);
  const [simulationInput, setSimulationInput] = useState<SimulationInput | null>(null);
  const [simulationOutput, setSimulationOutput] = useState<SimulationOutput | null>(null);
  const [forecastOutput, setForecastOutput] = useState<ForecastOutput | null>(null);
  const [sandboxResult, setSandboxResult] = useState<SandboxResult | null>(null);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // 1. Resolver ou Seedar os dados fiduciários reais (estilo DEMO/STAGING) do Inquilino Ativo
  useEffect(() => {
    if (!context) return;

    const tenantId = context.activeTenantId || 'default-tenant';
    const entityId = context.activeWorkspaceId || 'default-entity';
    
    // Seed estruturado contendo dados reais do simulador
    const mockInput: SimulationInput = {
      scenarioType: activeScenarioType,
      horizon: activeHorizon,
      tenantId,
      entityId,
      baseFinancials: {
        ativoTotal: 1500000,
        ativoCirculante: 800000,
        passivoCirculante: 450000,
        passivoTotal: 900000,
        patrimonioLiquido: 600000,
        caixaEquivalentes: 250000,
        estoques: 150000,
        receitaBruta: 1200000,
        receitaLiquida: 1000000,
        custosVar: 550000,
        despesasFixas: 380000,
        ebitda: 70000,
        lucroLiquido: 45000
      },
      historicalCycles: [
        {
          period: '2026-Q1',
          maturityScore: 78,
          anomaliesCount: 1,
          violationsCount: 0,
          cashValue: 250000,
          netMargin: 0.045,
          lineageHash: '0xHASH-DEMO-2026-Q1'
        },
        {
          period: '2025-Q4',
          maturityScore: 82,
          anomaliesCount: 0,
          violationsCount: 0,
          cashValue: 280000,
          netMargin: 0.052,
          lineageHash: '0xHASH-DEMO-2025-Q4'
        },
        {
          period: '2025-Q3',
          maturityScore: 85,
          anomaliesCount: 2,
          violationsCount: 1,
          cashValue: 310000,
          netMargin: 0.060,
          lineageHash: '0xHASH-DEMO-2025-Q3'
        },
        {
          period: '2025-Q2',
          maturityScore: 89,
          anomaliesCount: 1,
          violationsCount: 0,
          cashValue: 340000,
          netMargin: 0.065,
          lineageHash: '0xHASH-DEMO-2025-Q2'
        }
      ],
      activeEscalationLevel: 'MANAGEMENT_ACTION',
      lineageHash: '0xMAIN-AUDIT-LINEAGE-REFERENCE',
      correlationId: `correlation-sim-${Date.now()}`
    };

    setSimulationInput(mockInput);
  }, [context, activeScenarioType, activeHorizon]);

  // 2. Acionar a Execução da Simulação e do Forecast de forma integrada
  const runSimulation = () => {
    if (!simulationInput) return;
    setIsRunning(true);
    setError(null);

    try {
      // Filtrar ciclos de acordo com a seleção da UI para testar INSUFFICIENT_HISTORY
      const preparedInput: SimulationInput = {
        ...simulationInput,
        scenarioType: activeScenarioType,
        horizon: activeHorizon,
        historicalCycles: simulationInput.historicalCycles.slice(0, historyCyclesToUse),
        correlationId: `correlation-sim-${Date.now()}` // Nova correlação única
      };

      // Executar motores de simulação e forecast determinísticos
      const simOut = ScenarioMacroProjectionEngine.run(preparedInput);
      const foreOut = GovernanceForecastEngine.generateForecast(preparedInput);

      // Calcular cadeia de propagação no Propagation Engine
      const propChain = PropagationSimulationEngine.calculateContagion(preparedInput, simOut.projectedDeterioration.score);
      simOut.propagationChain = propChain;

      setSimulationOutput(simOut);
      setForecastOutput(foreOut);

      // Se houver ações de sandbox ativas, re-executar sandbox
      if (sandboxActions.length > 0) {
        const sandResult = StrategicDecisionSandbox.executeSandbox(preparedInput, sandboxActions);
        // Garantir que a cadeia de propagação do sandbox também seja calculada
        const sandPropChain = PropagationSimulationEngine.calculateContagion(
          preparedInput,
          sandResult.simulatedOutput.projectedDeterioration.score
        );
        sandResult.simulatedOutput.propagationChain = sandPropChain;
        setSandboxResult(sandResult);
      } else {
        setSandboxResult(null);
      }
    } catch (err: any) {
      console.error('Falha de execução do SSPGL:', err);
      setError((err instanceof Error ? err.message : String(err)) || 'Erro crítico na simulação fiduciária.');
      setSimulationOutput(null);
      setForecastOutput(null);
      setSandboxResult(null);
    } finally {
      setIsRunning(false);
    }
  };

  // Re-executa automaticamente quando muda o cenário, horizonte ou contagem de ciclos históricos
  useEffect(() => {
    if (simulationInput) {
      runSimulation();
    }
  }, [activeScenarioType, activeHorizon, historyCyclesToUse, simulationInput?.tenantId]);

  // 3. Gerenciamento do Sandbox Fiduciário
  const applySandboxAction = (action: SandboxConfig) => {
    if (!simulationInput) return;
    setSandboxActions(prev => {
      const filtered = prev.filter(a => a.actionType !== action.actionType);
      const newActions = [...filtered, action];
      
      const preparedInput: SimulationInput = {
        ...simulationInput,
        scenarioType: activeScenarioType,
        horizon: activeHorizon,
        historicalCycles: simulationInput.historicalCycles.slice(0, historyCyclesToUse)
      };

      try {
        const sandResult = StrategicDecisionSandbox.executeSandbox(preparedInput, newActions);
        const sandPropChain = PropagationSimulationEngine.calculateContagion(
          preparedInput,
          sandResult.simulatedOutput.projectedDeterioration.score
        );
        sandResult.simulatedOutput.propagationChain = sandPropChain;
        setSandboxResult(sandResult);
      } catch (err: any) {
        console.error('Erro ao processar sandbox estratégico:', err);
        setError((err instanceof Error ? err.message : String(err)));
      }

      return newActions;
    });
  };

  const removeSandboxAction = (actionType: string) => {
    if (!simulationInput) return;
    setSandboxActions(prev => {
      const newActions = prev.filter(a => a.actionType !== actionType);
      
      if (newActions.length === 0) {
        setSandboxResult(null);
        return [];
      }

      const preparedInput: SimulationInput = {
        ...simulationInput,
        scenarioType: activeScenarioType,
        horizon: activeHorizon,
        historicalCycles: simulationInput.historicalCycles.slice(0, historyCyclesToUse)
      };

      try {
        const sandResult = StrategicDecisionSandbox.executeSandbox(preparedInput, newActions);
        const sandPropChain = PropagationSimulationEngine.calculateContagion(
          preparedInput,
          sandResult.simulatedOutput.projectedDeterioration.score
        );
        sandResult.simulatedOutput.propagationChain = sandPropChain;
        setSandboxResult(sandResult);
      } catch (err: any) {
        console.error('Erro ao remover ação do sandbox:', err);
        setError((err instanceof Error ? err.message : String(err)));
      }

      return newActions;
    });
  };

  const clearSandbox = () => {
    setSandboxActions([]);
    setSandboxResult(null);
  };

  return (
    <ScenarioSimulationContext.Provider
      value={{
        activeScenarioType,
        activeHorizon,
        simulationInput,
        simulationOutput,
        forecastOutput,
        sandboxResult,
        sandboxActions,
        historyCyclesToUse,
        isRunning,
        error,
        setScenarioType,
        setHorizon,
        setHistoryCyclesToUse,
        runSimulation,
        applySandboxAction,
        removeSandboxAction,
        clearSandbox
      }}
    >
      {children}
    </ScenarioSimulationContext.Provider>
  );
};
