import { LongitudinalCashIntelligenceEngine } from './src/core/runtime/cash-intelligence/LongitudinalCashIntelligenceEngine.ts';

const createHistory = () => {
  const history = [];
  for (let i = 1; i <= 4; i++) {
    history.push({
      isAvailable: true,
      universalIndicators: { cashRunwayInstitucional: { months: 10 + i } },
      liquidityClassification: { classification: 'OPERATIONALLY_SUSTAINABLE' },
      artificialLiquidityDetected: { isArtificial: false }
    });
  }
  return history;
};

const h = createHistory();
h[3].artificialLiquidityDetected.isArtificial = true;
h[3].liquidityClassification.classification = 'ARTIFICIAL_LIQUIDITY';

const res = LongitudinalCashIntelligenceEngine.evaluate(h);
console.log(res.longitudinalOut.trajectoryClassification);
