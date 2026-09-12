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

describe('Executive Architecture Direction', () => {
  const constitutionPath = path.resolve(__dirname, '../../constitution');
  const runtimePath = path.resolve(__dirname, '../../runtime');
  const presentationPath = path.resolve(__dirname, '../../../../components/pages');

  it('Constitution must not depend on anything downstream', () => {
    const files = getFilesRecursively(constitutionPath);
    files.forEach(file => {
      const content = fs.readFileSync(file, 'utf-8');
      expect(content, `File ${path.basename(file)} imports from financial`).not.toMatch(/from\s+['"].*\/financial\//);
      expect(content, `File ${path.basename(file)} imports from presentation`).not.toMatch(/from\s+['"].*\/components\//);
    });
  });

  it('Presentation must not depend on Domain (must go through Application/Intelligence)', () => {
    const files = getFilesRecursively(presentationPath);
    files.forEach(file => {
      // Ignore root and layout things for now, let's focus on financial pages
      if (file.includes('balance-sheet') || file.includes('income-statement')) {
        const content = fs.readFileSync(file, 'utf-8');
        expect(content, `File ${path.basename(file)} directly imports domain logic`).not.toMatch(/from\s+['"].*\/domain\//);
      }
    });
  });
});
