import { validateAgainstGoldenDataset } from './GoldenDatasetValidator';
import { detectRegressions } from './RegressionDetectionEngine';
import { monitorCognitiveIntegrity } from './CognitiveIntegrityMonitor';
import { detectArchitecturalDrift } from './ArchitecturalDriftDetector';
import { watchRuntimeViolations } from './RuntimeViolationWatcher';
import { validateConfidenceIntegrity } from './ConfidenceIntegrityValidator';
import { monitorAdvisoryIntegrity } from './AdvisoryIntegrityMonitor';
import { validateHistoricalConsistency } from './HistoricalConsistencyValidator';
import { validateStressConsistency } from './StressConsistencyValidator';

export interface SelfAuditReport {
  timestamp: string;
  complianceStatus: 'COMPLIANT' | 'NON_COMPLIANT';
  architecturalIntegrity: { passed: boolean; violations: string[] };
  runtimeCompliance: { passed: boolean; violations: string[] };
  cognitiveConsistency: { passed: boolean; violations: string[] };
  regressionDetected: { passed: boolean; violations: string[] };
  goldenDatasetStatus: { passed: boolean; violations: string[] };
  confidenceIntegrity: { passed: boolean; violations: string[] };
  historicalConsistency: { passed: boolean; violations: string[] };
  stressConsistency: { passed: boolean; violations: string[] };
  advisoryIntegrity: { passed: boolean; violations: string[] };
  criticalFindings: string[];
  recommendedActions: string[];
}

export function runSelfAudit(runtimeOutput: any, sourceDirectories: string[]): SelfAuditReport {
  const report: SelfAuditReport = {
    timestamp: new Date().toISOString(),
    complianceStatus: 'COMPLIANT',
    architecturalIntegrity: { passed: true, violations: [] },
    runtimeCompliance: { passed: true, violations: [] },
    cognitiveConsistency: { passed: true, violations: [] },
    regressionDetected: { passed: true, violations: [] },
    goldenDatasetStatus: { passed: true, violations: [] },
    confidenceIntegrity: { passed: true, violations: [] },
    historicalConsistency: { passed: true, violations: [] },
    stressConsistency: { passed: true, violations: [] },
    advisoryIntegrity: { passed: true, violations: [] },
    criticalFindings: [],
    recommendedActions: []
  };

  // 1. Regression Detection
  const regressionResult = detectRegressions(sourceDirectories);
  report.regressionDetected = regressionResult;

  // 2. Golden Dataset Validation (Mock check with current runtimeOutput)
  if (runtimeOutput && runtimeOutput.inferences) {
     const engines = Object.keys(runtimeOutput.inferences);
     engines.forEach(engine => {
       let goldenName = '';
       if (engine === 'LegacyFinancialAdapter') goldenName = 'certified-bp-basic';
       if (engine === 'LegacyDREAdapter') goldenName = 'certified-dre-basic';
       if (engine === 'LegacyDFCAdapter') goldenName = 'certified-dfc-basic';
       if (engine === 'StressTestAdapter') goldenName = 'certified-stress-basic';
       if (engine === 'InstitutionalMemoryEngine') goldenName = 'certified-memory-basic';
       if (engine === 'ExecutiveDecisionEngine') goldenName = 'certified-decision-basic';

       if (goldenName) {
         const goldenResult = validateAgainstGoldenDataset(goldenName, runtimeOutput.inferences[engine]);
         if (!goldenResult.passed) {
           report.goldenDatasetStatus.passed = false;
           report.goldenDatasetStatus.violations.push(...goldenResult.violations);
         }
       }
     });
  }

  // 3. Cognitive Integrity
  const cognitiveResult = monitorCognitiveIntegrity(runtimeOutput);
  report.cognitiveConsistency = cognitiveResult;

  // 4. Architectural Drift
  const driftResult = detectArchitecturalDrift(runtimeOutput);
  report.architecturalIntegrity = driftResult;

  // 5. Runtime Violations
  const violationResult = watchRuntimeViolations(runtimeOutput);
  report.runtimeCompliance = violationResult;

  // 6. Confidence Integrity
  const confidenceResult = validateConfidenceIntegrity(runtimeOutput);
  report.confidenceIntegrity = confidenceResult;

  // 7. Historical Consistency
  const historicalResult = validateHistoricalConsistency(runtimeOutput);
  report.historicalConsistency = historicalResult;

  // 8. Stress Consistency
  const stressResult = validateStressConsistency(runtimeOutput);
  report.stressConsistency = stressResult;

  // 9. Advisory Integrity
  const advisoryResult = monitorAdvisoryIntegrity(runtimeOutput);
  report.advisoryIntegrity = advisoryResult;

  // Consolidate status
  const allResults = [
    regressionResult,
    report.goldenDatasetStatus,
    cognitiveResult,
    driftResult,
    violationResult,
    confidenceResult,
    historicalResult,
    stressResult,
    advisoryResult
  ];

  const hasViolations = allResults.some(r => !r.passed);

  if (hasViolations) {
    report.complianceStatus = 'NON_COMPLIANT';
    allResults.forEach(r => {
      if (!r.passed) {
        report.criticalFindings.push(...r.violations);
      }
    });
    report.recommendedActions.push('Bloquear release. Corrigir bypasses e violações arquiteturais reportadas.');
  } else {
    report.recommendedActions.push('Certificação completa. Plataforma apta para deploy.');
  }

  return report;
}
