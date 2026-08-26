import { describe, it, expect } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';

function getFilesRecursively(directory: string): string[] {
  let results: string[] = [];
  if (!fs.existsSync(directory)) return results;
  const list = fs.readdirSync(directory);
  list.forEach(file => {
    const filePath = path.join(directory, file);
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      results = results.concat(getFilesRecursively(filePath));
    } else if (file.endsWith('.ts') || file.endsWith('.tsx')) {
      results.push(filePath);
    }
  });
  return results;
}

describe('Executive Experience Constitution Lock', () => {
  const constitutionPath = path.resolve(__dirname, '../../constitution');
  const runtimePath = path.resolve(__dirname, '../../runtime');
  const registryPath = path.resolve(__dirname, '../../registry');

  it('Constitution Layer must not import React, UI, or specific financial domains', () => {
    const files = getFilesRecursively(constitutionPath);
    
    files.forEach(file => {
      const content = fs.readFileSync(file, 'utf-8');
      
      // React / UI
      expect(content, `File ${path.basename(file)} imports React`).not.toMatch(/from\s+['"]react['"]/);
      expect(content, `File ${path.basename(file)} imports UI components`).not.toMatch(/from\s+['"].*\/components\/ui/);
      expect(file, `File ${path.basename(file)} must not be a .tsx file`).not.toMatch(/\.tsx$/);
      
      // Specific Domains
      expect(content, `File ${path.basename(file)} imports FinancialPositionProduct`).not.toMatch(/FinancialPositionProduct/);
      expect(content, `File ${path.basename(file)} mentions BalanceSheet`).not.toMatch(/BalanceSheet/);
      expect(content, `File ${path.basename(file)} mentions DRE`).not.toMatch(/DRE/);
      expect(content, `File ${path.basename(file)} mentions CashFlow`).not.toMatch(/CashFlow/);
    });
  });

  it('Runtime Layer must not know specific financial domains', () => {
    const files = getFilesRecursively(runtimePath);
    
    files.forEach(file => {
      const content = fs.readFileSync(file, 'utf-8');
      expect(content, `File ${path.basename(file)} imports FinancialPositionProduct`).not.toMatch(/FinancialPositionProduct/);
      expect(content, `File ${path.basename(file)} mentions BalanceSheet`).not.toMatch(/BalanceSheet/);
      expect(content, `File ${path.basename(file)} mentions DRE`).not.toMatch(/DRE/);
      expect(content, `File ${path.basename(file)} mentions CashFlow`).not.toMatch(/CashFlow/);
    });
  });

  it('Registry Layer must not contain financial rules or indicators', () => {
    const files = getFilesRecursively(registryPath);
    
    files.forEach(file => {
      const content = fs.readFileSync(file, 'utf-8');
      // A proxy for calculations/rules inside registry
      expect(content, `File ${path.basename(file)} contains calculation tokens`).not.toMatch(/\b(liquidez|patrimonio|ativo|passivo|ebitda)\b/i);
    });
  });
});
