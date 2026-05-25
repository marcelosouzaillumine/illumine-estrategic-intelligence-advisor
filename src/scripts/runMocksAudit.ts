import fs from 'fs';
import path from 'path';

// This script only reports findings, it does not modify files.

interface Finding {
  file: string;
  risk: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  recommendation: string;
  action: string;
}

const findings: Finding[] = [];

function scanDirectory(dir: string) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      if (file !== 'node_modules' && file !== '.git' && file !== 'dist' && file !== 'tests' && file !== 'scripts') {
        scanDirectory(fullPath);
      }
    } else if (fullPath.endsWith('.ts') || fullPath.endsWith('.tsx')) {
      // Ignore type declaration files or explicit safe mocks if any
      const content = fs.readFileSync(fullPath, 'utf-8');
      
      const fileNameLower = file.toLowerCase();
      const hasMockInName = fileNameLower.includes('mock');
      
      if (hasMockInName) {
        findings.push({
          file: fullPath,
          risk: `Arquivo com nomenclatura de mock fora do diretório de testes: ${file}`,
          severity: 'HIGH',
          recommendation: 'Remover o arquivo de mock da branch de produção ou movê-lo para tests/.',
          action: 'Deletar arquivo ou isolar escopo.'
        });
      }

      // Procura declarações de mocks hardcoded
      if (content.includes('const mock') || content.includes('let mock')) {
        findings.push({
          file: fullPath,
          risk: `Variável de mock hardcoded encontrada no código produtivo.`,
          severity: 'HIGH',
          recommendation: 'Remover dados mockados, usar o Consolidated Runtime via API.',
          action: 'Limpar hardcoded mocks.'
        });
      }
    }
  }
}

console.log('Iniciando Mocks Audit...');
scanDirectory(path.join(process.cwd(), 'src'));

fs.writeFileSync(
  path.join(process.cwd(), 'mocks_audit_report.json'),
  JSON.stringify(findings, null, 2)
);

console.log(`Mocks Audit concluída. Encontrados ${findings.length} problemas.`);
if (findings.length > 0) {
  console.log('Verifique mocks_audit_report.json para mais detalhes.');
  process.exit(0);
}
