import { describe, it, expect } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';

describe('NoPrescriptiveIntelligence', () => {
  it('should not contain prescriptive language in intelligence and experience layers', () => {
    const prescriptiveTerms = [
      ' recomenda-se ',
      ' precisa ',
      ' é recomendado',
      ' é necessário',
      ' é fundamental',
      ' requer intervenção',
      ' demanda ação',
      ' deve ser corrigido',
      ' a empresa precisa',
      ' é aconselhável',
      ' exige intervenção',
      ' exige intervenções',
      ' precisa implementar',
      ' deve revisar',
      ' deve aumentar',
      ' deve reduzir',
      ' deve ',
      ' devem '
    ];

    const dirsToScan = [
      path.join(__dirname, '../../../../capabilities/financial/intelligence'),
      path.join(__dirname, '../../../../capabilities/financial/application/usecases')
    ];

    const findFiles = (dir: string): string[] => {
      const results: string[] = [];
      const list = fs.readdirSync(dir);
      list.forEach((file) => {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        if (stat && stat.isDirectory()) {
          results.push(...findFiles(fullPath));
        } else if (fullPath.endsWith('.ts') && !fullPath.includes('.spec.')) {
          results.push(fullPath);
        }
      });
      return results;
    };

    let allFiles: string[] = [];
    dirsToScan.forEach(dir => {
      allFiles = allFiles.concat(findFiles(dir));
    });

    const violations: string[] = [];

    allFiles.forEach(file => {
      const content = fs.readFileSync(file, 'utf8').toLowerCase();
      
      prescriptiveTerms.forEach(term => {
        if (content.includes(term.toLowerCase())) {
          violations.push(`File ${path.basename(file)} contains prescriptive term: "${term}"`);
        }
      });
    });

    expect(violations, 'Found prescriptive language violations').toEqual([]);
  });
});
