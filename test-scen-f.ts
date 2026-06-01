import { test } from 'node:test';
import * as assert from 'node:assert/strict';
import { ExecutiveIntelligenceRuntime } from './src/core/runtime/executive-intelligence-runtime.ts';
import { InstitutionalBoardPackRuntime } from './src/core/runtime/institutional-reporting/InstitutionalBoardPackRuntime.ts';

const createCanonicalRuntimeHistory = (cycles) => {
  const history = [];
  for (let i = 1; i <= cycles; i++) {
    history.push({
      isAvailable: true,
      universalIndicators: {
        cashRunwayInstitucional: { months: 10 + i, classification: 'HEALTHY' }
      },
      liquidityClassification: {
        classification: 'OPERATIONALLY_SUSTAINABLE'
      },
      artificialLiquidityDetected: { isArtificial: false }
    });
  }
  return history;
};

const history = createCanonicalRuntimeHistory(4);
history[3].artificialLiquidityDetected.isArtificial = true;
history[3].liquidityClassification.classification = 'ARTIFICIAL_LIQUIDITY';

const engine = new ExecutiveIntelligenceRuntime();
const report = engine.generateExecutiveReport({
  historicalCashSustainabilityReports: history,
  historicalCyclesCount: 4,
  metadata: { historicalCyclesAvailable: 4 }
} as any);

const boardPack = InstitutionalBoardPackRuntime.generate(report, {} as any);
console.log('Trajectory:', boardPack.executiveSnapshot.longitudinalTrajectory);
console.log('Blocked:', boardPack.executiveSnapshot.recoveryNarrativeBlocked);
