import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const pagesDir = path.join(__dirname, 'src/components/pages');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

walkDir(pagesDir, (filePath) => {
  if (filePath.endsWith('.tsx') || filePath.endsWith('.ts')) {
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;
    
    // Fix suffix ONLY inside <ExecutiveMetricCard>
    const regex = /<ExecutiveMetricCard([^>]*?)>/g;
    content = content.replace(regex, (match) => {
      // Find suffix="R$" or suffix="%"
      const suffixMatch = match.match(/suffix=(["'])(.*?)\1/);
      if (suffixMatch) {
        const suffix = suffixMatch[2];
        const hasPrefix = suffix === 'R$';
        
        // Find value={}
        const valueMatch = match.match(/value=\{([^}]+)\}/);
        if (valueMatch) {
          const valInner = valueMatch[1];
          let newVal;
          if (hasPrefix) {
             newVal = `value={\`R$ \${${valInner}}\`}`;
          } else {
             newVal = `value={\`\${${valInner}}${suffix}\`}`;
          }
          // Replace value
          let updated = match.replace(/value=\{[^}]+\}/, newVal);
          // Remove suffix
          updated = updated.replace(/\s*suffix=(["']).*?\1/, '');
          return updated;
        }
        
        // Find value="literal"
        const valueLitMatch = match.match(/value=(["'])(.*?)\1/);
        if (valueLitMatch) {
          const valLit = valueLitMatch[2];
          let newVal;
          if (hasPrefix) {
             newVal = `value="R$ ${valLit}"`;
          } else {
             newVal = `value="${valLit}${suffix}"`;
          }
          let updated = match.replace(/value=(["']).*?\1/, newVal);
          updated = updated.replace(/\s*suffix=(["']).*?\1/, '');
          return updated;
        }
      }
      return match;
    });

    // Remove KpiCard and KpiValue from import statements strictly
    const importRegex = /^import\s*\{([^}]+)\}\s*from\s*['"](.*?)['"];?$/gm;
    content = content.replace(importRegex, (match, imports, fromModule) => {
       let updatedImports = imports.split(',').map(s => s.trim()).filter(s => s && s !== 'KpiCard' && s !== 'KpiValue' && s !== 'KpiCardModeling');
       if (updatedImports.length === 0) return '';
       return `import { ${updatedImports.join(', ')} } from '${fromModule}';`;
    });
    
    // Remove ExecutiveDecisionSummaryProps error in dre/ pages
    if (filePath.includes('ExecutiveDecisionSummary') || content.includes('ExecutiveDecisionSummary')) {
       // ExecutiveDecisionSummary expects label instead of severityLabel? 
       // Actually let's just replace severityLabel= with label=
       content = content.replace(/severityLabel=/g, 'label=');
    }

    if (content !== original) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log('Fixed', path.basename(filePath));
    }
  }
});
