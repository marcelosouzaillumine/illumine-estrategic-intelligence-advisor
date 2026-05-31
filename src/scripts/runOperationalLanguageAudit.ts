// src/scripts/runOperationalLanguageAudit.ts

import * as fs from 'fs';
import * as path from 'path';

function runOperationalLanguageAudit() {
  console.log('▶ Starting Institutional Operational Governance Language Audit...');

  const srcDir = path.resolve(process.cwd(), 'src');
  if (!fs.existsSync(srcDir)) {
    console.error(`Error: Directory ${srcDir} does not exist.`);
    process.exit(1);
  }

  const violations: string[] = [];
  const bannedTerms = [
    'ineficiência',
    'gestão falhou',
    'erro operacional',
    'liderança fraca',
    'time incapaz',
    'falha humana',
    'má execução',
    'incompetência',
    'problema comportamental',
    'fragmented' // Adicionado como exigido pela RC-1.11 (Trilha 7 / Feedback)
  ];

  const getFilesRecursive = (dir: string, fileList: string[]) => {
    const list = fs.readdirSync(dir);
    list.forEach(file => {
      const fullPath = path.join(dir, file);
      const stat = fs.statSync(fullPath);
      if (stat && stat.isDirectory()) {
        getFilesRecursive(fullPath, fileList);
      } else {
        if (fullPath.endsWith('.ts') || fullPath.endsWith('.tsx')) {
          fileList.push(fullPath);
        }
      }
    });
  };

  const allSrcFiles: string[] = [];
  getFilesRecursive(srcDir, allSrcFiles);

  for (const filePath of allSrcFiles) {
    const relativePath = path.relative(process.cwd(), filePath);
    
    // Skip this script itself
    if (relativePath === path.join('src', 'scripts', 'runOperationalLanguageAudit.ts')) {
      continue;
    }

    // Only audit files belonging to the Operational Governance component
    if (!relativePath.includes('operational-governance')) {
      continue;
    }

    const content = fs.readFileSync(filePath, 'utf8').toLowerCase();

    // 1. Language restrictions
    for (const term of bannedTerms) {
      if (content.includes(term.toLowerCase())) {
        violations.push(`Violation in ${relativePath}: Banned term "${term}" found. Operational Governance must remain neutral and structural.`);
      }
    }

    // 2. UI Rule restrictions for Operational Governance specifically
    if (relativePath.includes('components/operational-governance')) {
      const originalContent = fs.readFileSync(filePath, 'utf8');
      if (originalContent.includes('Math.random') || originalContent.includes('calculateSeverity') || originalContent.includes('setSeverity') || originalContent.includes('evaluate(')) {
        violations.push(`Violation in ${relativePath}: Sovereign UI components cannot contain local operational calculations or heuristics.`);
      }
    }
  }

  if (violations.length > 0) {
    console.error('\n❌ Operational Language & Structural Audit FAILED:');
    violations.forEach(v => console.error(`  - ${v}`));
    process.exit(1);
  }

  console.log('✅ Operational Language & Structural Audit PASSED: No anthropomorphic/subjective terms detected.');
  process.exit(0);
}

runOperationalLanguageAudit();
