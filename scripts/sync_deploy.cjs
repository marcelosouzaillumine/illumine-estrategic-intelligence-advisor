const { execSync } = require('child_process');

function run(cmd, ignoreError = false) {
  try {
    console.log(`\n> ${cmd}`);
    return execSync(cmd, { stdio: 'inherit' });
  } catch (err) {
    if (!ignoreError) {
      console.error(`\n❌ Falha na execução do comando: ${cmd}`);
      process.exit(1);
    }
  }
}

console.log('====================================================');
console.log('🚀 Automação de Deploy & Sincronização Illumine OS™');
console.log('====================================================');

// 1. Checagem estrita de tipos
console.log('\n🔍 [Passo 1/5] Executando Typecheck estrito...');
run('npm run typecheck');

// 2. Commit de alterações locais pendentes (se houver)
console.log('\n📦 [Passo 2/5] Verificando alterações locais pendentes...');
const status = execSync('git status --porcelain').toString().trim();
if (status) {
  console.log('   Adicionando e commitando arquivos pendentes...');
  run('git add -A');
  run('git commit -m "feat: sync codebase updates for production deploy"');
} else {
  console.log('   Nenhuma alteração pendente.');
}

// 3. Push da branch atual (pilot)
console.log('\n⬆️ [Passo 3/5] Enviando atualizações para origin/pilot...');
const currentBranch = execSync('git rev-parse --abbrev-ref HEAD').toString().trim();
run(`git push origin ${currentBranch}`);

// 4. Merge e Push para a branch main (Vercel Production)
if (currentBranch !== 'main') {
  console.log('\n🔀 [Passo 4/5] Mesclando na branch main (Vercel Production)...');
  run('git checkout main');
  run(`git merge ${currentBranch}`);
  run('git push origin main');
  run(`git checkout ${currentBranch}`);
}

console.log('\n====================================================');
console.log('✨ DEPLOY CONCLUÍDO COM SUCESSO!');
console.log('   GitHub (main) e Vercel (Produção) atualizados.');
console.log('====================================================\n');
