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

const allFiles = getFiles(path.join(__dirname, 'src')).filter(f => f.endsWith('.tsx') || f.endsWith('.ts'));

allFiles.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let original = content;

  // 1. Revert incorrect label= back to title= for SortableHeader
  let prev;
  do {
    prev = content;
    content = content.replace(/(<SortableHeader[\s\S]*?)\blabel=/g, (match, p1) => {
      if (p1.split('<').length > 2) return match; 
      return `${p1}title=`;
    });
  } while (content !== prev);

  // Revert MetricScore in TaxReformImpactPage
  do {
    prev = content;
    content = content.replace(/(<MetricScore[\s\S]*?)\blabel=/g, (match, p1) => {
      if (p1.split('<').length > 2) return match; 
      return `${p1}title=`;
    });
  } while (content !== prev);

  // Revert MetricCard in PilotMonitoringDashboard
  do {
    prev = content;
    content = content.replace(/(<MetricCard[\s\S]*?)\blabel=/g, (match, p1) => {
      if (p1.split('<').length > 2) return match; 
      return `${p1}title=`;
    });
  } while (content !== prev);

  // 2. Remove noScroll from ExecutiveMetricCard
  content = content.replace(/(<ExecutiveMetricCard[\s\S]*?)\bnoScroll(?:=\{true\}|\b)/g, '$1');

  if (content !== original) {
    fs.writeFileSync(file, content);
  }
});
console.log('Fixed additional mismatches.');
