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

  // 1. Revert incorrect label= back to title= for known affected components
  const componentsToRevert = [
    'ExecutiveCallout',
    'ExecutiveNarrative',
    'ExecutiveRiskRow',
    'SemanticCard',
    'ExecutiveTechnicalLayer',
    'ExecutiveActionCard',
    'ExecutiveDistributionCard',
    'ExecutiveInfoCard',
    'ExecutiveInsightCard',
    'ExecutiveRecommendationBlock',
    'ExecutiveStat',
    'StatusBadge',
    'SectionHeader',
    'PageHeader',
    'MarkdownText'
  ];

  componentsToRevert.forEach(comp => {
    // We match the component opening tag and any attributes up to the closing or end of tag
    // Since we don't have AST, we do a simplistic approach:
    // we'll just global replace `<Component ... label=` to `<Component ... title=`
    const regex = new RegExp(`(<${comp}[\\s\\S]*?)\\blabel=`, 'g');
    // iterate safely
    let prev;
    do {
      prev = content;
      content = content.replace(regex, (match, p1) => {
        // Only if it doesn't cross a component boundary
        if (p1.split('<').length > 2) return match; // crossed another tag
        return `${p1}title=`;
      });
    } while (content !== prev);
  });

  // 2. We also saw an issue in FinancialModelingPage with { table: any, title: string }
  content = content.replace(/(<\w+[\s\S]*?)\blabel={/g, (match, p1) => {
     if (p1.includes('ExecutiveMetricCard')) return match;
     if (p1.split('<').length > 2) return match;
     return `${p1}title={`;
  });
  content = content.replace(/(<\w+[\s\S]*?)\blabel="/g, (match, p1) => {
     if (p1.includes('ExecutiveMetricCard')) return match;
     if (p1.split('<').length > 2) return match;
     return `${p1}title="`;
  });

  // 3. Fix ExecutiveMetricCard title= to label=
  let prev;
  do {
    prev = content;
    content = content.replace(/(<ExecutiveMetricCard[\s\S]*?)\btitle=/g, (match, p1) => {
      if (p1.split('<').length > 2) return match; // crossed another tag
      return `${p1}label=`;
    });
  } while (content !== prev);

  // 4. Fix status to tone for ExecutiveMetricCard
  content = content.replace(/(<ExecutiveMetricCard[\s\S]*?)\bstatus="Verde"/g, (match, p1) => {
    if (p1.split('<').length > 2) return match; return `${p1}tone="success"`;
  });
  content = content.replace(/(<ExecutiveMetricCard[\s\S]*?)\bstatus="Amarelo"/g, (match, p1) => {
    if (p1.split('<').length > 2) return match; return `${p1}tone="warning"`;
  });
  content = content.replace(/(<ExecutiveMetricCard[\s\S]*?)\bstatus="Vermelho"/g, (match, p1) => {
    if (p1.split('<').length > 2) return match; return `${p1}tone="critical"`;
  });
  content = content.replace(/(<ExecutiveMetricCard[\s\S]*?)\bstatus="Pendente"/g, (match, p1) => {
    if (p1.split('<').length > 2) return match; return `${p1}tone="neutral"`;
  });
  // Dynamic status mappings:
  content = content.replace(/(<ExecutiveMetricCard[\s\S]*?)\bstatus=\{([^}]+)\}/g, (match, p1, expression) => {
    if (p1.split('<').length > 2) return match; 
    return `${p1}tone={${expression} === 'Verde' ? 'success' : ${expression} === 'Vermelho' ? 'critical' : 'warning'}`;
  });

  if (content !== original) {
    fs.writeFileSync(file, content);
  }
});
console.log('Mess fixed.');
