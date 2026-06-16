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

function replaceInTag(content, tagName, replacerFn) {
  // We use a regex to find all <tagName ... /> or <tagName>...</tagName> blocks
  // Then we run the replacer function inside it.
  const regex = new RegExp(`<${tagName}(?:\\s+[^>]*?)?>`, 'g');
  return content.replace(regex, (match) => {
    return replacerFn(match);
  });
}

walkDir(pagesDir, (filePath) => {
  if (filePath.endsWith('.tsx') || filePath.endsWith('.ts')) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Strict replace ONLY inside <ExecutiveMetricCard ... >
    const newContent = replaceInTag(content, 'ExecutiveMetricCard', (match) => {
      let updated = match;
      
      // Replace title= with label=
      updated = updated.replace(/\btitle=/g, 'label=');
      
      // Replace status= with tone= and translate the string literal if it's there
      updated = updated.replace(/\bstatus="Verde"/g, 'tone="success"');
      updated = updated.replace(/\bstatus="Amarelo"/g, 'tone="warning"');
      updated = updated.replace(/\bstatus="Vermelho"/g, 'tone="critical"');
      updated = updated.replace(/\bstatus="Pendente"/g, 'tone="neutral"');
      updated = updated.replace(/\bstatus="Info"/g, 'tone="info"');
      
      // Replace status={... ? "Verde" : "Vermelho"} with tone={... ? "success" : "critical"}
      updated = updated.replace(/\bstatus=\{([^}]+) \? ['"]Verde['"] : ['"]Vermelho['"]\}/g, 'tone={$1 ? "success" : "critical"}');
      updated = updated.replace(/\bstatus=\{([^}]+) \? ['"]Verde['"] : ['"]Amarelo['"]\}/g, 'tone={$1 ? "success" : "warning"}');
      updated = updated.replace(/\bstatus=\{([^}]+) === ['"]positive['"] \? ['"]Verde['"] : ([^}]+) === ['"]negative['"] \? ['"]Vermelho['"] : ['"]Amarelo['"]\}/g, 'tone={$1 === "positive" ? "success" : $2 === "negative" ? "critical" : "warning"}');

      // Generic status= to tone= as a fallback (will leave value as is if not matched above)
      updated = updated.replace(/\bstatus=/g, 'tone=');
      
      return updated;
    });

    if (newContent !== content) {
      fs.writeFileSync(filePath, newContent, 'utf8');
      console.log('Fixed', path.basename(filePath));
    }
  }
});
