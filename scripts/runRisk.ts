import { RiskAssessmentEngine } from '../packages/architecture-governance-risk/src/engines/RiskAssessmentEngine.ts';
import { RiskSnapshotGenerator } from '../packages/architecture-governance-risk/src/snapshots/RiskSnapshotGenerator.ts';

async function main() {
  const workspaceRoot = process.cwd();
  console.log('Running Architecture Risk Engine (G4.5)...');

  // Load Mock Advisory Context
  const context: any = {
    id: `RISK-CTX-${Date.now()}`,
    targetSubject: 'Financial Governance',
    periodStart: '2026-01-01',
    periodEnd: '2026-03-01',
    advisorySignals: [
      { id: 'SIG-DEP-1', category: 'DEPENDENCY', type: 'DEPENDENCY_EXPANSION', confidence: 'HIGH' },
      { id: 'SIG-BND-2', category: 'BOUNDARY', type: 'BOUNDARY_EXPANSION', confidence: 'MEDIUM' },
      { id: 'SIG-EVO-3', category: 'EVOLUTION', type: 'EVOLUTION_ACCELERATION', confidence: 'LOW' }
    ]
  };

  const engine = new RiskAssessmentEngine();
  const assessment = engine.generateAssessment(context);

  const generator = new RiskSnapshotGenerator(workspaceRoot);
  await generator.generate(assessment);

  console.log(`Risk Assessment generated with Exposure Level: ${assessment.exposureLevel} (${assessment.factors.length} factors).`);
}

main().catch(console.error);
