import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '../..');

const SRC_DIR = path.join(ROOT_DIR, 'src');
const RUNTIME_DIR = path.join(SRC_DIR, 'core', 'runtime');
const COMPONENTS_DIR = path.join(SRC_DIR, 'components');

let violations = 0;

function walkDir(dir: string, callback: (filePath: string) => void) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      walkDir(fullPath, callback);
    } else if (fullPath.endsWith('.ts') || fullPath.endsWith('.tsx')) {
      callback(fullPath);
    }
  }
}

console.log("==================================================");
console.log("   RC-1.13B: RUNTIME CONTRACT AUDIT STARTING      ");
console.log("==================================================");

// 1. Audit Runtimes for 'any' and subjective states
walkDir(RUNTIME_DIR, (filePath) => {
  const content = fs.readFileSync(filePath, 'utf8');
  
  // Exclude tests or non-sovereign files if necessary, but we audit all runtimes
  if (content.includes('Record<string, any>')) {
    const whitelist: string[] = [];
  if (!filePath.endsWith('.test.ts') && !filePath.endsWith('.spec.ts') && !filePath.endsWith('-adapter.ts') && !whitelist.some(w => filePath.endsWith(w))) {
      console.error(`[VIOLATION] Found 'Record<string, any>' in ${filePath}`);
      violations++;
    }
  }
  
  if (content.match(/as\s+any/g)) {
    // Tests and adapters are allowed to use `as any` to bridge legacy/mock data to strict types.
    const whitelist: string[] = [];
  if (!filePath.endsWith('.test.ts') && !filePath.endsWith('.spec.ts') && !filePath.endsWith('-adapter.ts') && !whitelist.some(w => filePath.endsWith(w))) {
      console.error(`[VIOLATION] Found 'as any' cast in ${filePath}`);
      violations++;
    }
  }

  if (content.includes('[INSUFFICIENT_DATA]')) {
    console.error(`[VIOLATION] Found legacy '[INSUFFICIENT_DATA]' state in ${filePath}`);
    violations++;
  }

  if (content.match(/Object\.assign\s*\(/)) {
    console.error(`[VIOLATION] Found 'Object.assign' in sovereign report ${filePath}`);
    violations++;
  }
});

// 2. Audit UI Components for Mathematical calculations and logic mutation
walkDir(COMPONENTS_DIR, (filePath) => {
  const content = fs.readFileSync(filePath, 'utf8');

  // React components should not export math functions
  if (content.match(/export\s+(const|function)\s+(calculate|math|sum[A-Z]|multiply)/i)) {
    console.error(`[VIOLATION] Found exported math function in UI Component ${filePath}`);
    violations++;
  }

  // Rudimentary check for hooks doing fiduciary calculations (e.g., useCalculateScore)
  if (content.match(/function\s+useCalculate/i) || content.match(/const\s+useCalculate/i)) {
    console.error(`[VIOLATION] Found fiduciary calculation hook in UI Component ${filePath}`);
    violations++;
  }
});

if (violations > 0) {
  console.log("==================================================");
  console.error(`FAILED: Found ${violations} contract violations.`);
  console.log("==================================================");
  process.exit(1); 
} else {
  console.log("==================================================");
  console.log("SUCCESS: Canonical contracts are respected. Hard-Fail Active.");
  console.log("==================================================");
}
