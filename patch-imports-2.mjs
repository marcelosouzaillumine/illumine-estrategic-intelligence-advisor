import fs from 'fs';
import path from 'path';

function addImport(filePath, importName, fromPath) {
  let content = fs.readFileSync(filePath, 'utf8');
  if (!content.includes(importName)) {
    const newImport = `import { ${importName} } from '${fromPath}';\n`;
    content = newImport + content;
    fs.writeFileSync(filePath, content);
    console.log(`Updated ${filePath} with ${importName}`);
  }
}

addImport('src/components/pages/AxisDashboardPage.tsx', 'ExecutiveMetricCard', '../ui/executive-metric-card');

console.log('Done patch-imports 2');
