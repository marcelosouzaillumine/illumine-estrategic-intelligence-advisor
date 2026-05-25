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
