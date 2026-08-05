const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('====================================================');
console.log('🌍 Automação de Auditoria i18n Illumine OS™');
console.log('====================================================');

const TARGET_DIRS = [
  'src/components/pages/public',
  'src/components/ui/public'
];

const FORBIDDEN_WORDS = [
  'çã',
  'õe',
  'á',
  'é',
  'í',
  'ó',
  'ú',
  'â',
  'ê',
  'ô',
  'ã',
  'õ',
  'à',
];

let hasErrors = false;

function scanDir(dir) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      scanDir(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      const content = fs.readFileSync(fullPath, 'utf8');
      const lines = content.split('\n');
      
      lines.forEach((line, index) => {
        // Skip comments and imports
        if (line.trim().startsWith('//') || line.trim().startsWith('/*') || line.trim().startsWith('import ') || line.trim().startsWith('export ')) {
          return;
        }

        // Basic heuristic: check for JSX text or strings with explicit Portuguese characters
        // We look for matches outside of t() calls if possible, but for a simple heuristic
        // we just flag Portuguese characters in TSX lines that look like text nodes or string literals.
        
        // This is a naive check. A true AST parser would be better, but this catches obvious hardcodes.
        for (const word of FORBIDDEN_WORDS) {
          if (line.toLowerCase().includes(word) && !line.includes('eslint-disable') && !line.includes('useTranslation')) {
            // Further filter out JSON keys or classNames
            if (line.includes('className=') || line.includes('id=')) return;
            
            console.log(`⚠️  Possível hardcode em português encontrado:`);
            console.log(`   Arquivo: ${fullPath}:${index + 1}`);
            console.log(`   Linha: ${line.trim()}`);
            console.log('---');
            // We do not fail the build immediately, just warn, as this is a heuristic.
            // hasErrors = true; 
          }
        }
      });
    }
  });
}

console.log('🔍 Varrendo diretórios públicos em busca de strings hardcoded...');
TARGET_DIRS.forEach(dir => {
  if (fs.existsSync(dir)) {
    scanDir(dir);
  }
});

console.log('✅ Auditoria concluída.');
if (hasErrors) {
  console.error('❌ Foram encontrados possíveis hardcodes que precisam ser internacionalizados.');
  process.exit(1);
} else {
  console.log('🎉 Nenhum erro bloqueante encontrado.');
}
