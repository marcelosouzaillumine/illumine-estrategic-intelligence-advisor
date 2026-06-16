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

function removeSuffix(content) {
  // Turn <ExecutiveMetricCard ... value={val} suffix="R$" ... />
  // into value={`R$ ${val}`} or value={`${val}%`}
  return content.replace(/(<ExecutiveMetricCard[\s\S]*?)value=\{([^}]+)\}([\s\n]*)suffix="([^"]+)"/g, (match, p1, p2, p3, p4) => {
    let newVal = p4 === 'R$' ? `\`R$ \${${p2}}\`` : `\`\${${p2}}${p4}\``;
    return `${p1}value={${newVal}}${p3}`;
  });
}

function removeKpiImports(content) {
  let newContent = content.replace(/,?\s*KpiCard/g, '');
  newContent = newContent.replace(/KpiCard\s*,?/g, '');
  newContent = newContent.replace(/,?\s*KpiValue/g, '');
  newContent = newContent.replace(/KpiValue\s*,?/g, '');
  newContent = newContent.replace(/import\s*\{\s*\}\s*from\s*['"]\.\.\/Common['"];?\n?/g, '');
  newContent = newContent.replace(/import\s*\{\s*\}\s*from\s*['"]\.\.\/\.\.\/Common['"];?\n?/g, '');
  return newContent;
}

walkDir(pagesDir, (filePath) => {
  if (filePath.endsWith('.tsx') || filePath.endsWith('.ts')) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Fix suffix
    let updated = removeSuffix(content);
    
    // Fix KpiCard and KpiValue imports
    updated = removeKpiImports(updated);
    
    // Fix severityLabel -> label for ExecutiveDecisionSummary
    if (updated.includes('severityLabel=')) {
      updated = updated.replace(/severityLabel=/g, 'label=');
    }
    
    // Fix "Neutro" and "Verde" tones
    updated = updated.replace(/tone="Neutro"/g, 'tone="neutral"');
    updated = updated.replace(/tone="Verde"/g, 'tone="success"');
    
    if (updated !== content) {
      fs.writeFileSync(filePath, updated, 'utf8');
      console.log('Fixed', path.basename(filePath));
    }
  }
});
