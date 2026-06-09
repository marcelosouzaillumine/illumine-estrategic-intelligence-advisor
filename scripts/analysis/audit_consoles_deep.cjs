const fs = require('fs');
const path = require('path');

const targetDir = path.resolve(__dirname, '../../src');

function walkDir(dir, callback) {
  if (!fs.existsSync(dir)) return;
  fs.readdirSync(dir).forEach(f => {
    const dirPath = path.join(dir, f);
    const isDirectory = fs.statSync(dirPath).isDirectory();
    if (isDirectory) {
      walkDir(dirPath, callback);
    } else {
      callback(path.join(dir, f));
    }
  });
}

const consoleRegex = /console\.(log|info|warn|error|debug)\s*\(([\s\S]*?)\)/g;
const stats = { log: 0, info: 0, warn: 0, error: 0, debug: 0, total: 0 };
const occurrences = [];

walkDir(targetDir, (filePath) => {
  if (!filePath.endsWith('.ts') && !filePath.endsWith('.tsx') && !filePath.endsWith('.js') && !filePath.endsWith('.jsx')) return;
  if (filePath.includes('InstitutionalLogger.ts')) return;

  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');
  
  lines.forEach((line, index) => {
    let match;
    const regex = new RegExp(/console\.(log|info|warn|error|debug)\s*\((.*)\)/g);
    while ((match = regex.exec(line)) !== null) {
      const type = match[1];
      const args = match[2];
      stats[type]++;
      stats.total++;
      
      const relativePath = path.relative(process.cwd(), filePath);
      
      let category = 'Geral';
      if (args.toLowerCase().includes('error') || args.toLowerCase().includes('err')) category = 'Error Handling';
      if (args.toLowerCase().includes('dre') || args.toLowerCase().includes('financial') || args.toLowerCase().includes('bp')) category = 'Financeiro/Sensível';
      if (args.toLowerCase().includes('token') || args.toLowerCase().includes('auth') || args.toLowerCase().includes('role')) category = 'Segurança/Auth';
      
      occurrences.push({
        file: relativePath,
        line: index + 1,
        type: type,
        category: category,
        content: line.trim()
      });
    }
  });
});

// Write full JSON
const jsonPath = path.resolve(__dirname, '../../docs/architecture/console-audit-full.json');
fs.writeFileSync(jsonPath, JSON.stringify({ stats, occurrences }, null, 2));

// Write Top 50 summary markdown
const criticalOccurrences = occurrences.filter(o => o.category === 'Financeiro/Sensível' || o.category === 'Segurança/Auth').slice(0, 50);
const summaryPath = path.resolve(__dirname, '../../docs/architecture/console-audit-summary.md');

let md = `# Console Audit Summary\n\n## Estatísticas\n`;
md += `- **Logs Totais:** ${stats.total}\n`;
md += `- **console.error:** ${stats.error}\n`;
md += `- **console.log:** ${stats.log}\n`;
md += `- **console.warn:** ${stats.warn}\n\n`;

md += `## Top 50 Ocorrências Críticas (Dados Financeiros ou Segurança)\n\n`;
criticalOccurrences.forEach(o => {
  md += `- **[${o.category}]** \`${o.file}:${o.line}\`\n  \`${o.content}\`\n`;
});

fs.writeFileSync(summaryPath, md);
console.log('Arquivos de auditoria gerados em docs/architecture/');
