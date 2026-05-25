import fs from 'fs';
import path from 'path';

// This script only reports findings, it does not modify files.

const BANNED_IMPORTS = [
  'src/lib/scenario-simulation-engine',
  'src/lib/financial-engine',
  'src/lib/executive-causality-engine'
];

interface Finding {
  file: string;
  risk: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  recommendation: string;
  action: string;
}

const findings: Finding[] = [];

function scanDirectory(dir: string) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      if (file !== 'node_modules' && file !== '.git' && file !== 'dist') {
        scanDirectory(fullPath);
      }
    } else if (fullPath.endsWith('.ts') || fullPath.endsWith('.tsx')) {
      const content = fs.readFileSync(fullPath, 'utf-8');
      
      // Check for legacy imports
      for (const banned of BANNED_IMPORTS) {
        // Simple string matching for import paths containing the banned string
        const regex = new RegExp(`from\\s+['"].*${path.basename(banned)}['"]`);
        if (regex.test(content)) {
          findings.push({
            file: fullPath,
            risk: `Import of legacy engine: ${path.basename(banned)}`,
            severity: 'HIGH',
            recommendation: 'Use the new orchestration layer or consolidated runtime.',
            action: 'Remove import and migrate logic to Official Contracts.'
          });
        }
      }
    }
  }
}

console.log('Iniciando Imports Audit...');
scanDirectory(path.join(process.cwd(), 'src'));

fs.writeFileSync(
  path.join(process.cwd(), 'imports_audit_report.json'),
  JSON.stringify(findings, null, 2)
);

console.log(`Imports Audit concluída. Encontrados ${findings.length} problemas.`);
if (findings.length > 0) {
  console.log('Verifique imports_audit_report.json para mais detalhes.');
  // Retorna 0 para ser report-only inicialmente
  process.exit(0);
}
