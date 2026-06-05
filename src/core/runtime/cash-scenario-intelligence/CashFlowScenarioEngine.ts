import { CashFlowScenarioIntelligenceOutput, CashFlowScenarioGroup, CashFlowScenario } from '../cash-intelligence/CashIntelligenceTypes';

export class CashFlowScenarioEngine {
  public static evaluate(
    currentFCO: number,
    availableCash: number,
    receivables: number,
    inventory: number,
    overhead: number,
    netRevenue: number,
    equityFunding: number,
    monthsCount: number
  ): CashFlowScenarioIntelligenceOutput {
    const currentRunway = currentFCO >= 0 ? 99 : Math.round((availableCash / (Math.abs(currentFCO) / monthsCount)) * 10) / 10;

    const buildScenarioGroup = (
      scenarioName: string,
      pctsOrDays: number[],
      type: 'STOCK' | 'OVERHEAD' | 'PMR'
    ): CashFlowScenarioGroup => {
      const simulations: CashFlowScenario[] = pctsOrDays.map(val => {
        let cashRelease = 0;
        let name = '';
        let parameter = '';

        if (type === 'STOCK') {
          // val is pct, e.g. 0.10, 0.20, 0.30
          cashRelease = val * inventory;
          parameter = `-${Math.round(val * 100)}%`;
          name = `Redução de Estoque ${parameter}`;
        } else if (type === 'OVERHEAD') {
          // val is pct, e.g. 0.10, 0.20, 0.30
          cashRelease = val * overhead;
          parameter = `-${Math.round(val * 100)}%`;
          name = `Redução de Overhead ${parameter}`;
        } else {
          // type === 'PMR', val is days, e.g. 10, 20, 30
          // PMR release = (days / 360) * netRevenue
          cashRelease = Math.min(receivables, (val / 360) * netRevenue);
          parameter = `-${val} dias`;
          name = `Melhoria de Recebimento ${parameter}`;
        }

        const fcoSimulated = currentFCO + cashRelease;
        const cashSimulated = Math.max(0, availableCash + cashRelease);

        let runwaySimulated = 99;
        if (fcoSimulated < 0) {
          const monthlyBurn = Math.abs(fcoSimulated) / monthsCount;
          runwaySimulated = Math.round((cashSimulated / monthlyBurn) * 10) / 10;
        }

        const runwayDisplay = runwaySimulated >= 99 ? '99+ meses' : `${runwaySimulated.toFixed(1)} meses`;

        // Calculate simulated dependency
        let dependencySimulated = 'AUTONOMA';
        if (fcoSimulated < 0) {
          const ratio = equityFunding / Math.abs(fcoSimulated);
          if (ratio < 0.1) dependencySimulated = 'BAIXA_DEPENDENCIA';
          else if (ratio < 0.25) dependencySimulated = 'MODERADA_DEPENDENCIA';
          else if (ratio <= 0.5) dependencySimulated = 'ALTA_DEPENDENCIA';
          else dependencySimulated = 'DEPENDENCIA_CRITICA';
        }

        return {
          name,
          parameter,
          fcoSimulated,
          cashSimulated,
          runwaySimulated,
          dependencySimulated,
          runwayDisplay,
          fcoBasis: 'ADJUSTED_OPERATIONAL_BURN'
        };
      });

      return {
        scenarioName,
        simulations
      };
    };

    const scenarios: CashFlowScenarioGroup[] = [
      buildScenarioGroup('Redução de Estoques', [0.1, 0.2, 0.3], 'STOCK'),
      buildScenarioGroup('Redução de Overhead', [0.1, 0.2, 0.3], 'OVERHEAD'),
      buildScenarioGroup('Melhoria de Recebimento (PMR)', [10, 20, 30], 'PMR')
    ];

    // Build board summary answer
    let answer = 'Simulações não indicaram mudanças de runway relevantes.';
    const stock30 = scenarios[0].simulations[2];
    const overhead20 = scenarios[1].simulations[1];
    
    const formatRunway = (r: number) => r >= 99 ? '99+ meses' : `${r.toFixed(1)} meses`;
    const formatCurrent = currentRunway >= 99 ? '99+ meses' : `${currentRunway.toFixed(1)} meses`;

    answer = `Redução de Estoque 30% projeta Runway = ${stock30.runwayDisplay} (Situação Atual: ${formatCurrent}). Redução de Overhead 20% projeta Runway = ${overhead20.runwayDisplay}.`;

    return {
      currentRunway,
      scenarios,
      boardOutput: {
        question: 'O que acontece se agirmos?',
        answer
      }
    };
  }
}
