const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const files = execSync("grep -rlE 'Intl\\.NumberFormat|toLocaleString|Intl\\.DateTimeFormat' src/components/").toString().split('\n').filter(Boolean);

let modifiedCount = 0;

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  let original = content;

  // 1. Replacements for new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val)
  content = content.replace(/new Intl\.NumberFormat\([^)]+\)\.format\(([^)]+)\)/g, 'formatter.currency($1)');

  // 2. Replacements for toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
  content = content.replace(/\.toLocaleString\(['"][^'"]+['"]\s*,\s*\{[^}]*style:\s*['"]currency['"][^}]*\}\)/g, '.toLocaleString() /* TODO: currency */');
  
  // 3. Replacements for toLocaleString('pt-BR') or toLocaleString() inside R$ {}
  content = content.replace(/R\$\s*\{([^}]+)\.toLocaleString\([^)]*\)\}/g, 'R\\$ \\{formatter.currency($1, { currencyDisplay: "code" }).replace("BRL", "").trim()\\}');
  content = content.replace(/\{([^}]+)\.toLocaleString\([^)]*\)\}/g, '{formatter.number($1)}');

  // 4. Replacements for new Intl.DateTimeFormat(...).format(...)
  content = content.replace(/new Intl\.DateTimeFormat\([^)]+\)\.format\(([^)]+)\)/g, 'formatter.date($1)');

  // 5. Replacements for new Date(...).toLocaleString()
  content = content.replace(/new Date\(([^)]+)\)\.toLocaleString\([^)]*\)/g, 'formatter.date($1)');

  if (content !== original) {
    // We need to inject the import and the hook.
    // Try to find the last import
    if (!content.includes('useExecutiveFormatter')) {
      const importMatches = [...content.matchAll(/^import /gm)];
      if (importMatches.length > 0) {
        const lastImport = importMatches[importMatches.length - 1];
        const endOfLine = content.indexOf('\n', lastImport.index);
        
        // Calculate relative path to src/core/localization
        const depth = file.split('/').length - 2; // src/components/...
        const relativePath = '../'.repeat(depth) + 'core/localization';
        
        content = content.substring(0, endOfLine + 1) + `import { useExecutiveFormatter } from '${relativePath}';\n` + content.substring(endOfLine + 1);
      }
    }

    // Try to inject the hook inside the main exported component
    if (!content.includes('const formatter = useExecutiveFormatter()')) {
      // Find export function ComponentName or export const ComponentName =
      const funcMatch = content.match(/export (?:default )?function ([A-Z][a-zA-Z0-9_]*)\s*\([^)]*\)\s*\{/);
      const arrowMatch = content.match(/export (?:default )?const ([A-Z][a-zA-Z0-9_]*)\s*=\s*(?:\([^)]*\)|[^=]+)\s*=>\s*\{/);
      
      let injected = false;
      if (funcMatch) {
        const insertPos = funcMatch.index + funcMatch[0].length;
        content = content.substring(0, insertPos) + '\n  const formatter = useExecutiveFormatter();' + content.substring(insertPos);
        injected = true;
      } else if (arrowMatch) {
        const insertPos = arrowMatch.index + arrowMatch[0].length;
        content = content.substring(0, insertPos) + '\n  const formatter = useExecutiveFormatter();' + content.substring(insertPos);
        injected = true;
      }
      
      if (!injected) {
        console.log('Could not inject hook in', file);
      }
    }
    
    fs.writeFileSync(file, content, 'utf8');
    modifiedCount++;
  }
}

console.log(`Modified ${modifiedCount} files.`);
