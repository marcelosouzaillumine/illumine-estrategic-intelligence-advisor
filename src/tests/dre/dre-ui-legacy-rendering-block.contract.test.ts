import { describe, it } from 'node:test';
import * as assert from 'node:assert';
import * as fs from 'node:fs';
import * as path from 'node:path';

describe('DRE UI Legacy Rendering Block Contract', () => {
  it('must not contain legacy rendering components or prohibited strings in DREPage.tsx and dre/ directory', () => {
    const drePagePath = path.join(process.cwd(), 'src/components/pages/DREPage.tsx');
    const dreDir = path.join(process.cwd(), 'src/components/pages/dre');

    const bannedStrings = [
      'posição patrimonial',
      'War Room',
      'market-share',
      'top-line',
      'bottom-line',
      'unit economics',
      'Fórmula Canonical',
      'Camada Técnica & KPIs',
      'Inteligência de Escala e Crescimento',
      'Destaques',
      'Insights de Resultado',
      'cash flow',
      'caixa livre',
      'baseline inviolável',
      'alta tração',
      'alavancagem positiva',
      'Múltiplos de Valuation',
      'dividendos operacionais viáveis',
      'queima de caixa estrutural',
      'fluxo de caixa operacional'
    ];

    const filesToCheck: string[] = [];
    if (fs.existsSync(drePagePath)) filesToCheck.push(drePagePath);

    if (fs.existsSync(dreDir)) {
      const dreFiles = fs.readdirSync(dreDir)
        .filter(f => f.endsWith('.tsx') || f.endsWith('.ts'))
        .map(f => path.join(dreDir, f));
      filesToCheck.push(...dreFiles);
    }

    const errors: string[] = [];

    for (const file of filesToCheck) {
      const content = fs.readFileSync(file, 'utf-8');
      
      for (const banned of bannedStrings) {
        if (content.toLowerCase().includes(banned.toLowerCase())) {
          errors.push(`Prohibited string "${banned}" found in ${path.basename(file)}`);
        }
      }
    }

    if (errors.length > 0) {
      assert.fail(`Legacy rendering blocks or prohibited strings found in UI:\n${errors.join('\n')}`);
    }
  });
});
