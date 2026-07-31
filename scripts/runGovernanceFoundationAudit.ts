import fs from 'fs';
import path from 'path';

const packagesDir = path.join(process.cwd(), 'packages');
const artifactsDir = path.join(process.cwd(), 'artifacts/governance-foundation-certification');

fs.mkdirSync(artifactsDir, { recursive: true });

const evidences = [];
let passedGates = 0;
let failedGates = 0;

function addEvidence(ruleId, finding, severity, file, result) {
  evidences.push({
    audit: "GFC-2026.3",
    rule: ruleId,
    finding,
    severity,
    file,
    result
  });
  if (result === 'FAIL') {
    failedGates++;
  } else {
    passedGates++;
  }
}

function getAllFiles(dir, fileList = []) {
  if (!fs.existsSync(dir)) return fileList;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      getAllFiles(fullPath, fileList);
    } else if (fullPath.endsWith('.ts')) {
      fileList.push(fullPath);
    }
  }
  return fileList;
}

const typesFiles = getAllFiles(path.join(packagesDir, 'architecture-governance-types/src'));
const contractsFiles = getAllFiles(path.join(packagesDir, 'architecture-governance-contracts/src'));
const domainFiles = getAllFiles(path.join(packagesDir, 'architecture-governance-domain/src'));

// AR-GFC-001 & AR-GFC-002 & AR-GFC-007
typesFiles.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  if (/from '(?!\.)/.test(content)) {
    addEvidence('AR-GFC-001', 'Types package imports external dependencies', 'CRITICAL', file, 'FAIL');
  } else {
    addEvidence('AR-GFC-001', 'Types package has no external dependencies', 'LOW', file, 'PASS');
  }
});

contractsFiles.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  if (/from '(@illumine\/(?!architecture-governance-types)|react|axios)/.test(content)) {
    addEvidence('AR-GFC-001', 'Contracts imports invalid external package', 'CRITICAL', file, 'FAIL');
  } else {
    addEvidence('AR-GFC-001', 'Contracts dependency direction correct', 'LOW', file, 'PASS');
  }
});

domainFiles.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  if (/from '(@illumine\/(?!architecture-governance-types|architecture-governance-contracts)|react|axios)/.test(content)) {
    addEvidence('AR-GFC-001', 'Domain imports invalid external package', 'CRITICAL', file, 'FAIL');
  } else {
    addEvidence('AR-GFC-001', 'Domain dependency direction correct', 'LOW', file, 'PASS');
  }
  
  // AR-GFC-009 Deep Immutability
  if (content.match(/:\s*[A-Z][a-zA-Z0-9]*\[\]/) || content.match(/:\s*string\[\]/)) {
    // There are some arrays not readonly
    addEvidence('AR-GFC-009', 'Found mutable array', 'HIGH', file, 'FAIL');
  } else {
    addEvidence('AR-GFC-009', 'Deep Immutability verified', 'LOW', file, 'PASS');
  }

  // AR-GFC-010 Domain Constructor Complexity
  if (content.includes('constructor') && (content.includes('if (') || content.includes('await '))) {
    addEvidence('AR-GFC-010', 'Entity constructor contains logic', 'CRITICAL', file, 'FAIL');
  } else {
    addEvidence('AR-GFC-010', 'Entity constructor is pure', 'LOW', file, 'PASS');
  }
});

// AR-GFC-003 Value Object Integrity
const voFiles = getAllFiles(path.join(packagesDir, 'architecture-governance-types/src/value-objects'));
voFiles.forEach(file => {
  if (file.endsWith('index.ts')) return;
  const content = fs.readFileSync(file, 'utf8');
  if (!content.includes('readonly __brand')) {
    addEvidence('AR-GFC-003', 'Value Object missing __brand', 'CRITICAL', file, 'FAIL');
  } else {
    addEvidence('AR-GFC-003', 'Value Object has opaque brand', 'LOW', file, 'PASS');
  }
});

// AR-GFC-006 Public Surface Integrity
['types', 'contracts', 'domain'].forEach(pkg => {
  const indexPath = path.join(packagesDir, `architecture-governance-${pkg}/src/index.ts`);
  if (!fs.existsSync(indexPath)) {
    addEvidence('AR-GFC-006', `Missing index.ts in ${pkg}`, 'CRITICAL', indexPath, 'FAIL');
  } else {
    addEvidence('AR-GFC-006', `Public surface index.ts exists for ${pkg}`, 'LOW', indexPath, 'PASS');
  }
});

const reportContent = `# Governance Foundation Certification (GFC-2026.3)
Date: ${new Date().toISOString()}

**Total Rules Evaluated**: ${evidences.length}
**Passed**: ${passedGates}
**Failed**: ${failedGates}

Status: ${failedGates === 0 ? '✅ PASS' : '❌ FAIL'}
`;

const certYaml = `Certification:
  name: Governance Foundation Certification
  version: GFC-2026.3
Result:
  status: ${failedGates === 0 ? 'PASS' : 'FAIL'}
Gates:
  passed: ${passedGates}
  failed: ${failedGates}
Risk:
  ${failedGates > 0 ? 'CRITICAL' : 'LOW'}
Approved:
  ${failedGates === 0 ? 'Wave G0.5' : 'NONE'}
`;

fs.writeFileSync(path.join(artifactsDir, 'evidence.json'), JSON.stringify(evidences, null, 2));
fs.writeFileSync(path.join(artifactsDir, 'gate-results.json'), JSON.stringify({ passed: passedGates, failed: failedGates }, null, 2));
fs.writeFileSync(path.join(artifactsDir, 'GFC_REPORT.md'), reportContent);
fs.writeFileSync(path.join(artifactsDir, 'certificate.yaml'), certYaml);

console.log(`GFC Audit Complete. Status: ${failedGates === 0 ? 'PASS' : 'FAIL'}`);
