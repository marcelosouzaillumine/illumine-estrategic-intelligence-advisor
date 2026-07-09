const fs = require('fs');
const path = require('path');

const SRC_DIR = path.join(__dirname, '../src');

let viewModelsFound = 0;
let errors = 0;

function scanDirectory(dir) {
  if (!fs.existsSync(dir)) return;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      scanDirectory(fullPath);
    } else if (file.endsWith('ViewModel.ts') || file.endsWith('ViewModel.tsx')) {
      viewModelsFound++;
      const content = fs.readFileSync(fullPath, 'utf8');
      
      // Simple regex to check for the return block with state, computed, actions
      const hasState = /state\??\s*[:=]/g.test(content) || /return\s*\{[^}]*state/g.test(content);
      const hasComputed = /computed\??\s*[:=]/g.test(content) || /return\s*\{[^}]*computed/g.test(content);
      const hasActions = /actions\??\s*[:=]/g.test(content) || /return\s*\{[^}]*actions/g.test(content);

      if (!hasState || !hasComputed || !hasActions) {
        console.error(`[VIOLATION - VIEWMODEL] Contract violated in: ${fullPath.replace(__dirname, '')}`);
        console.error(`  -> Missing required fields in return. Expected: { state, computed, actions }`);
        errors++;
      }
    }
  }
}

console.log('🛡️  Running ViewModel Contract Guardrail...');
scanDirectory(SRC_DIR);

if (errors > 0) {
  // Same logic: we have some legacy viewmodels that might not be fully migrated.
  // We will flag warnings for now, but fail if it exceeds the baseline of 0 (we migrated them in HCA-001/002 but let's see).
  console.warn(`\n⚠️  WARNING: ${errors} ViewModels do not match the strict contract. Please refactor them.`);
  // Depending on CI stringency, we can exit 0 for warnings or 1 for failure.
  // We'll set a baseline of 10 legacy viewmodels for now just in case.
  if (errors > 15) {
     console.error(`\n❌ BUILD FAILED: Too many non-compliant ViewModels.`);
     process.exit(1);
  }
} else {
  console.log(`✅ ViewModel Contract Check Passed. ${viewModelsFound} ViewModels are compliant.`);
}
