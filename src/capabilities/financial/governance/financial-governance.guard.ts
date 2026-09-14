/**
 * Illumine OS™ Architecture Governance Guard
 * Financial Governance Guard Scanner (CFDI v2.1)
 * 
 * Level 1: Static Forbidden Patterns (legacy property aliases outside CanonicalFinancialNormalizer.ts)
 * Level 2: Architecture Dependency Rules (UI components importing persistence adapters directly)
 * Level 3: Runtime Integrity Rules (Synthetic data attempts / un-orchestrated mocks)
 */

import * as fs from 'fs';
import * as path from 'path';

export interface GuardViolation {
  file: string;
  line: number;
  level: 'LEVEL_1' | 'LEVEL_2' | 'LEVEL_3';
  code: string;
  message: string;
}

export class FinancialGovernanceGuard {
  private static workspaceRoot = process.cwd();

  public static runScan(): GuardViolation[] {
    const violations: GuardViolation[] = [];
    const srcDir = path.join(this.workspaceRoot, 'src');

    const files = this.getAllTsFiles(srcDir);

    files.forEach(file => {
      const relPath = path.relative(this.workspaceRoot, file);
      // Skip the Normalizer itself and test files from Level 1 scanner
      const isNormalizer = relPath.includes('CanonicalFinancialNormalizer.ts');
      const isTestFile = relPath.includes('.test.') || relPath.includes('.spec.');
      const isGuardFile = relPath.includes('financial-governance.guard.ts');

      if (isNormalizer || isGuardFile) return;

      const content = fs.readFileSync(file, 'utf8');
      const lines = content.split('\n');

      lines.forEach((lineText, idx) => {
        const lineNum = idx + 1;

        // Level 1: Static Forbidden Pattern check for legacy aliases (only in non-test runtime files)
        if (!isTestFile) {
          if (lineText.match(/\.(valor|val)\b/) && !lineText.includes('// legacy-ok')) {
            violations.push({
              file: relPath,
              line: lineNum,
              level: 'LEVEL_1',
              code: 'FIN-005',
              message: `Legacy property alias '.valor/.val' detected outside CanonicalFinancialNormalizer.`
            });
          }
        }

        // Level 2: Architecture Dependency Rule (UI components directly importing Firestore adapters)
        if (relPath.startsWith('src/components/pages/') && !isTestFile) {
          if (lineText.includes('FirestoreFinancialEntriesAdapter')) {
            violations.push({
              file: relPath,
              line: lineNum,
              level: 'LEVEL_2',
              code: 'FIN-003',
              message: `UI Page Component '${path.basename(file)}' directly imports FirestoreFinancialEntriesAdapter instead of CertifiedFinancialDataset.`
            });
          }
        }

        // Level 3: Runtime Integrity Rule (Synthetic data attempt)
        if (lineText.includes('mockFinancialData') || lineText.includes('generateSampleFinancial')) {
          violations.push({
            file: relPath,
            line: lineNum,
            level: 'LEVEL_3',
            code: 'FIN-006',
            message: `Synthetic financial data fallback function '${lineText.trim()}' detected.`
          });
        }
      });
    });

    return violations;
  }

  private static getAllTsFiles(dir: string): string[] {
    let results: string[] = [];
    if (!fs.existsSync(dir)) return results;
    const list = fs.readdirSync(dir);
    list.forEach(file => {
      const fullPath = path.join(dir, file);
      const stat = fs.statSync(fullPath);
      if (stat && stat.isDirectory()) {
        if (!file.startsWith('.')) {
          results = results.concat(this.getAllTsFiles(fullPath));
        }
      } else if (file.endsWith('.ts') || file.endsWith('.tsx')) {
        results.push(fullPath);
      }
    });
    return results;
  }
}

// CLI Execution entrypoint
console.log('🔍 Executing Financial Governance Guard Scanner (CFDI v2.1)...');
const violations = FinancialGovernanceGuard.runScan();
if (violations.length > 0) {
  console.warn(`⚠️  Financial Governance Guard detected ${violations.length} warnings/violations:`);
  violations.forEach(v => {
    console.warn(`  [${v.level}] ${v.code} (${v.file}:${v.line}): ${v.message}`);
  });
  console.log('✅ Financial Governance Guard Scan completed with reported telemetry.');
} else {
  console.log('✅ Financial Governance Guard: 0 architecture violations found. Clean scan.');
}
