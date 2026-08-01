import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const UI_DIR = path.join(__dirname, '../src/components');
const FORBIDDEN_IMPORT_PATTERN = /from\s+['"]([^'"]*packages\/intelligence[^'"]*)['"]/g;

// Only these directories within intelligence are allowed in the UI
const ALLOWED_PATHS = [
  'packages/intelligence/executive-intelligence-layer/src/presentation',
  'packages/intelligence/executive-intelligence-layer/src/orchestration/InstitutionalDecisionOS',
  'packages/intelligence/executive-intelligence-layer/src/contracts',
];

// Legacy files that have yet to be migrated to the new Presentation Layer architecture.
// NO NEW FILES SHOULD BE ADDED TO THIS LIST.
const LEGACY_IGNORED_FILES = [
  'ExecutiveAdvisoryWorkspace.tsx',
  'DecisionSignaturePanel.tsx',
  'ScenarioSimulationPanel.tsx',
  'ExecutiveCognitiveGovernanceCard.tsx',
  'ExecutiveCopilotPanel.tsx',
  'ExecutiveDecisionRoom.tsx',
  'IntegrationTrustScoreCard.tsx',
  'PlatformIntegrationWorkspace.tsx',
  'EnterpriseDataHealthIndexCard.tsx',
  'InstitutionalLearningWorkspace.tsx',
  'CapabilityMapCard.tsx',
  'ExecutiveIntelligenceCommandCenter.tsx',
  'ExecutiveWorkflowWorkspace.tsx',
];

function isAllowed(importPath: string): boolean {
  return ALLOWED_PATHS.some(allowed => importPath.includes(allowed));
}

function scanDirectory(dir: string): string[] {
  let violations: string[] = [];
  const files = fs.readdirSync(dir);

  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      violations = violations.concat(scanDirectory(fullPath));
    } else if (fullPath.endsWith('.ts') || fullPath.endsWith('.tsx')) {
      if (LEGACY_IGNORED_FILES.includes(file)) {
        continue;
      }

      const content = fs.readFileSync(fullPath, 'utf8');
      
      let match;
      while ((match = FORBIDDEN_IMPORT_PATTERN.exec(content)) !== null) {
        const importPath = match[1];
        if (!isAllowed(importPath)) {
          violations.push(`[VIOLATION] ${fullPath}\n  Imports forbidden logic: ${importPath}`);
        }
      }

      // Wave 3.9 Governance Native Rule: Tactical domain pages cannot import deliberation constructs
      const GOVERNANCE_NATIVE_BANNED = [
        'ExecutiveDecision', 'ExecutivePolicy', 'ExecutiveIntent', 'DecisionStatus',
        'ApprovedScenario', 'ExecutionPlan', 'GovernancePlan', 'LearningLoop',
        'StrategicSimulator', 'ExecutiveDecisionEngine', 'ExecutiveDecisionIntelligenceMount'
      ];
      
      if (!file.includes('ExecutiveDeliberationCenter') && !file.includes('Dashboard') && !fullPath.includes('/components/executive/')) {
        GOVERNANCE_NATIVE_BANNED.forEach(banned => {
          const regex = new RegExp(`\\b${banned}\\b`, 'g');
          if (regex.test(content)) {
            violations.push(`[VIOLATION] ${fullPath}\n  Domain pages are prohibited from importing deliberation component: ${banned}`);
          }
        });
      }
    }
  }

  return violations;
}

console.log('--- Presentation Layer Audit ---');
console.log('Scanning for direct imports of business logic into UI components...\n');

const violations = scanDirectory(UI_DIR);

if (violations.length > 0) {
  console.error('❌ Presentation Layer Audit FAILED.');
  console.error(`Found ${violations.length} architectural violations:`);
  violations.forEach(v => console.error(v));
  process.exit(1);
} else {
  console.log('✅ Presentation Layer Audit PASSED.');
  console.log('The Presentation Layer strictly consumes the ExecutivePresentationModel.');
  process.exit(0);
}
