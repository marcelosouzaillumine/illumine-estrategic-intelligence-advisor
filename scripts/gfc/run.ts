import { Project } from 'ts-morph';
import path from 'path';
import fs from 'fs';
import { execSync } from 'child_process';
import { GFCEngine, AuditContext } from './engine';
import {
  DependencyDirectionRule,
  RuntimePurityRule,
  CircularDependencyRule,
  DeepImmutabilityRule,
  ConstructorComplexityRule,
  PackageExportIntegrityRule,
  ValueObjectIntegrityRule,
  EvaluationIsolationRule,
  UIObservationOnlyRule,
  UIReadOnlyEnforcementRule,
  UISemanticNeutralityRule,
  CertEngineIsolationRule,
  CertEvidenceReferenceRule,
  CertPolicyVersionRule,
  CertImmutabilityRule,
  PolicyImmutabilityRule,
  EvidenceLineageRule,
  DeterministicCertificationRule,
  HistoricalIntegrityRule,
  ReplayDeterminismRule,
  AuditAppendOnlyRule,
  IntNoMutationRule,
  IntEvidenceRequiredRule,
  IntNoRecommendationLeakageRule,
  IntDeterministicGenerationRule,
  IntSourceTraceabilityRule,
  EvoTemporalIntegrityRule,
  EvoHistoricalImmutabilityRule,
  EvoEvidenceTraceabilityRule,
  EvoSourceSnapshotProtectionRule,
  EvoDeterministicComparisonRule,
  AdvHistoricalImmutabilityRule,
  AdvEvidenceTraceabilityRule,
  AdvHistoricalImmutabilityRule,
  AdvEvidenceTraceabilityRule,
  AdvNoPrescriptiveLanguageRule,
  AdvDeterministicOutputRule,
  AdvNarrativeSourceIntegrityRule,
  RiskRequiresEvidenceRule,
  RiskModelVersioningRule,
  RiskNoHiddenScoringRule,
  RiskExplanationTraceabilityRule,
  RiskNoAutonomousDecisionRule,
  DecStrictInputSegregationRule,
  DecPassiveStatusRequirementRule,
  DecNoRecommendationLeakageRule,
  DecDeterministicContextHashRule,
  KnwExplainabilityRequirementRule,
  KnwConstitutionCitationRequirementRule,
  KnwConfidenceThresholdRule,
  KnwKnowledgeCoverageRule,
  KnwCounterfactualBoundaryRule,
  MemAppendOnlyRule,
  MemEvidenceAnchoredRule,
  MemNoPredictiveLeakageRule,
  RecNoAutonomousDecisionRule,
  RecEvidenceMandatoryRule,
  RecAlternativeRequirementRule,
  RecNoOptimizationClaimRule,
  RecHumanDecisionBoundaryRule,
  DecDecisionAuthorityBoundaryRule,
  DecEvidenceRequirementRule,
  DecDecisionTraceabilityRule,
  DecOutcomeLearningRule,
  DecTenantIsolationRule,
  LrnLessonTraceabilityRule,
  LrnPatternEmpiricalBaseRule,
  LrnPrincipleGenerationRule,
  LrnLearningTenantIsolationRule,
  LrnHumanValidationBoundaryRule
} from './rules';

const project = new Project();
const packagesDir = path.join(process.cwd(), 'packages');

project.addSourceFilesAtPaths([
  path.join(packagesDir, 'architecture-governance-types/src/**/*.ts'),
  path.join(packagesDir, 'architecture-governance-contracts/src/**/*.ts'),
  path.join(packagesDir, 'architecture-governance-domain/src/**/*.ts'),
  path.join(packagesDir, 'architecture-governance-evaluation/src/**/*.ts'),
  path.join(packagesDir, 'architecture-governance-ui-contracts/src/**/*.ts'),
  path.join(packagesDir, 'architecture-governance-ui/src/**/*.ts'),
  path.join(packagesDir, 'architecture-governance-ui/src/**/*.tsx')
]);

const context: AuditContext = {
  project,
  domainFiles: project.getSourceFiles(path.join(packagesDir, 'architecture-governance-domain/src/**/*.ts')),
  contractFiles: project.getSourceFiles(path.join(packagesDir, 'architecture-governance-contracts/src/**/*.ts')),
  typesFiles: project.getSourceFiles(path.join(packagesDir, 'architecture-governance-types/src/**/*.ts')),
  evaluationFiles: project.getSourceFiles(path.join(packagesDir, 'architecture-governance-evaluation/src/**/*.ts')),
  uiFiles: project.getSourceFiles([
    path.join(packagesDir, 'architecture-governance-ui-contracts/src/**/*.ts'),
    path.join(packagesDir, 'architecture-governance-ui/src/**/*.ts'),
    path.join(packagesDir, 'architecture-governance-ui/src/**/*.tsx')
  ]),
  packagesDir
};

const engine = new GFCEngine(context);

engine.registerRule(new DependencyDirectionRule());
engine.registerRule(new RuntimePurityRule());
engine.registerRule(new CircularDependencyRule());
engine.registerRule(new DeepImmutabilityRule());
engine.registerRule(new ConstructorComplexityRule());
engine.registerRule(new PackageExportIntegrityRule());
engine.registerRule(new ValueObjectIntegrityRule());
engine.registerRule(new EvaluationIsolationRule());
engine.registerRule(new UIObservationOnlyRule());
engine.registerRule(new UIReadOnlyEnforcementRule());
engine.registerRule(new UISemanticNeutralityRule());
engine.registerRule(new CertEngineIsolationRule());
engine.registerRule(new CertEvidenceReferenceRule());
engine.registerRule(new CertPolicyVersionRule());
engine.registerRule(new CertImmutabilityRule());
engine.registerRule(new PolicyImmutabilityRule());
engine.registerRule(new EvidenceLineageRule());
engine.registerRule(new DeterministicCertificationRule());
engine.registerRule(new HistoricalIntegrityRule());
engine.registerRule(new ReplayDeterminismRule());
engine.registerRule(new AuditAppendOnlyRule());
engine.registerRule(new IntNoMutationRule());
engine.registerRule(new IntEvidenceRequiredRule());
engine.registerRule(new IntNoRecommendationLeakageRule());
engine.registerRule(new IntDeterministicGenerationRule());
engine.registerRule(new IntSourceTraceabilityRule());
engine.registerRule(new EvoTemporalIntegrityRule());
engine.registerRule(new EvoHistoricalImmutabilityRule());
engine.registerRule(new EvoEvidenceTraceabilityRule());
engine.registerRule(new EvoSourceSnapshotProtectionRule());
engine.registerRule(new EvoDeterministicComparisonRule());
engine.registerRule(new AdvHistoricalImmutabilityRule());
engine.registerRule(new AdvEvidenceTraceabilityRule());
engine.registerRule(new AdvNoPrescriptiveLanguageRule());
engine.registerRule(new AdvDeterministicOutputRule());
engine.registerRule(new AdvNarrativeSourceIntegrityRule());
engine.registerRule(new RiskRequiresEvidenceRule());
engine.registerRule(new RiskModelVersioningRule());
engine.registerRule(new RiskNoHiddenScoringRule());
engine.registerRule(new RiskExplanationTraceabilityRule());
engine.registerRule(new RiskNoAutonomousDecisionRule());
engine.registerRule(new DecStrictInputSegregationRule());
engine.registerRule(new DecPassiveStatusRequirementRule());
engine.registerRule(new DecNoRecommendationLeakageRule());
engine.registerRule(new DecDeterministicContextHashRule());
engine.registerRule(new KnwExplainabilityRequirementRule());
engine.registerRule(new KnwConstitutionCitationRequirementRule());
engine.registerRule(new KnwConfidenceThresholdRule());
engine.registerRule(new KnwKnowledgeCoverageRule());
engine.registerRule(new KnwCounterfactualBoundaryRule());
engine.registerRule(new MemAppendOnlyRule());
engine.registerRule(new MemEvidenceAnchoredRule());
engine.registerRule(new MemNoPredictiveLeakageRule());
engine.registerRule(new RecNoAutonomousDecisionRule());
engine.registerRule(new RecEvidenceMandatoryRule());
engine.registerRule(new RecAlternativeRequirementRule());
engine.registerRule(new RecNoOptimizationClaimRule());
engine.registerRule(new RecHumanDecisionBoundaryRule());
engine.registerRule(new DecDecisionAuthorityBoundaryRule());
engine.registerRule(new DecEvidenceRequirementRule());
engine.registerRule(new DecDecisionTraceabilityRule());
engine.registerRule(new DecOutcomeLearningRule());
engine.registerRule(new DecTenantIsolationRule());
engine.registerRule(new LrnLessonTraceabilityRule());
engine.registerRule(new LrnPatternEmpiricalBaseRule());
engine.registerRule(new LrnPrincipleGenerationRule());
engine.registerRule(new LrnLearningTenantIsolationRule());
engine.registerRule(new LrnHumanValidationBoundaryRule());

const evidences = engine.evaluateAll();

const passed = evidences.filter(e => e.result === 'PASS').length;
const failed = evidences.filter(e => e.result === 'FAIL').length;
const status = failed === 0 ? 'PASS' : 'FAIL';

const baselineDir = path.join(process.cwd(), 'baselines/BASELINE-AGC-001');
fs.mkdirSync(baselineDir, { recursive: true });

// Capturing fingerprint
const gitCommit = execSync('git rev-parse HEAD').toString().trim();
const branch = execSync('git rev-parse --abbrev-ref HEAD').toString().trim();
const timestamp = new Date().toISOString();
const nodeVersion = process.version;

const certificationYaml = `CertificationFingerprint:
  gitCommit: ${gitCommit}
  branch: ${branch}
  timestamp: ${timestamp}
  nodeVersion: ${nodeVersion}
  npmVersion: ${execSync('npm -v').toString().trim()}
  typescriptVersion: ${execSync('npx tsc -v').toString().trim()}
  auditedPackages:
    - architecture-governance-types
    - architecture-governance-contracts
    - architecture-governance-domain

Certification:
  name: Governance Foundation Certification
  version: GFC-2026.3
Result:
  status: ${status}
Gates:
  passed: ${passed}
  failed: ${failed}
Risk:
  ${failed > 0 ? 'CRITICAL' : 'LOW'}
Approved:
  ${failed === 0 ? 'Wave G0.5' : 'NONE'}
`;

const baselineYaml = `Baseline:
  name: AGC Foundation Baseline
  version: 2026.3
Certified:
  Wave: G0
  Status: ${status}
Metrics:
  RulesEvaluated: ${evidences.length}
  Failures: ${failed}
  Risk: ${failed > 0 ? 'CRITICAL' : 'LOW'}
NextAllowedWave:
  ${failed === 0 ? 'G0.5' : 'NONE'}
`;

fs.writeFileSync(path.join(baselineDir, 'certification.yaml'), certificationYaml);
fs.writeFileSync(path.join(baselineDir, 'baseline.yaml'), baselineYaml);
fs.writeFileSync(path.join(baselineDir, 'evidence.snapshot.json'), JSON.stringify(evidences, null, 2));

console.log(`GFC Audit Complete. Executed ${evidences.length} rule checks.`);
console.log(`PASS: ${passed} | FAIL: ${failed}`);
console.log(`Status: ${status}`);
console.log(`Baseline registered at: ${baselineDir}`);
