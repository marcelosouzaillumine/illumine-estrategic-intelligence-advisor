import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

console.log('🔍 Iniciando Executive Workspace Audit...\n');

let hasErrors = false;

// 1. Check for Executive UI components directly importing Firebase
try {
  const result = execSync('grep -rn "import.*firebase" src/components/executive-workspace/ src/workspace/ | grep -v "adapters"', { encoding: 'utf-8' });
  if (result.trim()) {
    console.error('❌ ERRO: Componentes do Executive Workspace importando Firebase diretamente encontrados:');
    console.error(result);
    hasErrors = true;
  }
} catch (e) {
  console.log('✅ Executive Workspace não importa Firebase diretamente.');
}

// 2. Check for legacy widget imports in new surfaces
try {
  const result = execSync('grep -rn "import.*/components/ui/" src/components/executive-workspace/widgets/', { encoding: 'utf-8' });
  if (result.trim()) {
    console.warn('⚠️ AVISO: Widgets executivos utilizando UI legada:');
    console.warn(result);
  }
} catch (e) {
  console.log('✅ Widgets executivos não utilizam UI legada.');
}

if (hasErrors) {
  console.error('\n❌ Falha na auditoria do Workspace. Verifique os erros acima.');
  process.exit(1);
} else {
  console.log('\n✨ Auditoria do Workspace concluída com sucesso. Zero regressões ao legado.');
}
