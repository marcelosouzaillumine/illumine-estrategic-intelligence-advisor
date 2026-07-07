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

walkDir(srcDir, (filePath) => {
  if (filePath.endsWith('.tsx') || filePath.endsWith('.ts')) {
    const content = fs.readFileSync(filePath, 'utf8');
    
    // UI components
    if (filePath.includes('/pages/') || filePath.includes('/executive/') || filePath.includes('/advisor/') || filePath.includes('/cognitive/') || filePath.includes('/war-room/')) {
      if (filePath.endsWith('.tsx') && !filePath.includes('.test.')) {
        metrics.totalPages++;
        
        if (regexHooks.test(content)) {
          metrics.pagesWithDrift.push(filePath.replace(srcDir, ''));
        }

        if (regexDirectImports.test(content)) {
          metrics.pagesWithDirectImports.push(filePath.replace(srcDir, ''));
        }
      }
    }

    // ViewModels
    if (filePath.includes('ViewModel.ts') || filePath.includes('use') && filePath.includes('ViewModel')) {
      if (!filePath.includes('.test.')) {
        metrics.viewModelsTotal++;
        if (!content.includes('state') || !content.includes('actions')) {
          metrics.viewModelsNonCompliant.push(filePath.replace(srcDir, ''));
        }
      }
    }
  }
});

fs.writeFileSync('hca_final_audit2.json', JSON.stringify(metrics, null, 2));
console.log('Audit 2 complete.');
