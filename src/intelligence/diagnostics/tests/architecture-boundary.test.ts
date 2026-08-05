import { describe, it, expect } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';

// Core directories that should NOT contain hardcoded domain strings.
const CORE_DIRECTORIES = [
  'src/intelligence/executive-operating-model',
  'src/intelligence/executive-profile',
  'src/services',
  'src/intelligence/diagnostics/core',
  'src/components/advisory'
];

// Files that ARE allowed to know about domains (The registry, graph, tests, etc.)
const WHITELISTED_FILES = [
  'diagnostic-types.ts', 
  'domain-registry.ts', 
  'executive-domain-graph.ts',
  'portfolio-summary.test.ts',
  'executive-narrative.test.ts'
];

// Domains we are testing for hardcoding
const DOMAINS = ['financial', 'governance', 'operational', 'commercial'];

function getAllFiles(dirPath: string, arrayOfFiles: string[] = []) {
  const files = fs.readdirSync(dirPath);

  files.forEach(function(file) {
    if (fs.statSync(dirPath + "/" + file).isDirectory()) {
      arrayOfFiles = getAllFiles(dirPath + "/" + file, arrayOfFiles);
    } else {
      // Only check ts/tsx
      if (file.endsWith('.ts') || file.endsWith('.tsx')) {
        arrayOfFiles.push(path.join(dirPath, "/", file));
      }
    }
  });

  return arrayOfFiles;
}

describe('Gate 0 & 1: Architecture Boundary & Dependency Certification', () => {
  it('Should not contain any hardcoded references to specific domains in the Core engines', () => {
    
    let violations: string[] = [];

    for (const dir of CORE_DIRECTORIES) {
      const fullPath = path.resolve(process.cwd(), dir);
      if (!fs.existsSync(fullPath)) continue;

      const files = getAllFiles(fullPath);

      for (const file of files) {
        const basename = path.basename(file);
        if (WHITELISTED_FILES.includes(basename)) continue;

        const content = fs.readFileSync(file, 'utf-8');

        // We check if the content contains any of the domains explicitly.
        // We use a regex to match the exact word to avoid matching things like "financials" if we only banned "financial", 
        // but for safety we will just match the substring and exclude known safe contexts.
        for (const domain of DOMAINS) {
          const regex = new RegExp(`\\b${domain}\\b`, 'i');
          if (regex.test(content)) {
            // Check if it's an import from a specific domain (e.g. from '../diagnostics/financial/...')
            const importRegex = new RegExp(`import.*from.*${domain}.*`, 'i');
            if (importRegex.test(content)) {
                violations.push(`[Dependency Violation] ${basename} imports from ${domain} domain.`);
            } else {
                violations.push(`[Boundary Violation] ${basename} contains hardcoded reference to '${domain}'.`);
            }
          }
        }
      }
    }

    // Print all violations for debugging
    if (violations.length > 0) {
      console.log('Architecture Boundary Violations found:\n' + violations.join('\n'));
    }

    expect(violations.length).toBe(0);
  });
});
