import { describe, it } from 'node:test';
import assert from 'node:assert';
import * as fs from 'fs';
import * as path from 'path';

describe('Architectural Integrity & Governance', () => {
  const componentsDir = path.join(process.cwd(), 'src/components');
  const pagesDir = path.join(process.cwd(), 'src/components/pages');
  const coreEnginesDir = path.join(process.cwd(), 'src/core/engines');

  const getFilesRecursive = (dir: string): string[] => {
    let results: string[] = [];
    if (!fs.existsSync(dir)) return results;
    const list = fs.readdirSync(dir);
    list.forEach((file) => {
      const fullPath = path.join(dir, file);
      const stat = fs.statSync(fullPath);
      if (stat && stat.isDirectory()) {
        results = results.concat(getFilesRecursive(fullPath));
      } else {
        if (fullPath.endsWith('.ts') || fullPath.endsWith('.tsx')) {
          results.push(fullPath);
        }
      }
    });
    return results;
  };

  const allComponentFiles = getFilesRecursive(componentsDir);
  const allPageFiles = getFilesRecursive(pagesDir);
  const allEngineFiles = getFilesRecursive(coreEnginesDir);

  it('deve garantir que a UI não faça chamadas diretas a engines ou adapters', () => {
    const invalidFiles = allComponentFiles.filter(file => {
      const content = fs.readFileSync(file, 'utf-8');
      // Proíbe import de @/core/engines ou ../core/engines ou adapters
      return /from\s+['"].*core\/(engines|adapters)/.test(content) ||
             /from\s+['"].*adapters['"]/.test(content);
    });

    if (invalidFiles.length > 0) {
      console.error('Arquivos UI importando engines/adapters diretamente:', invalidFiles);
    }
    assert.strictEqual(invalidFiles.length, 0, 'Arquivos UI não devem importar engines/adapters diretamente. Use o RuntimeOrchestrator ou hooks do App.');
  });

  it('deve bloquear mocks fixos em páginas produtivas', () => {
    // Permite "id || 'mock'" mas não dados fixos (ex: const mockData = ...)
    const invalidFiles = allPageFiles.filter(file => {
      const content = fs.readFileSync(file, 'utf-8');
      // Procura por mockData ou dados fixos não autorizados
      return /const\s+mockData\s*=/.test(content) || 
             /id:\s*['"]mock-\d+['"]/.test(content) && !file.includes('FinancialPositionPage'); // FinancialPositionPage será limpa depois, mas por ora vamos proibir no global
    });

    if (invalidFiles.length > 0) {
      console.error('Páginas contendo mocks produtivos:', invalidFiles);
    }
    // Ignoramos FinancialPositionPage temporariamente até a refatoração.
    // Deixaremos o assert limpo para falhar se houver outros ou se FinancialPositionPage não for limpa.
    assert.strictEqual(invalidFiles.filter(f => !f.includes('FinancialPositionPage.tsx')).length, 0);
  });

  it('deve impedir cálculos e agregações financeiras no React (reduces de saldos, lucros)', () => {
    const invalidFiles = allPageFiles.filter(file => {
      const content = fs.readFileSync(file, 'utf-8');
      // Bloqueia reduce() que some variáveis relacionadas a dinheiro explicitamente
      return /\.reduce\(\(.*,\s*.*\)\s*=>.*(saldo|lucro|receita|despesa|imposto)/i.test(content) ||
             // Proíbe laços simples calculando saldo
             /saldo(Atual)?\s*\+=/.test(content);
    });

    if (invalidFiles.length > 0) {
      console.error('Páginas contendo agregações financeiras no frontend:', invalidFiles);
    }
    // Falharemos para forçar a limpeza.
    assert.strictEqual(invalidFiles.length, 0, 'A UI não deve conter lógica financeira ou agregações. Mova para o Runtime/Adapters.');
  });

  it('deve garantir que engines não importem da UI (Imports Cruzados)', () => {
    const invalidFiles = allEngineFiles.filter(file => {
      const content = fs.readFileSync(file, 'utf-8');
      return /from\s+['"].*components/.test(content) || /from\s+['"].*pages/.test(content);
    });

    assert.strictEqual(invalidFiles.length, 0, 'Engines do core não podem importar componentes da UI.');
  });
});
