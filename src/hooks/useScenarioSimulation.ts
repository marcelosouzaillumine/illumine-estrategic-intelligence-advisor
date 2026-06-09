import { useState, useEffect } from 'react';
import { 
  SimulationInput, 
  SimulationOutput, 
  ScenarioParameters,
  simulateGrowthScenario,
  SimulationBaseData
} from '../lib/scenario-simulation-engine';

export function useScenarioSimulation(baseData: SimulationBaseData | null, initialParams?: ScenarioParameters) {
  const [parameters, setParameters] = useState<ScenarioParameters>(initialParams || {
    revenueMultiplier: 1,
    cogsMultiplier: 1,
    opexMultiplier: 1,
    headcountAddition: 0,
    debtInjection: 0,
    capitalInjection: 0,
    capexInvestment: 0,
    receivablesDaysExtension: 0,
    payablesDaysExtension: 0
  });

  const [output, setOutput] = useState<SimulationOutput | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!baseData) return;

    const timer = setTimeout(() => {
      setLoading(true);
      try {
        const input: SimulationInput = { baseData, parameters };
        // Para simplificar a interface, a "simulateGrowthScenario" atua como motor universal 
        // de aplicação de parâmetros (já que internamente ela invoca 'runSimulation' genérico).
        const result = simulateGrowthScenario(input);
        setOutput(result);
        setError(null);
      } catch (err: any) {
        setError(err instanceof Error ? err : new Error(String(err)));
      } finally {
        setLoading(false);
      }
    }, 500); // Debounce de 500ms

    return () => clearTimeout(timer);
  }, [baseData, parameters]);

  return { parameters, setParameters, output, loading, error };
}
