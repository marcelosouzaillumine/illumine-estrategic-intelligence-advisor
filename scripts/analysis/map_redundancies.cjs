const fs = require('fs');
const path = require('path');

const srcDir = path.resolve(__dirname, '../../src');

function walkDir(dir, fileList = []) {
  if (!fs.existsSync(dir)) return fileList;
  fs.readdirSync(dir).forEach(file => {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      walkDir(filePath, fileList);
    } else {
      fileList.push(filePath);
    }
  });
  return fileList;
}

const allFiles = walkDir(srcDir).filter(f => f.endsWith('.ts') || f.endsWith('.tsx'));

const dependencyMap = {};
const orphans = [];
const possibleDuplicates = {};

// Build mapping
allFiles.forEach(file => {
  const content = fs.readFileSync(file, 'utf-8');
  dependencyMap[file] = content;
  
  const baseName = path.basename(file, path.extname(file));
  if (!possibleDuplicates[baseName]) possibleDuplicates[baseName] = [];
  possibleDuplicates[baseName].push(file);
});

// Check orphans
allFiles.forEach(file => {
  const baseName = path.basename(file, path.extname(file));
  // Skip index files or main App files
  if (baseName === 'index' || baseName === 'App' || baseName === 'main' || baseName === 'vite-env.d') return;

  let isImported = false;
  for (const [otherFile, content] of Object.entries(dependencyMap)) {
    if (otherFile === file) continue;
    // Simple naive check: if the basename is mentioned in the file
    if (content.includes(baseName)) {
      isImported = true;
      break;
    }
  }

  if (!isImported) {
    orphans.push(file);
  }
});

const report = {
  orphans: orphans.map(f => path.relative(process.cwd(), f)),
  duplicates: Object.entries(possibleDuplicates)
    .filter(([_, files]) => files.length > 1)
    .map(([name, files]) => ({
      name,
      paths: files.map(f => path.relative(process.cwd(), f))
    }))
};

fs.writeFileSync(path.resolve(__dirname, '../../docs/architecture/redundancy-audit.json'), JSON.stringify(report, null, 2));
console.log('Auditoria de redundâncias salva em docs/architecture/redundancy-audit.json');
