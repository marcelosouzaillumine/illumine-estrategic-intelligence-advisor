// src/scripts/runDemoIsolationAudit.ts

import * as fs from 'fs';
import * as path from 'path';

function runDemoIsolationAudit() {
  console.log('▶ Starting Demo Isolation & Fiduciary Sandboxing Audit...');

  const srcDir = path.resolve(process.cwd(), 'src');
  if (!fs.existsSync(srcDir)) {
    console.error(`Error: Directory ${srcDir} does not exist.`);
    process.exit(1);
  }

  const violations: string[] = [];

  const getFilesRecursive = (dir: string, fileList: string[]) => {
    const list = fs.readdirSync(dir);
    list.forEach(file => {
      const fullPath = path.join(dir, file);
      const stat = fs.statSync(fullPath);
      if (stat && stat.isDirectory()) {
        getFilesRecursive(fullPath, fileList);
      } else {
        if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
          fileList.push(fullPath);
        }
      }
    });
  };

  const allSrcFiles: string[] = [];
  getFilesRecursive(srcDir, allSrcFiles);

  for (const filePath of allSrcFiles) {
    const relativePath = path.relative(process.cwd(), filePath);
    const content = fs.readFileSync(filePath, 'utf8');

    // Skip the demo directory itself
    if (relativePath.startsWith(path.join('src', 'demo-runtime'))) {
      continue;
    }

    // Skip routes.tsx for page registration ONLY
    if (relativePath === path.join('src', 'app', 'routes.tsx')) {
      // routes.tsx can import DemoContinuityCockpitPage and DemoScenarioProvider, but not MockFactory
      if (content.includes('DemoMockFactory')) {
        violations.push(`Violation in ${relativePath}: Production routes must NOT import DemoMockFactory.`);
      }
      continue;
    }

    // Skip the scripts directory itself since they perform the audit
    if (relativePath.startsWith(path.join('src', 'scripts'))) {
      continue;
    }

    // Rule 1: No imports of demo-runtime inside production code
    if (content.includes('demo-runtime') || content.includes('DemoMockFactory') || content.includes('DemoScenarioProvider') || content.includes('DemoContinuityCockpitPage')) {
      violations.push(`Violation in ${relativePath}: Production file imports or references sandbox demo symbols ('demo-runtime', 'DemoMockFactory', 'DemoScenarioProvider', 'DemoContinuityCockpitPage').`);
    }

    // Rule 2: No mock scenario hooks/providers in institutional pages
    if (content.includes('<DemoScenarioProvider') || content.includes('useDemoScenario')) {
      violations.push(`Violation in ${relativePath}: Production file uses simulated scenario provider or hook.`);
    }
  }

  if (violations.length > 0) {
    console.error('\n❌ Demo Isolation Audit FAILED:');
    violations.forEach(v => console.error(`  - ${v}`));
    process.exit(1);
  }

  console.log('✅ Demo Isolation Audit PASSED: Simulation layer fully segregated from production runtime tree.');
  process.exit(0);
}

runDemoIsolationAudit();
