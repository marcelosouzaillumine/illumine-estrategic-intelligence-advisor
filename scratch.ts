import { orchestrateExecutiveConsolidation } from './src/core/orchestration/executiveOrchestrationEngine';

const recs = [
  { text: 'Recuperar Caixa', type: 'BOARD', impact: 'Muito Alto' as any },
  { text: 'Recuperar Caixa', type: 'EXECUTIVE', impact: 'Alto' as any }
];

const result = orchestrateExecutiveConsolidation(
  {
    ebitdaDre: -50, ebitdaEfos: -50,
    lucroLiquidoDre: -100, lucroLiquidoEfos: -100,
    fcoDfc: -20, fcoEfos: -20,
    caixaFinalDfc: -50, caixaFinalEfos: -50,
    patrimonioLiquidoBp: -10, patrimonioLiquidoEfos: -10,
    capitalConsumidoDlpa: 50, capitalConsumidoEfos: 50
  },
  {
    calculatedScore: 25,
    equityPositive: false,
    hasRevenue: true,
    operationalContinuity: false
  },
  {},
  {
    lucroLiquido: -100,
    ebitda: -50,
    fco: -20,
    liquidezReal: 0.5,
    runway: 1,
    capitalConsumido: 50
  },
  recs
);

console.log('EXECUTIVE TOP 5 LENGTH:', result.executiveTop5.length);
console.log('EXECUTIVE TOP 5:', result.executiveTop5);
