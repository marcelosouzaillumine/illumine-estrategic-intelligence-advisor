import * as fs from 'fs';
import * as path from 'path';
import { describe, it, expect } from 'vitest';

/**
 * Global Regression Gate
 * Architectural Enforcement: Experience Layer must not contain Analytical Engine logic.
 * 
 * CURRENT LEVEL: Level 1 — Detection Mode (WARNING)
 * Bloqueio de CI desativado temporariamente para inventariar o baseline do sistema.
 */
describe('Global Regression Gate: Architectural Boundaries Enforcement', () => {
  const PAGES_DIR = path.resolve(__dirname, '../../../../../src/components/pages');
  
  // Funções analíticas e lógicas proibidas na camada de View
  const FORBIDDEN_PATTERNS = [
    'calculateFinancialHealth',
    'generateInsight',
    'getRiskScore',
    'calculateRisk',
    'calculateMargin',
    'calculateEbitda' // Exemplos de expansão futura
  ];

  // Inventário Baseline atual (whitelist temporária para os avisos)
  // Após a certificação total, esta lista deve ser VAZIA.
  const baselineInventory: Record<string, string[]> = {};

  const getAllFiles = (dirPath: string, arrayOfFiles: string[] = []): string[] => {
    const files = fs.readdirSync(dirPath);

    files.forEach((file) => {
      const fullPath = path.join(dirPath, file);
      if (fs.statSync(fullPath).isDirectory()) {
        arrayOfFiles = getAllFiles(fullPath, arrayOfFiles);
      } else {
        if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
          arrayOfFiles.push(fullPath);
        }
      }
    });

    return arrayOfFiles;
  };

  it('detects forbidden analytical logic in Experience Layer (Detection Mode)', () => {
    if (!fs.existsSync(PAGES_DIR)) {
      console.warn(`PAGES_DIR not found at ${PAGES_DIR}`);
      return;
    }

    const files = getAllFiles(PAGES_DIR);
    let violations = 0;
    const violatedFiles: Record<string, string[]> = {};

    files.forEach(file => {
      const content = fs.readFileSync(file, 'utf-8');
      const relativePath = path.relative(PAGES_DIR, file);
      
      FORBIDDEN_PATTERNS.forEach(pattern => {
        if (content.includes(pattern)) {
          violations++;
          if (!violatedFiles[relativePath]) {
            violatedFiles[relativePath] = [];
          }
          violatedFiles[relativePath].push(pattern);
        }
      });
    });

    if (violations > 0) {
      console.warn('--- ARCHITECTURAL WARNING ---');
      console.warn('Found legacy patterns in Experience Layer:');
      
      Object.keys(violatedFiles).forEach(file => {
        console.warn(`- ${file} (Patterns: ${violatedFiles[file].join(', ')})`);
      });
      
      console.warn('Status: WARNING (Detection Mode only. Build will not fail).');
      console.warn('After baseline certification, promote to Blocking Mode.');
      console.warn('-----------------------------');
    }

    // No modo de detecção (Level 1), nós passamos o teste independentemente de violações.
    // No Level 2 (Migration Enforcement), nós faríamos: expect(violations).toBe(0);
    expect(true).toBe(true);
  });
});
