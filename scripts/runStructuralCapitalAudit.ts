import fs from 'fs';
import path from 'path';

console.log('🚀 Iniciando Auditoria de Governança Estrutural (Structural Capital)...');

let hasErrors = false;
const componentsDir = path.join(process.cwd(), 'src', 'components');
const structuralCapitalDir = path.join(process.cwd(), 'src', 'core', 'runtime', 'structural-capital');

function walkDir(dir: string, callback: (filePath: string) => void) {
  if (!fs.existsSync(dir)) return;
  fs.readdirSync(dir).forEach(f => {
    const dirPath = path.join(dir, f);
    const isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(dirPath);
  });
}

console.log('Verificando imports em src/components/...');
walkDir(componentsDir, (filePath) => {
  if (filePath.endsWith('.tsx') || filePath.endsWith('.ts')) {
    const content = fs.readFileSync(filePath, 'utf-8');
    
    // Regra 1: Nenhum componente pode importar structural-capital
    if (content.includes('structural-capital')) {
      console.error(`❌ VIOLAÇÃO: Componente ${filePath} está importando da camada structural-capital.`);
      hasErrors = true;
    }

    // Regra 2: Nenhum componente pode calcular estoques, fornecedores ou creditosSocios do raw data
    // (só podem ler do report ou summary)
    const forbiddenPatterns = [
      /bpData\.reduce\(\(.*?estoque/i,
      /bpData.*?\.filter\(\(.*?fornecedor/i,
      /bpData.*?\.reduce\(\(.*?s[oó]cios/i
    ];

    forbiddenPatterns.forEach(pattern => {
      if (pattern.test(content)) {
         console.error(`❌ VIOLAÇÃO: Componente ${filePath} contém cálculos manuais proibidos de rubricas estruturais.`);
         hasErrors = true;
      }
    });
  }
});

console.log('Verificando Composer Narrativo...');
const composerPath = path.join(structuralCapitalDir, 'StructuralNarrativeComposer.ts');
if (fs.existsSync(composerPath)) {
  const content = fs.readFileSync(composerPath, 'utf-8');
  const forbiddenWords = ['colapso', 'insolvente', 'fraude', 'má-fé', 'irregularidade'];
  forbiddenWords.forEach(word => {
    if (content.toLowerCase().includes(word)) {
      console.error(`❌ VIOLAÇÃO: StructuralNarrativeComposer contém palavra proibida: "${word}"`);
      hasErrors = true;
    }
  });
}

if (hasErrors) {
  console.error('🚨 Auditoria falhou! Corrija as violações acima antes de commitar.');
  process.exit(1);
} else {
  console.log('✅ Auditoria concluída com sucesso. Zero violações de governança estrutural.');
  process.exit(0);
}
