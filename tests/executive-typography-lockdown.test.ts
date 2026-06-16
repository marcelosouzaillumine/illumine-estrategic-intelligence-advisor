import { test } from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';

test.skip('Executive Typography Lockdown Sprint v1.0', async () => {
  const violations: string[] = [];

  const checkFile = (filePath: string) => {
    if (!fs.existsSync(filePath)) {
      violations.push(`File missing: ${filePath}`);
      return;
    }
    
    // Ignore the registry itself
    if (filePath.endsWith('executive-typography.tsx')) return;

    const content = fs.readFileSync(filePath, 'utf-8');
    const lines = content.split('\n');

    lines.forEach((line, index) => {
      // 1. Block unauthorized local typography
      if (line.match(/text-[0-9]xl/)) {
        violations.push(`${filePath}:${index + 1} -> [PROIBIDO] Uso direto de 'text-*xl'. Use executiveTypography ou ExecutiveText.`);
      }
      if (line.match(/font-black|font-bold/)) {
        violations.push(`${filePath}:${index + 1} -> [PROIBIDO] Uso direto de 'font-black' ou 'font-bold'. Use executiveTypography ou ExecutiveText.`);
      }
      if (line.match(/tracking-/)) {
        violations.push(`${filePath}:${index + 1} -> [PROIBIDO] Uso direto de 'tracking-*'. Use executiveTypography ou ExecutiveText.`);
      }
      if (line.match(/leading-/)) {
        violations.push(`${filePath}:${index + 1} -> [PROIBIDO] Uso direto de 'leading-*'. Use executiveTypography ou ExecutiveText.`);
      }
    });
  };

  const uiPath = path.join(process.cwd(), 'src/components/ui');
  const bpPath = path.join(process.cwd(), 'src/components/pages/balance-sheet');

  const checkDirRecursive = (dir: string, prefix: string) => {
    if (!fs.existsSync(dir)) return;
    const items = fs.readdirSync(dir);
    for (const item of items) {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);
      if (stat.isDirectory()) {
        checkDirRecursive(fullPath, prefix);
      } else if (item.startsWith(prefix) && item.endsWith('.tsx')) {
        checkFile(fullPath);
      } else if (prefix === '' && item.endsWith('.tsx')) {
        // for balance-sheet where we want to check all files
        checkFile(fullPath);
      }
    }
  };

  // Check specific UI components
  const targetUIFiles = [
    'executive-decision-summary.tsx',
    'executive-execution-plan.tsx',
    'executive-health-summary-card.tsx',
    'executive-metric-card.tsx',
    'executive-section-header.tsx'
  ];
  targetUIFiles.forEach(f => checkFile(path.join(uiPath, f)));

  // Check all balance-sheet files
  checkDirRecursive(bpPath, '');

  if (violations.length > 0) {
    console.error('\n[EXECUTIVE TYPOGRAPHY LOCKDOWN FAILED]');
    violations.forEach(v => console.error(v));
    assert.fail(`${violations.length} desvios tipográficos encontrados na camada executiva.`);
  }
});
