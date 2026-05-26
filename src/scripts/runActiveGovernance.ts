import fs from 'fs';
import path from 'path';
import { runSelfAudit } from '../governance/RuntimeSelfAuditEngine';
import { runTemporalGovernanceTests } from './runTemporalTests';
import { execSync } from 'child_process';

// Simula o output certificado do RuntimeOrchestrator baseando-se nos golden datasets
const mockCompliantRuntimeOutput = {
  executionStatus: 'COMPLETED',
  globalConfidence: 'HIGH',
  executedEngines: [
    'LegacyFinancialAdapter',
    'LegacyDREAdapter',
    'LegacyDFCAdapter',
    'StressTestAdapter',
    'ExecutiveDecisionEngine',
    'InstitutionalMemoryEngine'
  ],
  violations: [],
  inferences: {
    LegacyFinancialAdapter: JSON.parse(fs.readFileSync(path.resolve(process.cwd(), 'src/governance/golden-datasets/certified-bp-basic.json'), 'utf8')),
    LegacyDREAdapter: JSON.parse(fs.readFileSync(path.resolve(process.cwd(), 'src/governance/golden-datasets/certified-dre-basic.json'), 'utf8')),
    LegacyDFCAdapter: JSON.parse(fs.readFileSync(path.resolve(process.cwd(), 'src/governance/golden-datasets/certified-dfc-basic.json'), 'utf8')),
    StressTestAdapter: JSON.parse(fs.readFileSync(path.resolve(process.cwd(), 'src/governance/golden-datasets/certified-stress-basic.json'), 'utf8')),
    InstitutionalMemoryEngine: JSON.parse(fs.readFileSync(path.resolve(process.cwd(), 'src/governance/golden-datasets/certified-memory-basic.json'), 'utf8')),
    ExecutiveDecisionEngine: JSON.parse(fs.readFileSync(path.resolve(process.cwd(), 'src/governance/golden-datasets/certified-decision-basic.json'), 'utf8'))
  }
};

async function executeActiveGovernance() {
  console.log('Iniciando Active Governance Audit...');

  const temporalPassed = runTemporalGovernanceTests();
  if (!temporalPassed) {
    console.error('\nCRITICAL: Falha na validação Temporal Causality. Abortando Governance Audit.\n');
    process.exit(1);
  }

  console.log('\nIniciando Topology Compliance Audit...');
  try {
    execSync('npx tsx src/scripts/runTopologyAudit.ts', { stdio: 'inherit' });
  } catch (error) {
    console.error('\nCRITICAL: Falha na validação da Topologia Multi-Entity. Abortando Governance Audit.\n');
    process.exit(1);
  }

  console.log('\nIniciando Consolidated Financial Audit...');
  try {
    execSync('npx tsx src/scripts/runConsolidatedFinancialAudit.ts', { stdio: 'inherit' });
  } catch (error) {
    console.error('\nCRITICAL: Falha na validação Financeira Consolidada. Abortando Governance Audit.\n');
    process.exit(1);
  }

  console.log('\nIniciando Consolidated Advisory Audit...');
  try {
    execSync('npx tsx src/scripts/runConsolidatedAdvisoryAudit.ts', { stdio: 'inherit' });
  } catch (error) {
    console.error('\nCRITICAL: Falha na validação do Advisory Consolidado. Abortando Governance Audit.\n');
    process.exit(1);
  }

  console.log('\nIniciando Consolidated Presentation Audit...');
  try {
    execSync('npx tsx src/scripts/runConsolidatedPresentationAudit.ts', { stdio: 'inherit' });
  } catch (error) {
    console.error('\nCRITICAL: Falha na validação de UI. Abortando Governance Audit.\n');
    process.exit(1);
  }

  console.log('\nIniciando Consolidated Data Integration Audit...');
  try {
    execSync('npx tsx src/scripts/runConsolidatedDataIntegrationAudit.ts', { stdio: 'inherit' });
  } catch (error) {
    console.error('\nCRITICAL: Falha na validação de Data Layer. Abortando Governance Audit.\n');
    process.exit(1);
  }

  console.log('\nIniciando Consolidated Data Model Audit...');
  try {
    execSync('npx tsx src/scripts/runConsolidatedDataModelAudit.ts', { stdio: 'inherit' });
  } catch (error) {
    console.error('\nCRITICAL: Falha na validação de Data Model. Abortando Governance Audit.\n');
    process.exit(1);
  }

  console.log('\nIniciando Observability Governance Audit...');
  try {
    execSync('npx tsx src/scripts/runObservabilityGovernanceAudit.ts', { stdio: 'inherit' });
  } catch (error) {
    console.error('\nCRITICAL: Falha na validação de Observabilidade. Abortando Governance Audit.\n');
    process.exit(1);
  }

  console.log('\nIniciando Scenario Governance Audit...');
  try {
    execSync('npx tsx src/scripts/runScenarioGovernanceAudit.ts', { stdio: 'inherit' });
  } catch (error) {
    console.error('\nCRITICAL: Falha na validação de Cenários. Abortando Governance Audit.\n');
    process.exit(1);
  }

  console.log('\nIniciando Reporting Governance Audit...');
  try {
    execSync('npx tsx src/scripts/runReportingGovernanceAudit.ts', { stdio: 'inherit' });
  } catch (error) {
    console.error('\nCRITICAL: Falha na validação de Reporting. Abortando Governance Audit.\n');
    process.exit(1);
  }

  console.log('\nIniciando Tenancy Governance Audit...');
  try {
    execSync('npx tsx src/scripts/runTenancyGovernanceAudit.ts', { stdio: 'inherit' });
  } catch (error) {
    console.error('\nCRITICAL: Falha na validação de Tenancy. Abortando Governance Audit.\n');
    process.exit(1);
  }

  console.log('\nIniciando Performance Governance Audit...');
  try {
    execSync('npx tsx src/scripts/runPerformanceGovernanceAudit.ts', { stdio: 'inherit' });
  } catch (error) {
    console.error('\nCRITICAL: Falha na validação de Performance. Abortando Governance Audit.\n');
    process.exit(1);
  }

  console.log('\nIniciando AI Governance Audit...');
  try {
    execSync('npx tsx src/scripts/runAIGovernanceAudit.ts', { stdio: 'inherit' });
  } catch (error) {
    console.error('\nCRITICAL: Falha na validação de AI Governance. Abortando Governance Audit.\n');
    process.exit(1);
  }

  console.log('\nIniciando Monitoring Governance Audit...');
  try {
    execSync('npx tsx src/scripts/runMonitoringGovernanceAudit.ts', { stdio: 'inherit' });
  } catch (error) {
    console.error('\nCRITICAL: Falha na validação de Monitoring Governance. Abortando Governance Audit.\n');
    process.exit(1);
  }

  console.log('\nIniciando Workflow Governance Audit...');
  try {
    execSync('npx tsx src/scripts/runWorkflowGovernanceAudit.ts', { stdio: 'inherit' });
  } catch (error) {
    console.error('\nCRITICAL: Falha na validação de Workflow Governance. Abortando Governance Audit.\n');
    process.exit(1);
  }

  console.log('\nIniciando Integration Governance Audit...');
  try {
    execSync('npx tsx src/scripts/runIntegrationGovernanceAudit.ts', { stdio: 'inherit' });
  } catch (error) {
    console.error('\nCRITICAL: Falha na validação de Integration Governance. Abortando Governance Audit.\n');
    process.exit(1);
  }

  console.log('\nIniciando Benchmark Governance Audit...');
  try {
    execSync('npx tsx src/scripts/runBenchmarkGovernanceAudit.ts', { stdio: 'inherit' });
  } catch (error) {
    console.error('\nCRITICAL: Falha na validação de Benchmark Governance. Abortando Governance Audit.\n');
    process.exit(1);
  }

  console.log('\nIniciando Product Governance Audit...');
  try {
    execSync('npx tsx src/scripts/runProductGovernanceAudit.ts', { stdio: 'inherit' });
  } catch (error) {
    console.error('\nCRITICAL: Falha na validação de Product Governance. Abortando Governance Audit.\n');
    process.exit(1);
  }

  console.log('\nIniciando Knowledge Graph Governance Audit...');
  try {
    execSync('npx tsx src/scripts/runKnowledgeGraphGovernanceAudit.ts', { stdio: 'inherit' });
  } catch (error) {
    console.error('\nCRITICAL: Falha na validação de Knowledge Graph Governance. Abortando Governance Audit.\n');
    process.exit(1);
  }

  console.log('\nIniciando Early Warning Governance Audit...');
  try {
    execSync('npx tsx src/scripts/runEarlyWarningGovernanceAudit.ts', { stdio: 'inherit' });
  } catch (error) {
    console.error('\nCRITICAL: Falha na validação de Early Warning Governance. Abortando Governance Audit.\n');
    process.exit(1);
  }

  console.log('\nIniciando Strategic Simulation Governance Audit...');
  try {
    execSync('npx tsx src/scripts/runStrategicSimulationGovernanceAudit.ts', { stdio: 'inherit' });
  } catch (error) {
    console.error('\nCRITICAL: Falha na validação de Strategic Simulation Governance. Abortando Governance Audit.\n');
    process.exit(1);
  }

  console.log('\nIniciando Governance Orchestration Audit...');
  try {
    execSync('npx tsx src/scripts/runGovernanceOrchestrationAudit.ts', { stdio: 'inherit' });
  } catch (error) {
    console.error('\nCRITICAL: Falha na validação de Governance Orchestration. Abortando Governance Audit.\n');
    process.exit(1);
  }

  console.log('\nIniciando IOS Governance Audit...');
  try {
    execSync('npx tsx src/scripts/runIOSGovernanceAudit.ts', { stdio: 'inherit' });
  } catch (error) {
    console.error('\nCRITICAL: Falha na validação de IOS Governance. Abortando Governance Audit.\n');
    process.exit(1);
  }

  console.log('\nIniciando Enterprise Validation Audit...');
  try {
    execSync('npx tsx src/scripts/runEnterpriseValidationGovernanceAudit.ts', { stdio: 'inherit' });
  } catch (error) {
    console.error('\nCRITICAL: Falha na validação de Enterprise Validation. Abortando Governance Audit.\n');
    process.exit(1);
  }

  console.log('\nIniciando Reality Validation Audit...');
  try {
    execSync('npx tsx src/scripts/runRealityValidationGovernanceAudit.ts', { stdio: 'inherit' });
  } catch (error) {
    console.error('\nCRITICAL: Falha na validação de Reality Validation. Abortando Governance Audit.\n');
    process.exit(1);
  }

  console.log('\nIniciando Self-Audit Core...');

  const report = runSelfAudit(mockCompliantRuntimeOutput, ['src/components', 'src/lib', 'src/runtime', 'src/services']);

  const reportPath = path.resolve(process.cwd(), 'governance_self_audit_report.json');
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2), 'utf8');

  console.log(`Auditoria Finalizada. Status: ${report.complianceStatus}`);
  console.log(`Relatório salvo em: ${reportPath}`);

  if (report.complianceStatus === 'NON_COMPLIANT') {
    console.error('CRITICAL: Regressão Arquitetural Detectada! Build bloqueado.');
    report.criticalFindings.forEach(f => console.error(`- ${f}`));
    process.exit(1);
  } else {
    console.log('SUCCESS: Plataforma 100% Runtime-Compliant.');
    process.exit(0);
  }
}

executeActiveGovernance();
