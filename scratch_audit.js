const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');

const metrics = {
  totalPages: 0,
  pagesWithDrift: [],
  pagesWithDirectImports: [],
  viewModelsTotal: 0,
  viewModelsNonCompliant: [],
};

const regexHooks = /use(State|Effect|Memo|Callback)\b/g;
const regexDirectImports = /from\s+['"](firebase|.*Firebase.*|.*ClientIntelligence.*|.*Runtime.*|.*BrasilAPI.*)['"]/g;

function walkDir(dir, callback) {
  if (!fs.existsSync(dir)) return;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      walkDir(fullPath, callback);
    } else {
      callback(fullPath);
    }
  }
}

const dirsToCheck = [
  path.join(srcDir, 'components/pages'),
  path.join(srcDir, 'components/executive'),
  path.join(srcDir, 'components/advisor'),
  path.join(srcDir, 'components/cognitive'),
  path.join(srcDir, 'components/war-room'),
];

dirsToCheck.forEach(dir => {
  walkDir(dir, (filePath) => {
    if (filePath.endsWith('.tsx') || filePath.endsWith('.ts')) {
      const content = fs.readFileSync(filePath, 'utf8');
      
      if (filePath.endsWith('Page.tsx') || filePath.includes('/executive/') || filePath.includes('/pages/')) {
        // Exclude test files, viewmodels, services
        if (filePath.includes('.test.') || filePath.includes('ViewModel') || filePath.includes('Service') || filePath.includes('Application')) return;
        
        // This is a UI component / Page
        metrics.totalPages++;
        
        let hasDrift = false;
        let hasImports = false;

        if (regexHooks.test(content)) {
          metrics.pagesWithDrift.push(filePath.replace(srcDir, ''));
        }

        if (regexDirectImports.test(content)) {
          metrics.pagesWithDirectImports.push(filePath.replace(srcDir, ''));
        }
      }

      if (filePath.includes('ViewModel.ts')) {
        metrics.viewModelsTotal++;
        if (!content.includes('state:') || !content.includes('actions:')) {
          metrics.viewModelsNonCompliant.push(filePath.replace(srcDir, ''));
        }
      }
    }
  });
});

fs.writeFileSync('hca_final_audit.json', JSON.stringify(metrics, null, 2));
console.log('Audit complete.');
