import test from 'node:test';
import assert from 'node:assert';
import fs from 'fs';
import path from 'path';

test('[DRE] Integrity: No Test Deletion', () => {
  const testsDir = path.join(process.cwd(), 'src/tests/dre');
  const files = fs.readdirSync(testsDir);
  const testFiles = files.filter(f => f.endsWith('.test.ts'));
  
  // Exigência de que existam ao menos 37 arquivos de teste na suite
  // Se esse número cair, alguém apagou testes de forma irregular
  assert.ok(testFiles.length >= 37, `A suite de testes da DRE deve conter no mínimo 37 testes. Foram encontrados apenas ${testFiles.length}. Proibido apagar testes para passar a build.`);
});
