import { CapitalGovernanceAdapter } from '../core/runtime/capital-governance/capital-governance-adapter';

const context = {
  lifecycle: { analysisYear: 2024 },
  analysisYear: 2024,
  lifecycleProfile: {
    lifecycleStage: 'EXPANSION',
    narrativeProfile: 'Expansion Phase'
  }
};

const dlpaData = [{ year: 2024, lucroLiquido: 10000 }];

try {
  const result = CapitalGovernanceAdapter.process(
    dlpaData,
    10000,
    5000,
    0,
    100000,
    110000,
    0,
    context,
    [{ year: 2024, netIncome: 10000 }]
  );
  console.log("SUCCESS. Keys:", Object.keys(result));
  console.log("executiveLayer keys:", result.executiveLayer ? Object.keys(result.executiveLayer) : "MISSING");
} catch (e: any) {
  console.error("ERROR CAUGHT:", e.message);
}
