import { ConsolidatedRuntimeOrchestrator } from './src/core/runtime/consolidated/ConsolidatedRuntimeOrchestrator';
import { topologyStressFixture } from './tests/topology-stress.fixture';

const orchestrator = new ConsolidatedRuntimeOrchestrator();
const report = orchestrator.runConsolidatedAnalysis(JSON.parse(JSON.stringify(topologyStressFixture)));
console.log(JSON.stringify(report.systemicRiskProfile.propagatedRisks, null, 2));
console.log("Holding report:", report.systemicRiskProfile.affectedEntities);
