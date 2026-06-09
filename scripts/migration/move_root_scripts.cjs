const fs = require('fs');
const path = require('path');

const rootDir = process.cwd();

// Vital files to skip completely
const skipFiles = [
  'vite.config.ts',
  'tailwind.config.js',
  'postcss.config.js',
  'jest.config.js',
  'firebase.json',
  'firestore.rules',
  'storage.rules',
  '.firebaserc',
  'package.json',
  'package-lock.json',
  'AGENTS.md',
  'README.md',
  'RELEASE_GATE.md',
  'ROLLBACK_PLAN.md',
  'STAGING_SETUP.md'
];

function getTargetDir(filename) {
  if (filename.endsWith('.py') || filename.endsWith('.sh') || filename.endsWith('.txt')) {
    return 'scripts/legacy';
  }
  
  if (filename.match(/^(fix|replace|update|patch|auto_fix|rewrite)_/i) || filename.match(/^(fix|patch)\./i)) {
    return 'scripts/repair';
  }

  if (filename.match(/^(test_|test-|run_test|scratch)/i)) {
    return 'scripts/legacy';
  }

  if (filename.match(/^(check|debug|verify|fetch|delete|read|query|find)_/i)) {
    return 'scripts/analysis';
  }

  // Default fallback for remaining scripts
  return 'scripts/legacy';
}

const files = fs.readdirSync(rootDir);

let movedCount = 0;

console.log('Starting migration of root scripts...');

files.forEach(file => {
  const ext = path.extname(file);
  const isScript = ['.js', '.cjs', '.mjs', '.ts', '.tsx', '.py', '.sh'].includes(ext);
  
  if (isScript && !skipFiles.includes(file) && fs.statSync(file).isFile()) {
    // Check if the file name has 'config' in it, which might be a vital file
    if (file.toLowerCase().includes('config')) {
      console.log(`Skipping potential config file: ${file}`);
      return;
    }

    const targetDir = getTargetDir(file);
    const targetPath = path.join(rootDir, targetDir, file);
    
    fs.renameSync(file, targetPath);
    console.log(`Moved ${file} -> ${targetDir}/${file}`);
    movedCount++;
  }
});

console.log(`Successfully moved ${movedCount} files.`);
