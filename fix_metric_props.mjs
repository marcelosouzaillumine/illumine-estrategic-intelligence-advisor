import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function getFiles(dir) {
  const subdirs = fs.readdirSync(dir);
  const files = subdirs.map((subdir) => {
    const res = path.resolve(dir, subdir);
    return fs.statSync(res).isDirectory() ? getFiles(res) : res;
  });
  return files.reduce((a, f) => a.concat(f), []);
}

const allFiles = getFiles(path.join(__dirname, 'src/components')).filter(f => f.endsWith('.tsx'));

let updated = 0;
allFiles.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let original = content;

  // Replace title= with label= for ExecutiveMetricCard
  // We match <ExecutiveMetricCard ... title="..." ... />
  // Since JSX can span multiple lines, we can just replace ' title=' with ' label=' 
  // ONLY if it's inside an ExecutiveMetricCard. 
  // An easier way: just globally replace ` title=` with ` label=` when preceded by `<ExecutiveMetricCard`? That's tricky.
  // Let's do a simple replace since it's a known format:
  content = content.replace(/(<ExecutiveMetricCard[\s\S]*?)\btitle=/g, '$1label=');
  
  // Replace suffix=
  content = content.replace(/(<ExecutiveMetricCard[\s\S]*?)\bsuffix=\{.*?\}/g, '$1');
  content = content.replace(/(<ExecutiveMetricCard[\s\S]*?)\bsuffix=".*?"/g, '$1');

  // Replace status= with tone= and map the values
  content = content.replace(/(<ExecutiveMetricCard[\s\S]*?)\bstatus="Verde"/g, '$1tone="success"');
  content = content.replace(/(<ExecutiveMetricCard[\s\S]*?)\bstatus="Amarelo"/g, '$1tone="warning"');
  content = content.replace(/(<ExecutiveMetricCard[\s\S]*?)\bstatus="Vermelho"/g, '$1tone="critical"');
  content = content.replace(/(<ExecutiveMetricCard[\s\S]*?)\bstatus="Pendente"/g, '$1tone="neutral"');
  
  // Dynamic status mappings:
  content = content.replace(/(<ExecutiveMetricCard[\s\S]*?)\bstatus=\{([^}]+)\}/g, (match, p1, expression) => {
    // try to inline a map
    return `${p1}tone={${expression} === 'Verde' ? 'success' : ${expression} === 'Vermelho' ? 'critical' : 'warning'}`;
  });

  if (content !== original) {
    fs.writeFileSync(file, content);
    console.log(`Fixed ${path.relative(__dirname, file)}`);
    updated++;
  }
});
console.log(`Updated ${updated} files.`);
