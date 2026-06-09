const fs = require('fs');
const path = require('path');

const targetDir = path.resolve(__dirname, '../src');

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

const consoleRegex = /console\.(log|info|warn|error|debug)\s*\(/g;
const stats = { log: 0, info: 0, warn: 0, error: 0, debug: 0, total: 0 };

console.log('--- Início da Auditoria de Logs Diretos ---');
walkDir(targetDir, (filePath) => {
  if (!filePath.endsWith('.ts') && !filePath.endsWith('.tsx') && !filePath.endsWith('.js') && !filePath.endsWith('.jsx')) return;
  if (filePath.includes('InstitutionalLogger.ts')) return;

  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');
  
  lines.forEach((line, index) => {
    let match;
    // We need to reset lastIndex because it's a global regex
    const regex = new RegExp(/console\.(log|info|warn|error|debug)\s*\(/g);
    while ((match = regex.exec(line)) !== null) {
      const type = match[1];
      stats[type]++;
      stats.total++;
      
      const relativePath = path.relative(process.cwd(), filePath);
      console.log(`[${type.toUpperCase()}] ${relativePath}:${index + 1}`);
      console.log(`  Ocorrência: ${line.trim()}`);
      console.log(`  Sugestão: Substituir por logger.${type}(...)`);
      console.log('---');
    }
  });
});

console.log('Resumo:');
console.table(stats);
console.log('NOTA: Este script está em modo DRY-RUN. Nenhuma alteração foi feita automaticamente.');
