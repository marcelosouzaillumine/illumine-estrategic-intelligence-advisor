import fs from 'fs';
import path from 'path';

function addImport(filePath, importName) {
  let content = fs.readFileSync(filePath, 'utf8');
  // Find the import from '../Common'
  const regex = /import\s+{([^}]+)}\s+from\s+'\.\.\/Common'/;
  const match = content.match(regex);
  if (match) {
    const imports = match[1];
    if (!imports.includes(importName)) {
      const newImports = imports.trim() + `, ${importName}`;
      content = content.replace(regex, `import { ${newImports} } from '../Common'`);
      fs.writeFileSync(filePath, content);
      console.log(`Updated ${filePath} with ${importName}`);
    }
  } else {
      // maybe from '../../Common' ?
      const regex2 = /import\s+{([^}]+)}\s+from\s+'\.\.\/\.\.\/Common'/;
      const match2 = content.match(regex2);
      if (match2) {
        const imports = match2[1];
        if (!imports.includes(importName)) {
          const newImports = imports.trim() + `, ${importName}`;
          content = content.replace(regex2, `import { ${newImports} } from '../../Common'`);
          fs.writeFileSync(filePath, content);
          console.log(`Updated ${filePath} with ${importName}`);
        }
      }
  }
}

addImport('src/components/pages/AxisDashboardPage.tsx', 'KpiCard');
addImport('src/components/pages/GovernanceDashboardPage.tsx', 'KpiCard');
addImport('src/components/pages/IndicatorsPage.tsx', 'KpiValue');
addImport('src/components/pages/PayablesPage.tsx', 'KpiValue');
addImport('src/components/pages/ReceivablesPage.tsx', 'KpiValue');

console.log('Done patch-imports');
