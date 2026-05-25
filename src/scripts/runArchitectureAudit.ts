import fs from 'fs';
import path from 'path';

// This script only reports findings, it does not modify files.

interface Finding {
  file: string;
  risk: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  recommendation: string;
  action: string;
}

const findings: Finding[] = [];

// Define rules
const UI_FOLDERS = ['src/components', 'src/app'];
const CORE_RUNTIME_FOLDERS = ['src/core/runtime'];
const SERVICES_FOLDERS = ['src/services'];
const LIB_FOLDERS = ['src/lib'];

function scanDirectory(dir: string) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      if (file !== 'node_modules' && file !== '.git' && file !== 'dist' && file !== 'tests') {
        scanDirectory(fullPath);
      }
    } else if (fullPath.endsWith('.ts') || fullPath.endsWith('.tsx')) {
      const content = fs.readFileSync(fullPath, 'utf-8');
      
      const isUI = UI_FOLDERS.some(f => fullPath.includes(f));
      const isCore = CORE_RUNTIME_FOLDERS.some(f => fullPath.includes(f));
      
      if (isUI) {
        // UI should not import internal engine implementations directly, only Contracts/Types or Facades/Hooks
        if (content.includes('ExecutiveCausalityEngine.evaluate') || content.includes('ScenarioSimulationEngine')) {
          findings.push({
            file: fullPath,
            risk: 'UI component importing internal engine directly (Runtime Bypass)',
            severity: 'CRITICAL',
            recommendation: 'Use context or API to access intelligence. Do not call engines from UI.',
            action: 'Remove engine import.'
          });
        }
      }

      if (isCore) {
        // Core runtime should not import from UI
        if (content.includes("from '../components/") || content.includes("from '../../components/")) {
          findings.push({
            file: fullPath,
            risk: 'Core Runtime importing UI Component (Circular/Coupling Dependency)',
            severity: 'CRITICAL',
            recommendation: 'Runtime must be completely isolated from React/UI.',
            action: 'Remove UI import from Core.'
          });
        }
      }

      // Detect "frankestein" engines in src/lib
      if (fullPath.includes('src/lib/scenario-simulation-engine.ts') || fullPath.includes('src/lib/financial-engine.ts')) {
        findings.push({
          file: fullPath,
          risk: 'Legacy engine parallel to official Core Runtime',
          severity: 'HIGH',
          recommendation: 'Verify if it is still actively imported, if not, mark for deletion.',
          action: 'Map active imports and deprecate.'
        });
      }
    }
  }
}

console.log('Iniciando Architecture Audit...');
scanDirectory(path.join(process.cwd(), 'src'));

fs.writeFileSync(
  path.join(process.cwd(), 'architecture_audit_report.json'),
  JSON.stringify(findings, null, 2)
);

console.log(`Architecture Audit concluída. Encontrados ${findings.length} problemas.`);
if (findings.length > 0) {
  console.log('Verifique architecture_audit_report.json para mais detalhes.');
  process.exit(0);
}
